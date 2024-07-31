// src/components/Footer.js

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.paper,
        color: theme => theme.palette.text.primary,
        padding: '16px',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Do Hyeon, sans-serif',
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: 400,
        }}
      >
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Link href="/privacy" color="inherit" sx={{ mx: 1 }}>
          Privacy Policy
        </Link>
        |
        <Link href="/terms" color="inherit" sx={{ mx: 1 }}>
          Terms of Service
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
