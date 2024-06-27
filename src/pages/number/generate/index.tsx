import { Box } from '@mui/material';
import React, { useState } from 'react';
import ToolTextResult from '../../../components/result/ToolTextResult';
import * as Yup from 'yup';
import ToolOptions from '../../../components/options/ToolOptions';
import { listOfIntegers } from './service';
import ToolInputAndResult from '../../../components/ToolInputAndResult';
import TextFieldWithDesc from '../../../components/options/TextFieldWithDesc';

const initialValues = {
  firstValue: '1',
  numberOfNumbers: '10',
  step: '1',
  separator: '\\n'
};
export default function SplitText() {
  const [result, setResult] = useState<string>('');

  const validationSchema = Yup.object({
    // splitSeparator: Yup.string().required('The separator is required')
  });

  return (
    <Box>
      <ToolInputAndResult
        result={<ToolTextResult title={'Total'} value={result} />}
      />
      <ToolOptions
        getGroups={({ values, setFieldValue }) => [
          {
            title: 'Arithmetic sequence option',
            component: (
              <Box>
                <TextFieldWithDesc
                  description={'Start sequence from this number.'}
                  value={values.firstValue}
                  onChange={(val) => setFieldValue('firstValue', val)}
                  type={'number'}
                />
                <TextFieldWithDesc
                  description={'Increase each element by this amount'}
                  value={values.step}
                  onChange={(val) => setFieldValue('step', val)}
                  type={'number'}
                />
                <TextFieldWithDesc
                  description={'Number of elements in sequence.'}
                  value={values.numberOfNumbers}
                  onChange={(val) => setFieldValue('numberOfNumbers', val)}
                  type={'number'}
                />
              </Box>
            )
          },
          {
            title: 'Separator',
            component: (
              <TextFieldWithDesc
                description={
                  'Separate elements in the arithmetic sequence by this character.'
                }
                value={values.separator}
                onChange={(val) => setFieldValue('separator', val)}
              />
            )
          }
        ]}
        compute={(optionsValues) => {
          const { firstValue, numberOfNumbers, separator, step } =
            optionsValues;
          setResult(
            listOfIntegers(
              Number(firstValue),
              Number(numberOfNumbers),
              Number(step),
              separator
            )
          );
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
      />
    </Box>
  );
}
