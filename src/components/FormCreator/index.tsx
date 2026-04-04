import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import _ from 'lodash-es';
import { normalizeResumeDateFields } from '@/helpers/resume-dates';
import { ColorPicker } from './ColorPicker';
import { FormattedMessage, useIntl } from 'react-intl';
import { improveResumeField } from '@/services/ai/client';
import type { ResumeModuleField, ResumeModuleKey } from '@/config/types';
import type { AIImproveCandidate } from '@/services/ai/types';
import { AIImproveButton } from './AIImproveButton';
import { AICandidateModal } from './AICandidateModal';
import { buildAIRequestFromField, isAIField } from './ai-fields';
import './index.less';

const AI_ERROR_MESSAGE_IDS: Record<string, string> = {
  AI_PROXY_UNAVAILABLE: 'AI代理不可用',
  AI_PROVIDER_NOT_CONFIGURED: 'AI服务未配置',
  AI_INVALID_RESPONSE: 'AI返回结果解析失败',
  AI_UPSTREAM_REQUEST_FAILED: 'AI请求失败',
  AI_REQUEST_FAILED: 'AI请求失败',
};

type Props = {
  /** 表单配置 */
  config: Array<{
    type: string /** 组件类型 */;
    attributeId: string;
    displayName: string;
    formItemProps?: FormItemProps;
    cfg?: {
      [k: string]: any /**其它和组件本身有关的配置 */;
    };
  }>;
  /** 表单已配置内容 */
  value: {
    [key: string]: any;
  };
  onChange: (v: any) => void;
  /** 列表型内容 */
  isList: boolean;
  moduleKey: ResumeModuleKey;
  itemIndex?: number;
};

const FormItemComponentMap = (type: string) => (
  props: Record<string, any> = {}
) => {
  switch (type) {
    case 'checkbox':
      return <Checkbox {...props} />;
    case 'select':
      return <Select {...props} />;
    case 'input':
      return <Input {...props} />;
    case 'number':
      return <InputNumber {...props} />;
    case 'textArea':
      return <Input.TextArea {...props} />;
    case 'color-picker':
      return <ColorPicker {...(props as any)} />;
    default:
      return <Input />;
  }
};

const getFieldComponentProps = (
  type: string,
  cfg: Record<string, any>,
  value: unknown
) => {
  if (type === 'checkbox') {
    return cfg;
  }

  return {
    ...cfg,
    value,
  };
};

export const FormCreator: React.FC<Props> = props => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<AIImproveCandidate[]>([]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [loadingFieldId, setLoadingFieldId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const datas = Object.keys(props.value || {}).map(d => ({
      name: [d],
      value: props.value[d],
    }));
    setFields(datas);
    form.setFieldsValue(props.value || {});
  }, [form, props.value]);

  const handleListSubmit = (values: any) => {
    props.onChange(normalizeResumeDateFields(values));
  };

  const handleValuesChange = (_changedValues: any, allValues: any) => {
    props.onChange(normalizeResumeDateFields(allValues));
  };

  const currentActiveField = useMemo(
    () =>
      props.config.find(field => field.attributeId === activeFieldId) || null,
    [activeFieldId, props.config]
  );

  const applyCandidateToField = (fieldKey: string, content: string) => {
    const nextValues = {
      ...(props.value || {}),
      [fieldKey]: content,
    };

    form.setFieldsValue({
      [fieldKey]: content,
    });
    setFields(
      Object.keys(nextValues).map(key => ({
        name: [key],
        value: nextValues[key],
      }))
    );

    if (!props.isList) {
      props.onChange(normalizeResumeDateFields(nextValues));
    }
  };

  const handleImproveClick = async (field: ResumeModuleField) => {
    const currentValue = _.get(form.getFieldsValue(true), field.attributeId);

    if (!currentValue || typeof currentValue !== 'string') {
      setErrorMessage(intl.formatMessage({ id: 'AI字段内容为空' }));
      setActiveFieldId(field.attributeId);
      setCandidates([]);
      setCandidateModalOpen(true);
      return;
    }

    setLoadingFieldId(field.attributeId);
    setActiveFieldId(field.attributeId);
    setErrorMessage(null);

    try {
      const response = await improveResumeField(
        buildAIRequestFromField({
          field,
          moduleKey: props.moduleKey,
          itemIndex: props.itemIndex,
          sourceText: currentValue,
          language: intl.locale as 'zh-CN' | 'en-US',
        })
      );

      setCandidates(response.candidates);
      setCandidateModalOpen(true);
    } catch (error) {
      setCandidates([]);
      if (error instanceof Error) {
        const errorCode = error.name !== 'Error' ? error.name : error.message;
        const messageId = AI_ERROR_MESSAGE_IDS[errorCode];

        setErrorMessage(
          messageId
            ? intl.formatMessage({ id: messageId })
            : error.message || intl.formatMessage({ id: 'AI请求失败' })
        );
      } else {
        setErrorMessage(intl.formatMessage({ id: 'AI请求失败' }));
      }
      setCandidateModalOpen(true);
    } finally {
      setLoadingFieldId(null);
    }
  };

  const handleApplyCandidate = (candidate: AIImproveCandidate) => {
    if (!currentActiveField) {
      return;
    }

    applyCandidateToField(currentActiveField.attributeId, candidate.content);
    setCandidateModalOpen(false);
    setCandidates([]);
    setErrorMessage(null);
  };

  const formProps = {
    [props.isList ? 'onFinish' : 'onValuesChange']: props.isList
      ? handleListSubmit
      : handleValuesChange,
  };

  return (
    <div className="form-creator">
      <Form
        form={form}
        labelCol={{ span: 6 }}
        initialValues={props.value}
        fields={fields}
        {...formProps}
      >
        {_.map(props.config, c => {
          const aiEnabled = isAIField(c as ResumeModuleField);
          return (
            <React.Fragment key={c.attributeId}>
              <Form.Item
                label={
                  <div className="form-item-label-with-ai">
                    <span className="form-item-label-text">
                      {c.displayName}
                    </span>
                    {aiEnabled ? (
                      <AIImproveButton
                        loading={loadingFieldId === c.attributeId}
                        onClick={() =>
                          handleImproveClick(c as ResumeModuleField)
                        }
                      />
                    ) : null}
                  </div>
                }
                wrapperCol={c.displayName ? { span: 18 } : { span: 24 }}
                name={c.attributeId}
                {...(c.formItemProps || {})}
              >
                {FormItemComponentMap(c.type)({
                  ...getFieldComponentProps(
                    c.type,
                    c.cfg || {},
                    _.get(props.value, [c.attributeId])
                  ),
                })}
              </Form.Item>
              {errorMessage && activeFieldId === c.attributeId ? (
                <div className="ai-improve-inline-error">{errorMessage}</div>
              ) : null}
            </React.Fragment>
          );
        })}
        {props.isList && (
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="提交" />
            </Button>
          </Form.Item>
        )}
      </Form>
      <AICandidateModal
        open={candidateModalOpen}
        candidates={candidates}
        error={errorMessage}
        onApply={handleApplyCandidate}
        onCancel={() => {
          setCandidateModalOpen(false);
          setCandidates([]);
          setErrorMessage(null);
        }}
      />
    </div>
  );
};
