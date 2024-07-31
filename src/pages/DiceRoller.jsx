import React, { useState } from "react";
import One from "./../components/One";
import Two from "./../components/Two";
import Three from "./../components/Three";
import Four from "./../components/Four";
import Five from "./../components/Five";
import Six from "./../components/Six";
import { Grid, Paper, Button, TextField, Typography } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from "@mui/material";
import { Howl } from 'howler';

// Updated paths assuming files are in the public/assets folder
const diceRollSound = new Howl({ src: ['/assets/dicerollsound.wav'] });
const inputSound = new Howl({ src: ['/assets/keyboard.wav'] });

function DiceRoller() {
  const theme = useTheme(); // Use the theme context

  const styles = {
    button: {
      color: theme.palette.secondary.main,
      background: theme.palette.primary.main,
      fontFamily: 'Inter, sans-serif',
      fontSize: '30px',
      height: '48px',
      padding: '14px 32px',
      gap: '10px',
      borderRadius: '15px',
      transition: 'background-color 0.3s, color 0.3s',
      '&:hover': {
        color: theme.palette.primary.main,
        background: theme.palette.secondary.main,
      },
      textTransform: 'none',
    },
    paper: {
      padding: '30px',
      borderRadius: '15px',
      background: theme.palette.background.paper,
    },
    gridContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: theme.palette.background.default,
    },
    textField: {
      marginBottom: '16px',
      '& label': {
        color: theme.palette.primary.main,
      },
      '& input': {
        color: theme.palette.text.primary,
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.primary.main,
        },
      },
    },
    playerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    history: {
      marginTop: '16px',
      '& h6': {
        color: theme.palette.primary.main,
      },
      '& p': {
        color: theme.palette.text.primary,
      },
    },
  };

  const [dice1, setDice1] = useState(0);
  const [dice2, setDice2] = useState(0);
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [rounds, setRounds] = useState(1);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [history, setHistory] = useState([]);

  function handleClick() {
    if (currentRound <= rounds) {
      diceRollSound.play(); // Play dice roll sound

      const randomIndex1 = Math.floor(Math.random() * 6) + 1;
      const randomIndex2 = Math.floor(Math.random() * 6) + 1;

      setDice1(randomIndex1);
      setDice2(randomIndex2);

      setScore1(score1 + randomIndex1);
      setScore2(score2 + randomIndex2);

      if (currentRound === rounds) {
        const result = (score1 + randomIndex1 > score2 + randomIndex2)
          ? player1
          : (score1 + randomIndex1 < score2 + randomIndex2)
          ? player2
          : "It's a tie!";
        setHistory([...history, result]);
      }

      setCurrentRound(currentRound + 1);
    }
  }

  const renderDice = (diceValue) => {
    switch (diceValue) {
      case 1:
        return <One />;
      case 2:
        return <Two />;
      case 3:
        return <Three />;
      case 4:
        return <Four />;
      case 5:
        return <Five />;
      case 6:
        return <Six />;
      default:
        return null;
    }
  };

  const handleRestart = () => {
    setDice1(0);
    setDice2(0);
    setScore1(0);
    setScore2(0);
    setCurrentRound(1);
  };

  const handleInputChange = (e, setValue) => {
    inputSound.play(); // Play input sound
    setValue(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={styles.gridContainer}>
        <Grid item md={9} xs={12}>
          <Paper sx={styles.paper}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Number of Rounds"
                  type="number"
                  value={rounds}
                  onChange={(e) => handleInputChange(e, setRounds)}
                  sx={styles.textField}
                />
              </Grid>
              <Grid item md={6} xs={12} sx={styles.playerContainer}>
                <TextField
                  fullWidth
                  label="Player 1 Name"
                  value={player1}
                  onChange={(e) => handleInputChange(e, setPlayer1)}
                  sx={styles.textField}
                />
                {renderDice(dice1)}
                <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.main }}>{player1}</Typography>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Score: {score1}</Typography>
              </Grid>
              <Grid item md={6} xs={12} sx={styles.playerContainer}>
                <TextField
                  fullWidth
                  label="Player 2 Name"
                  value={player2}
                  onChange={(e) => handleInputChange(e, setPlayer2)}
                  sx={styles.textField}
                />
                {renderDice(dice2)}
                <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.main }}>{player2}</Typography>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Score: {score2}</Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Grid item md={3}>
                    <Button fullWidth sx={styles.button} onClick={handleClick}>Roll Dice!</Button>
                  </Grid>
                </Grid>
                {currentRound > rounds && (
                  <Typography variant="h5" sx={{ mt: 2, textAlign: 'center', color: theme.palette.primary.main }}>
                    Game Over! {score1 > score2 ? `${player1} wins!` : score1 < score2 ? `${player2} wins!` : "It's a tie!"}
                  </Typography>
                )}
              </Grid>
              <Grid item md={12} xs={12}>
                <Button fullWidth sx={styles.button} onClick={handleRestart}>Restart Game</Button>
              </Grid>
              <Grid item xs={12} sx={styles.history}>
                <Typography variant="h6">Previous Winners:</Typography>
                {history.map((result, index) => (
                  <Typography key={index} variant="body1">{result}</Typography>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default DiceRoller;
