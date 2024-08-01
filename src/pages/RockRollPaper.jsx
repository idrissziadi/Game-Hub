import React, { useState } from 'react';
import { Grid, Typography, Paper, IconButton, Tooltip, Button, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Howl } from 'howler';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home'; // Import Home icon from Material-UI
import theme from './../theme';
import rockImg from './../assets/rock.png';
import paperImg from './../assets/paper.png';
import scissorsImg from './../assets/scissors.png';
import clickSoundFile from './../assets/button.wav';
import paperSoundFile from './../assets/paper.mp3';
import rockSoundFile from './../assets/rock.mp3';
import scissorsSoundFile from './../assets/scissors.mp3';

const styles = {
  iconButton: {
    background: '#000',
    borderRadius: '15px',
    padding: '20px',
    transition: 'transform 0.3s, background-color 0.3s',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: '#FFFFFF',
    },
  },
  icon: {
    width: '60px',
    height: '60px',
  },
  paper: {
    padding: '30px',
    borderRadius: '15px',
    background: theme.palette.background.paper,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: theme.palette.background.default,
  },
  score: {
    margin: '10px 0',
  },
  inputField: {
    margin: '10px 0',
  },
};

// Initialize sounds using howler.js
const clickSound = new Howl({
  src: clickSoundFile,
});

const sounds = {
  PAPER: new Howl({ src: [paperSoundFile], volume: 1.0 }),
  ROCK: new Howl({ src: [rockSoundFile], volume: 1.0 }),
  SCISSORS: new Howl({ src: [scissorsSoundFile], volume: 1.0 }),
};

function RockRollPaper() {
  const [userChoice, setUserChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [rounds, setRounds] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);

  const navigate = useNavigate();

  function playGame(choice) {
    if (currentRound > rounds) return;

    // Play click sound
    clickSound.play();

    setUserChoice(choice);
    const choices = ['PAPER', 'ROCK', 'SCISSORS'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    const randomChoice = choices[randomIndex];
    setComputerChoice(randomChoice);

    // Play specific sound for the user's choice
    sounds[choice].play();

    if (
      (choice === 'PAPER' && randomChoice === 'ROCK') ||
      (choice === 'ROCK' && randomChoice === 'SCISSORS') ||
      (choice === 'SCISSORS' && randomChoice === 'PAPER')
    ) {
      setUserScore(prevScore => prevScore + 1);
    } else if (choice !== randomChoice) {
      setComputerScore(prevScore => prevScore + 1);
    }

    setCurrentRound(prevRound => prevRound + 1);
  }

  function resetGame() {
    setUserChoice('');
    setComputerChoice('');
    setUserScore(0);
    setComputerScore(0);
    setCurrentRound(1);
  }

  function handleRoundsChange(e) {
    setRounds(Number(e.target.value));
    resetGame();
  };

  function handleHome () {
    navigate('/Home');
    clickSound.play();

  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={styles.container}>
        <Grid item md={9} xs={12}>
          <Paper sx={styles.paper}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              WELCOME TO ROCK, PAPER, SCISSORS GAME
            </Typography>
            <TextField
              label="Number of Rounds"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              variant="outlined"
              value={rounds}
              onChange={handleRoundsChange}
              sx={styles.inputField}
            />
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              <Grid item md={3} xs={12}>
                <Tooltip title="Rock" placement="top">
                  <IconButton
                    onClick={() => playGame('ROCK')}
                    sx={styles.iconButton}
                  >
                    <img src={rockImg} alt="Rock" style={styles.icon} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={3} xs={12}>
                <Tooltip title="Paper" placement="top">
                  <IconButton
                    onClick={() => playGame('PAPER')}
                    sx={styles.iconButton}
                  >
                    <img src={paperImg} alt="Paper" style={styles.icon} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={3} xs={12}>
                <Tooltip title="Scissors" placement="top">
                  <IconButton
                    onClick={() => playGame('SCISSORS')}
                    sx={styles.iconButton}
                  >
                    <img src={scissorsImg} alt="Scissors" style={styles.icon} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Typography variant="h5" sx={styles.score}>
              Your Choice: {userChoice}
            </Typography>
            <Typography variant="h5" sx={styles.score}>
              Computer Choice: {computerChoice}
            </Typography>
            <Typography variant="h5" sx={styles.score}>
              Your Score: {userScore}
            </Typography>
            <Typography variant="h5" sx={styles.score}>
              Computer Score: {computerScore}
            </Typography>
            <Typography variant="h6" sx={styles.score}>
              Round: {currentRound - 1}/{rounds}
            </Typography>
            {currentRound > rounds && (
              <Typography variant="h6" sx={styles.score}>
                Game Over!
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={resetGame}
              sx={{ mt: 3 }}
            >
              Reset Game
            </Button>
            <Button
              variant="contained"
              color="secondary"
              
              onClick={handleHome}
              sx={{ mt: 3, ml: 2 }}
            >
              Home
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default RockRollPaper;
