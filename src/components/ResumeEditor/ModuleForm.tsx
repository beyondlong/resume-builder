import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Collapse, Empty } from 'antd';
import { DeleteFilled, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import arrayMove from 'array-move';
import _ from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import { FormCreator } from '../FormCreator';
import { getResumeModuleFields } from '@/config/resume-fields';
import type { ResumeConfig } from '../types';
import type { ResumeModuleField, ResumeModuleKey } from '@/config/types';
import type { CollapseProps } from 'antd';

const { Panel } = Collapse;
const type = 'DragableBodyRow';

type Props = {
  moduleKey: ResumeModuleKey;
  config: ResumeConfig;
  onChange: (partial: Partial<ResumeConfig>) => void;
};

const DraggablePanelHeader: React.FC<{
  index: number;
  moveRow: (oldIdx: number, newIdx: number) => void;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ index, moveRow, title, onEdit, onDelete }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const dragItem = (monitor.getItem() || {}) as { index?: number };
      const dragIndex = dragItem.index;
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: { index: number }) => {
      moveRow(item.index, index);
    },
  });

  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));

  return (
    <div
      ref={ref}
      className={`list-panel-header${isOver ? dropClassName : ''}`}
    >
      <span className="list-panel-title">{title}</span>
      <span className="list-panel-actions" onClick={e => e.stopPropagation()}>
        <EditOutlined onClick={onEdit} className="list-panel-action edit" />
        <DeleteFilled onClick={onDelete} className="list-panel-action delete" />
      </span>
    </div>
  );
};

