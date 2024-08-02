import React from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from 'howler';
import { ThemeProvider, Container, Button, Select, MenuItem, Typography } from '@mui/material';
import theme from '../theme';  // Adjust the path as necessary
import paperSoundFile from './../assets/paper.mp3';
import clickSoundFile from './../assets/button.wav';
import './../styles/MemoryGame.css';

const Data = [
  { id: 1, name: "react", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165802/atom-4.png", matched: false },
  { id: 2, name: "java", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165803/java.png", matched: false },
  { id: 3, name: "css", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165803/css-3-1.png", matched: false },
  { id: 4, name: "node", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165805/nodejs-1.png", matched: false },
  { id: 5, name: "html", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165806/html-5-1.png", matched: false },
  { id: 6, name: "js", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165804/js-3.png", matched: false },
  { id: 7, name: "react", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165802/atom-4.png", matched: false },
  { id: 8, name: "java", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165803/java.png", matched: false },
  { id: 9, name: "css", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165803/css-3-1.png", matched: false },
  { id: 10, name: "node", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165805/nodejs-1.png", matched: false },
  { id: 11, name: "html", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165806/html-5-1.png", matched: false },
  { id: 12, name: "js", img: "https://media.geeksforgeeks.org/wp-content/uploads/20230927165804/js-3.png", matched: false },
];

function Card({ item, handleSelectedCards, toggled, stopflip }) {
  const paperSound = new Howl({ src: [paperSoundFile] });

  return (
    <div className="item" onClick={() => !stopflip && paperSound.play() && handleSelectedCards(item)}>
      <div className={toggled ? "toggled" : ""}>
        <img className="face" src={item.img} alt="face" />
        <div className="back"></div>
      </div>
    </div>
  );
}

function MemoryGame() {
  const [cardsArray, setCardsArray] = React.useState([]);
  const [moves, setMoves] = React.useState(0);
  const [firstCard, setFirstCard] = React.useState(null);
  const [secondCard, setSecondCard] = React.useState(null);
  const [stopFlip, setStopFlip] = React.useState(false);
  const [won, setWon] = React.useState(0);
  const [timer, setTimer] = React.useState(0);
  const [difficulty, setDifficulty] = React.useState("easy");
  const navigate = useNavigate();

  const buttonClickSound = new Howl({ src: [clickSoundFile] });

  function NewGame() {
    buttonClickSound.play();
    setTimeout(() => {
      const randomOrderArray = Data.sort(() => 0.5 - Math.random());
      setCardsArray(randomOrderArray);
      setMoves(0);
      setFirstCard(null);
      setSecondCard(null);
      setWon(0);
      setTimer(0);
    }, 1200);
  }

  function handleSelectedCards(item) {
    if (firstCard !== null && firstCard.id !== item.id) {
      setSecondCard(item);
    } else {
      setFirstCard(item);
    }
  }

  React.useEffect(() => {
    if (firstCard && secondCard) {
      setStopFlip(true);
      if (firstCard.name === secondCard.name) {
        setCardsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.name === firstCard.name) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });
        setWon((preVal) => preVal + 1);
        removeSelection();
      } else {
        setTimeout(() => {
          removeSelection();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  function removeSelection() {
    setFirstCard(null);
    setSecondCard(null);
    setStopFlip(false);
    setMoves((prevValue) => prevValue + 1);
  }

  React.useEffect(() => {
    NewGame();
  }, []);

  React.useEffect(() => {
    let interval;
    if (won !== 6) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (won === 6) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [won]);

  return (
    <ThemeProvider theme={theme}>
      <Container className="App" maxWidth="sm">
        <div className="container">
          <div className="header">
            <Typography variant="h3" gutterBottom>Memory Game</Typography>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { buttonClickSound.play(); navigate('/Home'); }}
            >
              Home
            </Button>
          </div>
          <div className="board">
            {cardsArray.map((item) => (
              <Card
                item={item}
                key={item.id}
                handleSelectedCards={handleSelectedCards}
                toggled={item === firstCard || item === secondCard || item.matched === true}
                stopflip={stopFlip}
              />
            ))}
          </div>
          {won !== 6 ? (
            <div className="comments">
              <Typography>Moves : {moves}</Typography>
              <Typography>Timer: {timer}s</Typography>
            </div>
          ) : (
            <div className="comments">
              <Typography>🎉 You Won in {moves} moves and {timer} seconds! 🎉</Typography>
            </div>
          )}
          <Button variant="contained" color="secondary" onClick={NewGame}>
            New Game
          </Button>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default MemoryGame;
