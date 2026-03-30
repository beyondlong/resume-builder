import React, { useState, useRef } from 'react';
import {
  Button,
  Modal,
  Collapse,
  Empty,
} from 'antd';
import {
  DeleteFilled,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import arrayMove from 'array-move';
import _ from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import { FormCreator } from '../FormCreator';
import { CONTENT_OF_MODULE } from '@/helpers/contant';
import type { ResumeConfig } from '../types';

const { Panel } = Collapse;
const type = 'DragableBodyRow';

type Props = {
  moduleKey: string;
  config: ResumeConfig;
  onChange: (partial: Partial<ResumeConfig>) => void;
};

const DragableRow: React.FC<{
  index: number;
  moveRow: (oldIdx: number, newIdx: number) => void;
  children: React.ReactNode;
}> = ({ index, moveRow, ...restProps }) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
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
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));

  return (
    <div
      ref={ref}
      className={`${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', marginBottom: 8 }}
      {...restProps}
    />
  );
};

const ListModuleEditor: React.FC<{
  moduleKey: string;
  items: any[];
  onChange: (newItems: any[]) => void;
}> = ({ moduleKey, items = [], onChange }) => {
  const intl = useIntl();
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const contentOfModule = CONTENT_OF_MODULE({ intl });
  const formConfig = contentOfModule[moduleKey] || [];

  const getItemSummary = (item: any, index: number): string => {
    const summaryFields = ['school', 'company_name', 'project_name', 'skill_name', 'award_info', 'work_name'];
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

  const handleFormChange = (values: any) => {
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

  const handlePanelChange = (keys: string[]) => {
    if (keys.length === 0) {
      setExpandedKey(null);
    } else {
      setExpandedKey(Number(keys[0]));
    }
  };

  const moveRow = (oldIdx: number, newIdx: number) => {
    onChange(arrayMove(items, oldIdx, newIdx));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="list-module-editor">
        <Button
          className="add-btn"
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          <FormattedMessage id="添加" />
        </Button>

        <Collapse
          activeKey={expandedKey !== null ? [String(expandedKey)] : []}
          onChange={handlePanelChange}
        >
          {items.map((item, index) => (
            <Panel
              key={index}
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span>{getItemSummary(item, index)}</span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <EditOutlined
                      onClick={() => handleEdit(item, index)}
                      style={{ marginRight: 8, color: '#667eea' }}
                    />
                    <DeleteFilled
                      onClick={() => handleDelete(index)}
                      style={{ color: '#ff4d4f' }}
                    />
                  </span>
                </div>
              }
            >
              <DragableRow index={index} moveRow={moveRow}>
                <div>
                  {editingKey === index ? (
                    <FormCreator
                      config={formConfig}
                      value={editingItem || item}
                      isList={true}
                      onChange={handleFormChange}
                    />
                  ) : (
                    <div className="item-preview">
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: 8 }}>
                          <strong style={{ color: '#667eea' }}>{key}:</strong> {String(value)}
                        </div>
                      ))}
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
              </DragableRow>
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

export const ModuleForm: React.FC<Props> = ({ moduleKey, config, onChange }) => {
  const intl = useIntl();
  const contentOfModule = CONTENT_OF_MODULE({ intl });

  const isListModule = _.endsWith(moduleKey, 'List');
  const formConfig = contentOfModule[moduleKey] || [];
  const moduleData = _.get(config, moduleKey);

  const handleNonListChange = (values: any) => {
    onChange({ [moduleKey]: { ...moduleData, ...values } });
  };

  const handleListChange = (newItems: any[]) => {
    onChange({ [moduleKey]: newItems });
  };

  if (isListModule) {
    return (
      <ListModuleEditor
        moduleKey={moduleKey}
        items={moduleData || []}
        onChange={handleListChange}
      />
    );
  }

  return (
    <FormCreator
      config={formConfig}
      value={moduleData || {}}
      isList={false}
      onChange={handleNonListChange}
    />
  );
};