const ListModuleEditor: React.FC<{
  moduleKey: ResumeModuleKey;
  items: Array<Record<string, unknown>>;
  onChange: (newItems: Array<Record<string, unknown>>) => void;
}> = ({ moduleKey, items = [], onChange }) => {
  const intl = useIntl();
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Record<
    string,
    unknown
  > | null>(null);

  useEffect(() => {
    setExpandedKey(null);
    setEditingKey(null);
    setEditingItem(null);
  }, [moduleKey]);

  // Always get fresh contentOfModule to ensure translations are current
  const contentOfModule = getResumeModuleFields({ intl });
  const formConfig = (contentOfModule[moduleKey] || []) as ResumeModuleField[];

  const getItemSummary = (
    item: Record<string, unknown>,
    index: number
  ): string => {
    const summaryFields = [
      'school',
      'company_name',
      'project_name',
      'skill_name',
      'award_info',
      'work_name',
    ];
    for (const field of summaryFields) {
      if (item[field]) {
        return `${index + 1}. ${item[field]}`;
      }
    }
    return `${index + 1}`;
  };

  const handleAdd = () => {
    setEditingItem({});
    setEditingKey(-1); // -1 表示新增
    // 不设置 expandedKey，保持 Collapse 关闭状态
  };

  const handleEdit = (item: any, index: number) => {
    setEditingItem({ ...item, dataIndex: index });
    setEditingKey(index);
  };

  const handleDelete = (index: number) => {
    Modal.confirm({
      title: intl.formatMessage({ id: '确认删除' }),
      onOk: () => {
        onChange(items.filter((_, i) => i !== index));
      },
    });
  };

  const handleFormChange = (values: Record<string, unknown>) => {
    if (editingKey === -1) {
      // 新增
      onChange([...items, values]);
    } else {
      // 编辑
      const newItems = [...items];
      newItems[editingKey] = { ...newItems[editingKey], ...values };
      onChange(newItems);
    }
    setEditingKey(null);
    setEditingItem(null);
  };

  const handleFormClose = () => {
    setEditingKey(null);
    setEditingItem(null);
    setExpandedKey(null);
  };

  const handlePanelChange: CollapseProps['onChange'] = key => {
    if (!key || (Array.isArray(key) && key.length === 0)) {
      setExpandedKey(null);
      return;
    }

    setExpandedKey(Number(Array.isArray(key) ? key[0] : key));
  };

  const moveRow = (oldIdx: number, newIdx: number) => {
    onChange(arrayMove(items, oldIdx, newIdx));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="list-module-editor">
        <Button className="add-btn" onClick={handleAdd} icon={<PlusOutlined />}>
          <FormattedMessage id="添加" />
        </Button>

        <Collapse
          activeKey={expandedKey !== null ? [String(expandedKey)] : []}
          onChange={handlePanelChange}
          accordion={true}
        >
          {items.map((item, index) => (
            <Panel
              key={index}
              header={
                <DraggablePanelHeader
                  index={index}
                  moveRow={moveRow}
                  title={getItemSummary(item, index)}
                  onEdit={() => handleEdit(item, index)}
                  onDelete={() => handleDelete(index)}
                />
              }
            >
              <div>
                {editingKey === index ? (
                  <FormCreator
                    config={formConfig}
                    value={editingItem || item}
                    isList={true}
                    moduleKey={moduleKey}
                    itemIndex={index}
                    onChange={handleFormChange}
                  />
                ) : (
                  <div className="item-preview">
                    {Object.entries(item)
                      .filter(([key]) => key !== 'dataIndex')
                      .map(([key, value]) => {
                        // Find the translated label from formConfig
                        const fieldConfig = formConfig.find(
                          f => f.attributeId === key
                        );
                        const label = fieldConfig?.displayName || key;
                        return (
                          <div key={key} style={{ marginBottom: 8 }}>
                            <strong style={{ color: '#667eea' }}>
                              {label}:
                            </strong>{' '}
                            {String(value)}
                          </div>
                        );
                      })}
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(item, index)}
                      style={{ marginTop: 8 }}
                    >
                      编辑
                    </Button>
                  </div>
                )}
              </div>
            </Panel>
          ))}
        </Collapse>

        {/* 新增表单 */}
        {editingKey === -1 && (
          <div className="edit-form-container">
            <div className="edit-form-header">
              <span>添加</span>
              <Button type="text" size="small" onClick={handleFormClose}>
                关闭
              </Button>
            </div>
            <FormCreator
              config={formConfig}
              value={editingItem || {}}
              isList={true}
              moduleKey={moduleKey}
              onChange={handleFormChange}
            />
          </div>
        )}

        {items.length === 0 && editingKey !== -1 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={intl.formatMessage({ id: '暂无数据' })}
          />
        )}
      </div>
    </DndProvider>
  );
};

export const ModuleForm: React.FC<Props> = ({
  moduleKey,
  config,
  onChange,
}) => {
  const intl = useIntl();
  // Always get fresh contentOfModule to ensure translations are current
  const contentOfModule = getResumeModuleFields({ intl });

  const isListModule = _.endsWith(moduleKey, 'List');
  const formConfig = (contentOfModule[moduleKey] || []) as ResumeModuleField[];
  const moduleData = _.get(config, moduleKey);
  const listModuleData = Array.isArray(moduleData)
    ? (moduleData as Array<Record<string, unknown>>)
    : [];
  const objectModuleData =
    moduleData && typeof moduleData === 'object' && !Array.isArray(moduleData)
      ? (moduleData as Record<string, unknown>)
      : {};

  const handleNonListChange = (values: Record<string, unknown>) => {
    onChange({ [moduleKey]: { ...objectModuleData, ...values } });
  };

  const handleListChange = (newItems: Array<Record<string, unknown>>) => {
    onChange({ [moduleKey]: newItems });
  };

  if (isListModule) {
    return (
      <ListModuleEditor
        moduleKey={moduleKey}
        items={listModuleData}
        onChange={handleListChange}
      />
    );
  }

  return (
    <FormCreator
      config={formConfig}
      value={objectModuleData}
      isList={false}
      moduleKey={moduleKey}
      onChange={handleNonListChange}
    />
  );
};
