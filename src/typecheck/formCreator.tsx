import React from 'react';
import { FormCreator, FormCreatorProps } from '@/components/FormCreator';
import { ResumeModuleField } from '@/config/types';

const config: ResumeModuleField[] = [
  {
    type: 'input',
    attributeId: 'name',
    displayName: '姓名',
  },
];

const value: FormCreatorProps['value'] = {
  name: 'Test User',
};

const onChange: FormCreatorProps['onChange'] = nextValue => {
  const nextName = nextValue.name;

  void nextName;
};

void (
  <FormCreator
    config={config}
    value={value}
    onChange={onChange}
    isList={false}
    moduleKey="avatar"
  />
);

// @ts-expect-error Form values should remain object-shaped
const invalidValue: FormCreatorProps['value'] = 'invalid';

void invalidValue;
