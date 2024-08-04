import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Howl } from 'howler';
import {useNavigate } from 'react-router-dom';

// Sound effects
const correctSound = new Howl({ src: ['./assets/correct.mp3'] });
const winSound = new Howl({ src: ['./assets/win.mp3'] });
const clickSound = new Howl({ src: ['./assets/button.wav'] });

const sampleWords = [ 
    { 
      word: "GOALKEEPER", 
      description: "The player in the team who is allowed to use their hands and is responsible for protecting the goal."
    }, 
    { 
      word: "STRIKER", 
      description: "A player whose main role is to score goals."
    }, 
    { 
      word: "DEFENDER", 
      description: "A player who is responsible for stopping the opposing team from scoring."
    }, 
    { 
      word: "MIDFIELDER", 
      description: "A player who plays mainly in the middle part of the field, responsible for both defending and attacking."
    }, 
    { 
      word: "PENALTY", 
      description: "A free kick awarded to a team when a player from the opposing team commits a foul in the penalty area."
    }, 
    { 
      word: "CORNERKICK", 
      description: "A kick awarded to the attacking team when the ball goes out of play over the goal line after last being touched by a defender."
    }, 
    { 
      word: "OFFSIDE", 
      description: "A rule violation where an attacking player is positioned closer to the opponent's goal line than both the ball and the second-last opponent."
    }, 
    { 
      word: "FREEKICK", 
      description: "A kick awarded to a team following a foul committed by the opposing team."
    }, 
    { 
      word: "HANDBALL", 
      description: "An illegal action where a player touches the ball with their hand or arm."
    }, 
    { 
      word: "RED CARD", 
      description: "A card shown by the referee to a player who has committed a serious foul, resulting in their dismissal from the game."
    } 
  ];
  

const WordGuess = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const generateAlphabet = () => {
    const letters = [];
    for (let i = 65; i <= 90; i++) {
      letters.push(String.fromCharCode(i));
    }
    return letters;
  }

  const [words, setWords] = useState(sampleWords);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hint, setHint] = useState(words[currentWordIndex].description);
  const [answer, setAnswer] = useState(words[currentWordIndex].word);
  const [letters, setLetters] = useState(generateAlphabet());
  const [charactersArray2, setCharactersArray2] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const initialCharactersArray = answer.split('').map((item) => ({
      letter: item,
      visible: false
    }));
    setCharactersArray2(initialCharactersArray);
    setGameWon(false); 
    setDisabledButtons([]);
  }, [answer]);

  const handleClick = (item, index) => {
    clickSound.play();
    const lowerCaseItem = item.toLowerCase();
    const updatedCharactersArray = charactersArray2.map((char) => {
      const lowerCaseChar = char.letter.toLowerCase();
      if (lowerCaseChar === lowerCaseItem) {
        correctSound.play();
        return { ...char, visible: true };
      }
      return char;
    });
    setCharactersArray2(updatedCharactersArray);
    setDisabledButtons([...disabledButtons, index]);

    const allCharactersVisible = updatedCharactersArray.every(char => char.visible);
    if (allCharactersVisible) {
      setGameWon(true);
      winSound.play();
      
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setAnswer(words[currentWordIndex + 1].word);
          setHint(words[currentWordIndex + 1].description);
        }
      }, 1500); 
    }
  }

  const handleRestart = () => {
    clickSound.play();
    setCurrentWordIndex(0);
    setAnswer(words[0].word);
    setHint(words[0].description);
    setGameWon(false);
    setDisabledButtons([]);
  }

  const handleHome = () => {
    clickSound.play();
    navigate('/Home');
  }

  return (
    <Grid container minHeight={"100vh"} sx={{ display: "flex", justifyContent: "center", alignItems: "center", background: theme.palette.background.default }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ padding: "30px", borderRadius: theme.shape.borderRadius, background: theme.palette.background.paper }}>
          <Grid container spacing={2}>
            <Grid item xs={12} textAlign={"center"}>
              <Typography variant='h3'>Word Guess Game</Typography>
            </Grid>
            <Grid item xs={12} textAlign={"center"}>
              <Typography variant='h5'>Hint: {hint}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={5} justifyContent="center">
                {
                  charactersArray2.map((item, index) => (
                    <Grid item key={index}>
                      <Typography variant='h4' sx={{ background: theme.palette.secondary.main, borderRadius: "50%", minWidth: "40px", textAlign: "center", padding: "10px" }}>
                        {item.visible ? item.letter : ""}
                      </Typography>
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="center">
                {
                  letters.map((item, index) => (
                    <Grid item key={index}>
                      <Button
                        variant='contained'
                        onClick={() => handleClick(item, index)}
                        disabled={disabledButtons.includes(index) || gameWon}
                      >
                        {item}
                      </Button>
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              {gameWon ? (
                <Button minWidth="80%" variant='contained' onClick={handleRestart}>
                  Restart
                </Button>
              ) : (
                <Button minWidth="80%" variant='contained' onClick={handleRestart}>
                  Start
                </Button>
              )}
            </Grid>
            <Grid item xs={12} textAlign={"center"}>
              <Button variant='contained' color='secondary' onClick={handleHome}>Home</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default WordGuess;
