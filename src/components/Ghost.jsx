// Ghost.js
import React from 'react';
import { Box } from '@mui/material';

const Ghost = () => {
  return (
    <Box
      sx={{
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        borderRadius: '50%',
      }}
    />
  );
};

export default Ghost;