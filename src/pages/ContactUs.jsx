// src/pages/ContactUs.js

import React, { useEffect } from 'react';
import { Grid, Box, Typography, TextField, Button, Container, Paper } from '@mui/material';
import DrawerAppBar from '../components/DrawerAppBar';
import Footer from '../components/Footer';
import { Howl } from 'howler';

// Load the input sound
const inputSound = new Howl({ src: ['/assets/keyboard.wav'] });

const ContactUs = () => {
  useEffect(() => {
    // Select all input fields
    const inputFields = document.querySelectorAll('input, textarea');

    // Function to play sound on input event
    const playInputSound = () => {
      inputSound.play();
    };

    // Add event listeners to input fields
    inputFields.forEach((inputField) => {
      inputField.addEventListener('input', playInputSound);
    });

    // Cleanup event listeners on component unmount
    return () => {
      inputFields.forEach((inputField) => {
        inputField.removeEventListener('input', playInputSound);
      });
    };
  }, []);

  return (
    <>
      <DrawerAppBar title="Game Hub" backgroundColor="#000000" />
      <Container sx={{ my: 4 }}>
        <Grid container spacing={4} minHeight="80vh">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'Do Hyeon, sans-serif',
                fontSize: '32px',
                lineHeight: '40px',
                fontWeight: 700,
                mb: 2,
                color: theme => theme.palette.primary.main,
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Do Hyeon, sans-serif',
                fontSize: '16px',
                lineHeight: '28px',
                fontWeight: 400,
                mb: 3,
              }}
            >
              If you have any questions or feedback, feel free to reach out to us. We’d love to hear from you!
            </Typography>
            <Paper
              sx={{
                padding: 3,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      type="email"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      variant="outlined"
                      multiline
                      rows={4}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        fontFamily: 'Do Hyeon, sans-serif',
                        fontSize: '16px',
                        fontWeight: 700,
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Do Hyeon, sans-serif',
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 700,
                mb: 2,
                color: theme => theme.palette.primary.main,
              }}
            >
              Our Contact Information
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Do Hyeon, sans-serif',
                fontSize: '16px',
                lineHeight: '28px',
                fontWeight: 400,
                mb: 2,
              }}
            >
              Email: contact@gamehub.com
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Do Hyeon, sans-serif',
                fontSize: '16px',
                lineHeight: '28px',
                fontWeight: 400,
                mb: 2,
              }}
            >
              Phone: +123 456 7890
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Do Hyeon, sans-serif',
                fontSize: '16px',
                lineHeight: '28px',
                fontWeight: 400,
                mb: 2,
              }}
            >
              Address: 123 Game Street, Gaming City, 12345
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ContactUs;
