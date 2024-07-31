import React, { useState, useEffect } from 'react';
import { Button, Grid, IconButton, Paper, Typography, Modal, Box, Slider } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme
import { Howl } from 'howler';

// Updated paths assuming files are in the public/assets folder
const diceRollSound = new Howl({ src: ['/assets/dicerollsound.wav'] });
const winSound = new Howl({ src: ['./assets/win.mp3'] });
const loseSound = new Howl({ src: ['./assets/lose.mp3'] });
const clickSound = new Howl({ src: ['./assets/button.wav'] }); // Add click sound

function generateRandomNumber() {
  return Math.floor(Math.random() * 6) + 1; // Dice values between 1 and 6
}

const TenziesGame = () => {
  const theme = useTheme(); // Use the theme context

  const [numbers, setNumbers] = useState([]);
  const [time, setTime] = useState(60);
  const [rolls, setRolls] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [difficulty, setDifficulty] = useState(10); // Dice count

  useEffect(() => {
    let timer;
    if (gameStarted && time > 0 && !gameWon) {
      timer = setInterval(() => setTime(prevTime => prevTime - 1), 1000);
    } else if (time === 0) {
      setGameStarted(false);
      setGameLost(true);
      loseSound.play();
    }
    return () => clearInterval(timer);
  }, [gameStarted, time, gameWon]);

  useEffect(() => {
    if (numbers.length > 0 && checkWinCondition(numbers)) {
      setGameStarted(false);
      setGameWon(true);
      winSound.play();
    }
  }, [numbers]);

  const handleShowInstructions = () => {
    setModalOpen(true);
    clickSound.play(); // Play click sound
  };

  const handleCloseInstructions = () => {
    setModalOpen(false);
    clickSound.play(); // Play click sound
  };

  const checkWinCondition = (dice) => {
    const firstNumber = dice[0].number;
    return dice.every(die => die.number === firstNumber && die.clicked);
  };

  const handleChoose = (index) => {
    if (!gameStarted) return;

    setNumbers(oldNumbers =>
      oldNumbers.map((item, idx) => {
        if (idx === index) {
          return { ...item, clicked: !item.clicked };
        } else {
          return item;
        }
      })
    );
  };

  const handleRollDice = () => {
    if (!gameStarted || gameWon) return;

    diceRollSound.play();
    setRolls(rolls => rolls + 1);
    setNumbers(oldNumbers =>
      oldNumbers.map((item) => {
        if (!item.clicked) {
          return { ...item, number: generateRandomNumber(), clicked: false };
        } else {
          return item;
        }
      })
    );
  };

  const handleStart = () => {
    clickSound.play(); // Play click sound
    setTime(60);
    setRolls(0);
    setGameWon(false);
    setGameLost(false);
    setNumbers(Array.from({ length: difficulty }, () => ({ number: generateRandomNumber(), clicked: false })));
    setGameStarted(true);
  };

  const handleRestart = () => {
    clickSound.play(); // Play click sound
    setTime(60);
    setRolls(0);
    setGameWon(false);
    setGameLost(false);
    setNumbers([]);
    setGameStarted(false);
  };

  const handleDifficultyChange = (event, newValue) => {
    clickSound.play(); // Play click sound
    setDifficulty(newValue);
  };

  return (
    <Grid container minHeight={"100vh"} sx={{ display: "flex", justifyContent: "center", alignItems: "center", background: theme.palette.background.default }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ padding: "30px", borderRadius: theme.shape.borderRadius, background: theme.palette.background.paper }}>
          <Grid container spacing={2}>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Typography variant='h3'>Tenzies Game</Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Button variant='contained' size='large' onClick={handleShowInstructions}>
                Show Instructions
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Grid container sx={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                {numbers.map((value, index) => (
                  <Grid item key={index} sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: value.clicked ? theme.palette.secondary.main : theme.palette.primary.main,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 1
                  }}>
                    <IconButton onClick={() => handleChoose(index)} disabled={!gameStarted || gameWon} sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <Typography variant='h6'>{value.number}</Typography>
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Button variant='contained' size='large' onClick={handleRollDice} disabled={!gameStarted || gameWon}>
                Roll Dice
              </Button>
            </Grid>

            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant='h6'>Time: {time}s</Typography>
            </Grid>
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant='h6'>Rolls: {rolls}</Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
              <Button variant='contained' size='large' onClick={handleStart} disabled={gameStarted}>
                Start Game
              </Button>
              <Button variant='contained' size='large' onClick={handleRestart} sx={{ ml: 2 }}>
                Restart Game
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              {gameWon && <Typography variant='h5'>Congratulations! You won!</Typography>}
              {gameLost && <Typography variant='h5'>Time's up! You lost!</Typography>}
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Instructions Modal */}
      <Modal open={modalOpen} onClose={handleCloseInstructions}>
        <Box sx={{ p: 4, maxWidth: 400, margin: 'auto', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant='h6'>Instructions</Typography>
          <Typography variant='body1' sx={{ mt: 2 }}>
            Try to get all dice to show the same number before the time runs out.
            Click on a die to hold its value, and roll the remaining dice.
          </Typography>
          <Button variant='contained' onClick={handleCloseInstructions} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* Difficulty Slider */}
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Typography id="difficulty-slider" gutterBottom>
          Difficulty (Number of Dice):
        </Typography>
        <Slider
          value={difficulty}
          onChange={handleDifficultyChange}
          valueLabelDisplay="auto"
          step={1}
          min={1}
          max={20}
          sx={{ width: 300 }}
        />
      </Grid>
    </Grid>
  );
};

export default TenziesGame;
