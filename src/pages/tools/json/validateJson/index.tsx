import { Box } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import ToolInputAndResult from '@components/ToolInputAndResult';
import ToolInfo from '@components/ToolInfo';
import Separator from '@components/Separator';
import ToolExamples, {
  CardExampleType
} from '@components/examples/ToolExamples';
import { FormikProps } from 'formik';
import { validateJson } from './servcie';
import { ToolComponentProps } from '@tools/defineTool';

const exampleCards: CardExampleType<{}>[] = [
  {
    title: 'Valid JSON Object',
    description:
      'This example shows a correctly formatted JSON object. All property names and string values are enclosed in double quotes, and the overall structure is properly balanced with opening and closing braces.',
    sampleText: `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`,
    sampleResult: '✅ Valid JSON',
    sampleOptions: {}
  },
  {
    title: 'Invalid JSON Missing Quotes',
    description:
      'This example demonstrates an invalid JSON object where the property names are not enclosed in double quotes. According to the JSON standard, property names must always be enclosed in double quotes. Omitting the quotes will result in a syntax error.',
    sampleText: `{
  name: "John",
  age: 30,
  city: "New York"
}`,
    sampleResult: "❌ Error: Expected property name or '}' in JSON",
    sampleOptions: {}
  },
  {
    title: 'Invalid JSON with Trailing Comma',
    description:
      'This example shows an invalid JSON object with a trailing comma after the last key-value pair. In JSON, trailing commas are not allowed because they create ambiguity when parsing the data structure.',
    sampleText: `{
  "name": "John",
  "age": 30,
  "city": "New York",
}`,
    sampleResult: '❌ Error: Expected double-quoted property name',
    sampleOptions: {}
  }
];

export default function ValidateJson({ title }: ToolComponentProps) {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const formRef = useRef<FormikProps<{}>>(null);

  useEffect(() => {
    if (input) {
      compute(input);
    }
  }, [input]);

  const compute = (input: string) => {
    const { valid, error } = validateJson(input);

    if (valid) {
      setResult('✅ Valid JSON');
    } else {
      setResult(`❌ ${error}`);
    }
  };

  return (
    <Box>
      <ToolInputAndResult
        input={
          <ToolTextInput title="Input JSON" value={input} onChange={setInput} />
        }
        result={<ToolTextResult title="Validation Result" value={result} />}
      />

      <ToolInfo
        title="What is JSON Validation?"
        description="
          JSON (JavaScript Object Notation) is a lightweight data-interchange format.
          JSON validation ensures that the structure of the data conforms to the JSON standard.
          A valid JSON object must have:
          - Property names enclosed in double quotes.
          - Properly balanced curly braces `{}`.
          - No trailing commas after the last key-value pair.
          - Proper nesting of objects and arrays.
          This tool checks the input JSON and provides feedback to help identify and fix common errors.
        "
      />

      <Separator backgroundColor="#5581b5" margin="50px" />

      <ToolExamples
        title={title}
        exampleCards={exampleCards}
        getGroups={() => []}
        formRef={formRef}
        setInput={setInput}
      />
    </Box>
  );
}
