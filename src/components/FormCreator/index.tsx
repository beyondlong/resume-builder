import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Select } from 'antd';
import _ from 'lodash-es';
import { normalizeResumeDateFields } from '@/helpers/resume-dates';
import { ColorPicker } from './ColorPicker';
import { FormattedMessage, useIntl } from 'react-intl';
import { improveResumeField } from '@/services/ai/client';
import { ResumeModuleField, ResumeModuleKey } from '@/config/types';
import { AIImproveCandidate } from '@/services/ai/types';
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

export interface FormCreatorValue extends Record<string, unknown> {}

export interface FormCreatorProps {
  /** 表单配置 */
  config: ResumeModuleField[];
  /** 表单已配置内容 */
  value: FormCreatorValue;
  onChange: (v: FormCreatorValue) => void;
  /** 列表型内容 */
  isList: boolean;
  moduleKey: ResumeModuleKey;
  itemIndex?: number;
}

type FormItemComponentProps = Record<string, unknown>;
type FormFieldState = {
  name: string[];
  value: unknown;
};

const FormItemComponentMap = (type: string) => (
  props: FormItemComponentProps = {}
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
      return <ColorPicker {...props} />;
    default:
      return <Input />;
  }
};

const getFieldComponentProps = (
  type: string,
  cfg: FormItemComponentProps,
  value: unknown
): FormItemComponentProps => {
  if (type === 'checkbox') {
    return cfg;
  }

  return {
    ...cfg,
    value,
  };
};

const buildFormFields = (value: FormCreatorValue): FormFieldState[] =>
  Object.entries(value).map(([key, fieldValue]) => ({
    name: [key],
    value: fieldValue,
  }));

export const FormCreator: React.FC<FormCreatorProps> = props => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [fields, setFields] = useState<FormFieldState[]>([]);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<AIImproveCandidate[]>([]);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [loadingFieldId, setLoadingFieldId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextValue = props.value || {};

    setFields(buildFormFields(nextValue));
    form.setFieldsValue(nextValue);
  }, [form, props.value]);

  const handleListSubmit = (values: FormCreatorValue) => {
    props.onChange(normalizeResumeDateFields(values));
  };

  const handleValuesChange = (
    _changedValues: FormCreatorValue,
    allValues: FormCreatorValue
  ) => {
    props.onChange(normalizeResumeDateFields(allValues));
  };

  const currentActiveField = useMemo(
    () =>
      props.config.find(field => field.attributeId === activeFieldId) || null,
    [activeFieldId, props.config]
  );

  const applyCandidateToField = (fieldKey: string, content: string) => {
    const nextValues = {
      ...props.value,
      [fieldKey]: content,
    };

    form.setFieldsValue({
      [fieldKey]: content,
    });
    setFields(buildFormFields(nextValues));

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
        {props.config.map(c => {
          const aiEnabled = isAIField(c);
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
                        onClick={() => handleImproveClick(c)}
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
                    props.value[c.attributeId]
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
