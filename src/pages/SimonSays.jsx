import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { Howl, Howler } from 'howler';
import { ThemeProvider } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import theme from './../theme';

// Define sound effects
const sounds = {
  green: new Howl({ src: ['/assets/button.wav'] }),
  red: new Howl({ src: ['/assets/button.wav'] }),
  yellow: new Howl({ src: ['/assets/button.wav'] }),
  blue: new Howl({ src: ['/assets/button.wav'] }),
  wrong: new Howl({ src: ['/assets/button.wav'] }),
  click: new Howl({ src: ['/assets/button.wav'] }) // Sound for clicks
};

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [muted, setMuted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const colors = ['green', 'red', 'yellow', 'blue'];
  const navigate = useNavigate();

  useEffect(() => {
    // Preload sounds
    Object.values(sounds).forEach(sound => sound.load());

    let timerId;
    if (isPlaying && !isPaused) {
      timerId = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [isPlaying, isPaused]);

  const nextSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * 4)];
    setSequence(prev => [...prev, randomColor]);
    playSequence([...sequence, randomColor]);
    setUserSequence([]);
    setLevel(prev => prev + 1);
  };

  const playSequence = (seq) => {
    seq.forEach((color, index) => {
      setTimeout(() => {
        playSound(color);
        animatePress(color);
      }, (index + 1) * 600);
    });
  };

  const handleUserClick = (color) => {
    if (!isPlaying || isPaused) return;

    playSound(color);
    sounds.click.play(); // Play click sound
    animatePress(color);
    setUserSequence(prev => [...prev, color]);

    if (color !== sequence[userSequence.length]) {
      gameOver();
      return;
    }

    if (userSequence.length + 1 === sequence.length) {
      setTimeout(nextSequence, 1000);
    }
  };

  const playSound = (color) => {
    if (!muted) {
      sounds[color].play();
    }
  };

  const animatePress = (color) => {
    const button = document.getElementById(color);
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 100);
  };

  const startGame = () => {
    setIsPlaying(true);
    setSequence([]);
    setUserSequence([]);
    setLevel(0);
    setTimer(0);
    setIsPaused(false); // Ensure game is not paused when starting
    nextSequence();
  };

  const gameOver = () => {
    if (!muted) {
      sounds.wrong.play();
    }
    setIsPlaying(false);
    alert('Game Over! Press Start to try again.');
    setLeaderboard(prev => [...prev, { level, time: timer }]);
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
    Howler.mute(!muted);
  };

  const pauseGame = () => {
    setIsPaused(prev => !prev);
  };

  const resetLeaderboard = () => {
    setLeaderboard([]);
  };

  const showGameStats = () => {
    setShowStatsDialog(true);
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.level - a.level);

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h1" sx={{ color: theme.palette.primary.main, fontSize: '3rem' }}>Simon Says</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="secondary" sx={{ fontSize: '1rem', padding: '8px 16px' }} onClick={() => navigate('/Home')}>
                Home
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{  color: 'black', fontSize: '1rem', padding: '8px 16px' }} onClick={() => setShowDialog(true)}>
                Instructions
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontSize: '2rem' }}>Level: {level}</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }}>Timer: {timer}s</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: '20px', backgroundColor: theme.palette.background.paper, borderRadius: theme.shape.borderRadius }}>
            <Grid container spacing={2} justifyContent="center">
              {colors.map((color) => (
                <Grid item xs={6} sm={3} key={color}>
                  <Button
                    id={color}
                    fullWidth
                    sx={{
                      height: '100px', // Adjust size to match TenziesGame button sizes
                      borderRadius: '8px',
                      backgroundColor: color,
                      '&.pressed': {
                        backgroundColor: 'white',
                        transition: 'background-color 0.2s'
                      }
                    }}
                    onClick={() => handleUserClick(color)}
                    disabled={!isPlaying || isPaused}
                  >
                    &nbsp;
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" sx={{  color: 'black', height: '48px', width: '120px', fontSize: '1rem', padding: '8px' }} onClick={startGame} disabled={isPlaying}>
                Start
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{  color: 'black', height: '48px', width: '120px', fontSize: '1rem', padding: '8px' }} onClick={() => {
                setIsPlaying(false);
                setSequence([]);
                setUserSequence([]);
                setLevel(0);
                setTimer(0);
                setIsPaused(false);
              }} disabled={!isPlaying}>
                Restart
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{  color: 'black', height: '48px', width: '120px', fontSize: '1rem', padding: '8px' }} onClick={pauseGame} disabled={!isPlaying}>
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" sx={{  color: 'black', height: '48px', width: '120px', fontSize: '1rem', padding: '8px' }} onClick={resetLeaderboard}>
                Reset Leaderboard
              </Button>
            </Grid>
            <Grid item>
            <Button variant="contained" sx={{ color: 'black', height: '48px', width: '120px', fontSize: '1rem', padding: '8px' }} onClick={showGameStats}>
                Stats
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle>Instructions</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="body1">
                <strong>Simon Says</strong> est un jeu de mémoire où vous devez répéter une séquence de couleurs que Simon joue. À chaque tour, une couleur est ajoutée à la séquence. Votre tâche est de suivre la séquence correcte pour gagner. Cliquez sur les boutons colorés dans l'ordre correct pour gagner.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showStatsDialog} onClose={() => setShowStatsDialog(false)}>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {sortedLeaderboard.length > 0 ? (
                <ul>
                  {sortedLeaderboard.map((entry, index) => (
                    <li key={index}>
                      <Typography variant="body1">Level: {entry.level} | Time: {entry.time}s</Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1">No scores available.</Typography>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowStatsDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </ThemeProvider>
  );
};

export default SimonSays;
