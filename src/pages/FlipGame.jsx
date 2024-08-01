// src/App.js

import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, ThemeProvider } from "@mui/material";
import { keyframes } from '@emotion/react';
import { Howl } from 'howler'; // Import Howler for sound
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import Pile from "./../components/Pile";
import Face from "./../components/Face";
import theme from '../theme';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

// Define the click sound
const clickSound = new Howl({ src: ['/assets/button.wav'] });

function FlipGame() {
  const navigate = useNavigate(); // Initialize navigate
  const [numberFlips, setNumberFlips] = useState(0);
  const [numberHeads, setNumberHeads] = useState(0);
  const [numberTails, setNumberTails] = useState(0);
  const [componentIndex, setComponentIndex] = useState(0);
  const [flipHistory, setFlipHistory] = useState([]);
  const [longestStreak, setLongestStreak] = useState({ heads: 0, tails: 0 });
  const [currentStreak, setCurrentStreak] = useState({ heads: 0, tails: 0 });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Animation happens only once on component mount
    const timer = setTimeout(() => {
      document.getElementById('animation-container').style.animation = `${bounce} 2s infinite`;
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  function playClickSound() {
    clickSound.play(); // Play the click sound
  }

  function handleFlip() {
    playClickSound(); // Play the click sound
    const index = Math.round(Math.random());
    setComponentIndex(index);
    setNumberFlips(prevNumberFlips => prevNumberFlips + 1);
    if (index === 0) {
      setNumberHeads(prevNumberHeads => prevNumberHeads + 1);
      setCurrentStreak(prevStreak => ({ ...prevStreak, heads: prevStreak.heads + 1, tails: 0 }));
    } else {
      setNumberTails(prevNumberTails => prevNumberTails + 1);
      setCurrentStreak(prevStreak => ({ ...prevStreak, tails: prevStreak.tails + 1, heads: 0 }));
    }

    setFlipHistory(prevHistory => [...prevHistory, index === 0 ? "Heads" : "Tails"]);

    if (currentStreak.heads > longestStreak.heads) {
      setLongestStreak(prevStreak => ({ ...prevStreak, heads: currentStreak.heads }));
    }
    if (currentStreak.tails > longestStreak.tails) {
      setLongestStreak(prevStreak => ({ ...prevStreak, tails: currentStreak.tails }));
    }
  }

  function handleReset() {
    playClickSound(); // Play the click sound
    setNumberFlips(0);
    setNumberHeads(0);
    setNumberTails(0);
    setFlipHistory([]);
    setCurrentStreak({ heads: 0, tails: 0 });
    setLongestStreak({ heads: 0, tails: 0 });
  }

  function handleOpenDialog() {
    playClickSound(); // Play the click sound
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    playClickSound(); // Play the click sound
    setOpenDialog(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container minHeight={"100vh"} sx={{ display: "flex", justifyContent: "center", alignItems: "center", background: theme.palette.background.default, padding: '20px' }}>
        <Paper sx={{ padding: "40px", borderRadius: theme.shape.borderRadius, background: theme.palette.background.paper, width: '100%', maxWidth: '800px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)' }}>
          <Grid container spacing={4} id="animation-container">
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Typography variant="h3" sx={{ fontFamily: theme.typography.fontFamily, color: theme.palette.primary.main }}>Let's Flip A Coin</Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              {componentIndex === 0 ? <Face /> : <Pile />}
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" size="large" onClick={handleFlip} sx={{ width: '150px', fontSize: '1.2rem', background: theme.palette.primary.main }}>
                    Flip Me!
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" size="large" onClick={handleOpenDialog} sx={{ width: '300px', fontSize: '1.2rem', background: theme.palette.primary.main }}>
                    Show Stats
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" size="large" onClick={handleReset} sx={{ width: '150px', fontSize: '1.2rem', color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {navigate('/Home') ; playClickSound(); }  }
                sx={{ mt: 3, ml: 2, width: '150px' }}
              >
                Home
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Flip Statistics</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Out of {numberFlips} flips, there have been {numberHeads} heads and {numberTails} tails
          </DialogContentText>
          <DialogContentText>
            Longest Heads Streak: {longestStreak.heads} | Longest Tails Streak: {longestStreak.tails}
          </DialogContentText>
          <DialogContentText>
            Flip History: {flipHistory.join(", ")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default FlipGame;
