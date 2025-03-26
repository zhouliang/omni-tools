import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import * as Yup from 'yup';
import ToolFileResult from '@components/result/ToolFileResult';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import ToolImageInput from '@components/input/ToolImageInput';
import { removeBackground } from '@imgly/background-removal';

const initialValues = {};

const validationSchema = Yup.object({});

export default function RemoveBackgroundFromPng({ title }: ToolComponentProps) {
  const [input, setInput] = useState<File | null>(null);
  const [result, setResult] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const compute = async (_optionsValues: typeof initialValues, input: any) => {
    if (!input) return;

    setIsProcessing(true);

    try {
      // Convert the input file to a Blob URL
      const inputUrl = URL.createObjectURL(input);

      // Process the image with the background removal library
      const blob = await removeBackground(inputUrl, {
        progress: (progress) => {
          console.log(`Background removal progress: ${progress}`);
        }
      });

      // Create a new file from the blob
      const newFile = new File(
        [blob],
        input.name.replace(/\.[^/.]+$/, '') + '-no-bg.png',
        {
          type: 'image/png'
        }
      );

      setResult(newFile);
    } catch (err) {
      console.error('Error removing background:', err);
      throw new Error(
        'Failed to remove background. Please try a different image or try again later.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolContent
      title={title}
      initialValues={initialValues}
      getGroups={null}
      compute={compute}
      input={input}
      validationSchema={validationSchema}
      inputComponent={
        <ToolImageInput
          value={input}
          onChange={setInput}
          accept={['image/png', 'image/jpeg', 'image/jpg']}
          title={'Input Image'}
        />
      }
      resultComponent={
        <>
          {isProcessing ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
              }}
            >
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Removing background... This may take a moment.
              </Typography>
            </Box>
          ) : (
            <ToolFileResult
              title={'Transparent PNG'}
              value={result}
              extension={'png'}
            />
          )}
        </>
      }
      toolInfo={{
        title: 'Remove Background from PNG',
        description:
          'This tool uses AI to automatically remove the background from your images, creating a transparent PNG. Perfect for product photos, profile pictures, and design assets.'
      }}
    />
  );
}
