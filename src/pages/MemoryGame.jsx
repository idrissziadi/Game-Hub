import React, { useState, useEffect } from 'react';
import { Button, Grid, IconButton, Paper, Typography, Modal, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Howl } from 'howler';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Updated paths assuming files are in the public/assets folder
const flipSound = new Howl({ src: ['/assets/flip.wav'] });
const matchSound = new Howl({ src: ['/assets/match.mp3'] });
const winSound = new Howl({ src: ['/assets/win.mp3'] });
const loseSound = new Howl({ src: ['/assets/lose.mp3'] });
const clickSound = new Howl({ src: ['/assets/button.wav'] });

const initialCards = () => {
  const icons = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍', '🍅', '🥝', '🍋', '🍊'];
  const cards = [...icons, ...icons]
    .map((icon) => ({ icon, id: Math.random() }))
    .sort(() => Math.random() - 0.5);
  return cards;
};

const MemoryGame = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [cards, setCards] = useState(initialCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      setGameWon(true);
      winSound.play();
    }
  }, [matchedCards]);

  const handleShowInstructions = () => {
    setModalOpen(true);
    clickSound.play();
  };

  const handleCloseInstructions = () => {
    setModalOpen(false);
    clickSound.play();
  };

  const handleCardClick = (card) => {
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card)) {
      flipSound.play();
      setFlippedCards((prev) => [...prev, card]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = flippedCards;

      if (firstCard.icon === secondCard.icon) {
        setMatchedCards((prev) => [...prev, firstCard, secondCard]);
        matchSound.play();
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  }, [flippedCards]);

  const handleRestart = () => {
    clickSound.play();
    setCards(initialCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setGameWon(false);
    setMoves(0);
  };

  const handleHome = () => {
    clickSound.play();
    navigate('/Home');
  };

  return (
    <Grid container minHeight={"100vh"} sx={{ display: "flex", justifyContent: "center", alignItems: "center", background: theme.palette.background.default }}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ padding: "30px", borderRadius: theme.shape.borderRadius, background: theme.palette.background.paper }}>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Typography variant='h3'>Memory Game</Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Button variant='contained' size='large' onClick={handleShowInstructions}>
                Show Instructions
              </Button>
              <Button variant='contained' size='large' onClick={handleHome} sx={{ marginLeft: 2 }}>
                Home
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                {cards.map((card, index) => (
                  <Grid item key={index} xs={3} md={2.5} sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <IconButton onClick={() => handleCardClick(card)} disabled={flippedCards.includes(card) || matchedCards.includes(card)} sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: flippedCards.includes(card) || matchedCards.includes(card) ? theme.palette.secondary.main : theme.palette.primary.main,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <Typography variant='h6'>
                        {(flippedCards.includes(card) || matchedCards.includes(card)) && card.icon}
                      </Typography>
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
              <Button variant='contained' size='large' onClick={handleRestart}>
                Restart Game
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant='h6'>Moves: {moves}</Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              {gameWon && <Typography variant='h5'>Congratulations! You won!</Typography>}
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Instructions Modal */}
      <Modal open={modalOpen} onClose={handleCloseInstructions}>
        <Box sx={{ p: 4, maxWidth: 400, margin: 'auto', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant='h6'>Instructions</Typography>
          <Typography variant='body1' sx={{ mt: 2 }}>
            Flip the cards to match pairs of icons. Try to match all pairs with the least number of moves.
          </Typography>
          <Button variant='contained' onClick={handleCloseInstructions} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default MemoryGame;
