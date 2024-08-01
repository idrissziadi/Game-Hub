import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Button, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const GRID_WIDTH = 20; // Nombre de cellules en largeur
const GRID_HEIGHT = 8; // Nombre de cellules en hauteur
const CELL_SIZE = 50; // Taille d'une cellule en pixels

const Game = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [pacManPosition, setPacManPosition] = useState({ x: 5, y: 5 });
  const [ghosts, setGhosts] = useState([
    { id: 1, x: 2, y: 2 },
    { id: 2, x: 7, y: 7 },
    { id: 3, x: 4, y: 4 }, // Ajout d'un troisième fantôme
    { id: 4, x: 5, y: 5 }, // Nouveau fantôme
    { id: 5, x: 6, y: 6 },  // Nouveau fantôme
    { id: 6, x: 6, y: 6 },  // Nouveau fantôme
    { id: 7, x: 6, y: 6 }  // Nouveau fantôme
  ]);
  const [coins, setCoins] = useState([
    { id: 1, x: 3, y: 2 }, // Pas sur les murs
    { id: 2, x: 6, y: 3 }, // Pas sur les murs
    { id: 3, x: 9, y: 2 }, // Pas sur les murs
    { id: 4, x: 11, y: 5 }, // Pas sur les murs
    { id: 5, x: 12, y: 6 }, // Pas sur les murs
    { id: 6, x: 14, y: 3 }, // Pas sur les murs
    { id: 7, x: 15, y: 4 }, // Pas sur les murs
    { id: 8, x: 17, y: 2 }, // Pas sur les murs
    { id: 9, x: 5, y: 6 }, // Pas sur les murs
    { id: 10, x: 8, y: 1 }, // Pas sur les murs
    { id: 11, x: 10, y: 5 }, // Pas sur les murs
    { id: 12, x: 12, y: 7 }, // Pas sur les murs
    { id: 13, x: 13, y: 6 }, // Pas sur les murs
    { id: 14, x: 16, y: 1 }, // Pas sur les murs
    { id: 15, x: 7, y: 3 }, // Pas sur les murs
    { id: 16, x: 6, y: 7 }, // Pas sur les murs
    { id: 17, x: 9, y: 4 }, // Pas sur les murs
    { id: 18, x: 11, y: 2 }, // Pas sur les murs
    { id: 19, x: 13, y: 4 }, // Pas sur les murs
    { id: 20, x: 14, y: 6 }  // Pas sur les murs
  ]);
  
  const walls = [
    // Murs existants à gauche
    { id: 1, x: 1, y: 1, width: 2, height: 1 },
    { id: 2, x: 4, y: 1, width: 2, height: 1 },
    { id: 3, x: 7, y: 1, width: 2, height: 1 },
    { id: 4, x: 1, y: 4, width: 2, height: 1 },
    { id: 5, x: 4, y: 4, width: 2, height: 1 },
    { id: 6, x: 7, y: 4, width: 2, height: 1 },
    { id: 7, x: 1, y: 7, width: 2, height: 1 },
    { id: 8, x: 4, y: 7, width: 2, height: 1 },
    { id: 9, x: 7, y: 7, width: 2, height: 1 },
  
    // Murs symétriques à droite avec un passage central
    { id: 10, x: 10, y: 1, width: 2, height: 1 }, // Symétrique de (1,1)
    { id: 11, x: 13, y: 1, width: 2, height: 1 }, // Symétrique de (4,1)
    { id: 12, x: 16, y: 1, width: 2, height: 1 }, // Symétrique de (7,1)
    { id: 13, x: 10, y: 4, width: 2, height: 1 }, // Symétrique de (1,4)
    { id: 14, x: 13, y: 4, width: 2, height: 1 }, // Symétrique de (4,4)
    { id: 15, x: 16, y: 4, width: 2, height: 1 }, // Symétrique de (7,4)
    { id: 16, x: 10, y: 7, width: 2, height: 1 }, // Symétrique de (1,7)
    { id: 17, x: 13, y: 7, width: 2, height: 1 }, // Symétrique de (4,7)
    { id: 18, x: 16, y: 7, width: 2, height: 1 }, // Symétrique de (7,7)
  
    // Murs pour créer un passage central
    { id: 19, x: 10, y: 0, width: 1, height: 3 }, // Réduit la hauteur pour permettre un passage
    { id: 20, x: 10, y: 7, width: 1, height: 1 }, // Ajusté pour créer un passage en bas
    { id: 21, x: 13, y: 0, width: 1, height: 3 }, // Réduit la hauteur pour permettre un passage
    { id: 22, x: 13, y: 7, width: 1, height: 1 }, // Ajusté pour créer un passage en bas
    { id: 23, x: 16, y: 0, width: 1, height: 3 }, // Réduit la hauteur pour permettre un passage
    { id: 24, x: 16, y: 7, width: 1, height: 1 }  // Ajusté pour créer un passage en bas
  ];
  
  
  
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(10);

  const movePacMan = useCallback((direction) => {
    setPacManPosition((prev) => {
      const step = difficulty / 10;
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'left':
          newX = Math.max(prev.x - step, 0);
          break;
        case 'right':
          newX = Math.min(prev.x + step, GRID_WIDTH - 1);
          break;
        case 'up':
          newY = Math.max(prev.y - step, 0);
          break;
        case 'down':
          newY = Math.min(prev.y + step, GRID_HEIGHT - 1);
          break;
        default:
          break;
      }

      // Check for collision with walls
      const collidesWithWall = walls.some((wall) =>
        newX >= wall.x && newX < wall.x + wall.width &&
        newY >= wall.y && newY < wall.y + wall.height
      );

      if (!collidesWithWall) {
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [difficulty, walls]);

  const moveGhosts = useCallback(() => {
    setGhosts((prevGhosts) =>
      prevGhosts.map((ghost) => {
        const direction = ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)];
        let newX = ghost.x;
        let newY = ghost.y;

        switch (direction) {
          case 'left':
            newX = Math.max(ghost.x - 1, 0);
            break;
          case 'right':
            newX = Math.min(ghost.x + 1, GRID_WIDTH - 1);
            break;
          case 'up':
            newY = Math.max(ghost.y - 1, 0);
            break;
          case 'down':
            newY = Math.min(ghost.y + 1, GRID_HEIGHT - 1);
            break;
          default:
            break;
        }

        return { ...ghost, x: newX, y: newY };
      })
    );
  }, []);

  useEffect(() => {
    const checkCollisions = () => {
      ghosts.forEach((ghost) => {
        if (
          Math.abs(pacManPosition.x - ghost.x) < 0.5 &&
          Math.abs(pacManPosition.y - ghost.y) < 0.5
        ) {
          alert('Game Over! You were caught by a ghost.');
          setGameStarted(false);
          setScore(0);
        }
      });
    };

    if (gameStarted) {
      checkCollisions();
    }
  }, [pacManPosition, ghosts, gameStarted]);

  useEffect(() => {
    const collectCoins = () => {
      setCoins((prevCoins) =>
        prevCoins.filter((coin) => {
          if (
            Math.abs(pacManPosition.x - coin.x) < 0.5 &&
            Math.abs(pacManPosition.y - coin.y) < 0.5
          ) {
            setScore((prevScore) => prevScore + 10);
            return false;
          }
          return true;
        })
      );
    };

    if (gameStarted) {
      collectCoins();
      // Check for win condition
      if (coins.length === 0) {
        alert('Congratulations! You collected all the coins.');
        setGameStarted(false);
        setScore(0); // Optionnel, réinitialiser le score à zéro à la fin
      }
    }
  }, [pacManPosition, coins, gameStarted]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameStarted) {
        switch (event.key) {
          case 'ArrowLeft':
            movePacMan('left');
            break;
          case 'ArrowRight':
            movePacMan('right');
            break;
          case 'ArrowUp':
            movePacMan('up');
            break;
          case 'ArrowDown':
            movePacMan('down');
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePacMan, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        moveGhosts();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameStarted, moveGhosts]);

  const isPositionOccupiedByWall = (x, y) => {
    return walls.some(
      (wall) =>
        x >= wall.x &&
        x < wall.x + wall.width &&
        y >= wall.y &&
        y < wall.y + wall.height
    );
  };

  const generateRandomPosition = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID_WIDTH);
      y = Math.floor(Math.random() * GRID_HEIGHT);
    } while (isPositionOccupiedByWall(x, y) || coins.some((coin) => coin.x === x && coin.y === y) || ghosts.some((ghost) => ghost.x === x && ghost.y === y));
    return { x, y };
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
    setCoins([
      { id: 1, ...generateRandomPosition() },
      { id: 2, ...generateRandomPosition() },
      { id: 3, ...generateRandomPosition() },
      { id: 4, ...generateRandomPosition() },
      { id: 5, ...generateRandomPosition() },
      { id: 6, ...generateRandomPosition() },
      { id: 7, ...generateRandomPosition() },
      { id: 8, ...generateRandomPosition() },
      { id: 9, ...generateRandomPosition() },
      { id: 10, ...generateRandomPosition() },
      { id: 11, ...generateRandomPosition() },
      { id: 12, ...generateRandomPosition() },
      { id: 13, ...generateRandomPosition() },
      { id: 14, ...generateRandomPosition() },
      { id: 15, ...generateRandomPosition() },
      { id: 16, ...generateRandomPosition() },
    ]);
    setGhosts([
      { id: 1, ...generateRandomPosition() },
      { id: 2, ...generateRandomPosition() },
      { id: 3, ...generateRandomPosition() },
      { id: 4, ...generateRandomPosition() },
      { id: 5, ...generateRandomPosition() },
      { id: 6, ...generateRandomPosition() },
      { id: 7, ...generateRandomPosition() }

    ]);
  };

  const handleShowInstructions = () => {
    setModalOpen(true);
  };

  const handleCloseInstructions = () => {
    setModalOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.palette.background.default,
        padding: theme.spacing(3),
      }}
    >
      <Paper
        sx={{
          padding: theme.spacing(8),
          borderRadius: theme.shape.borderRadius,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          width: '100%',
          maxWidth: '1000px',
          textAlign : "center"
        }}
      >
        <Typography variant='h3' gutterBottom color="primary">
          Pac-Man Game
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
            gap: '1px',
            backgroundColor: "#000",
            position: 'relative',
            marginBottom: theme.spacing(2),
          }}
        >
          {walls.map((wall) => (
            <Box
              key={wall.id}
              sx={{
                position: 'absolute',
                top: wall.y * CELL_SIZE,
                left: wall.x * CELL_SIZE,
                width: wall.width * CELL_SIZE,
                height: wall.height * CELL_SIZE,
                backgroundColor: theme.palette.grey[700],
              }}
            />
          ))}
          {coins.map((coin) => (
            <Box
              key={coin.id}
              sx={{
                position: 'absolute',
                top: coin.y * CELL_SIZE,
                left: coin.x * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: theme.palette.primary.main,
                borderRadius: '50%',
              }}
            />
          ))}
          {ghosts.map((ghost) => (
            <Box
              key={ghost.id}
              sx={{
                position: 'absolute',
                top: ghost.y * CELL_SIZE,
                left: ghost.x * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: theme.palette.error.main,
                borderRadius: '50%',
              }}
            />
          ))}
          <Box
            sx={{
              position: 'absolute',
              top: pacManPosition.y * CELL_SIZE,
              left: pacManPosition.x * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: "#0000FF",
              borderRadius: '50%',
            }}
          />
        </Box>
        <Typography variant='h6' gutterBottom>
          Score: {score}
        </Typography>
        <Button variant='contained' color='primary' size="large" onClick={handleStartGame} sx={{ marginRight: theme.spacing(2) }}>
          Start Game
        </Button>
        <Button  color='primary' variant='contained' size='large' onClick={handleShowInstructions} sx={{ marginRight: theme.spacing(2) }}>
          Instructions
        </Button>
        <Button  color='secondary' variant='contained' size='large'  onClick={() => navigate('/Home')}>
          Home
        </Button>
      </Paper>
      <Modal open={modalOpen} onClose={handleCloseInstructions}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            bgcolor: 'background.paper',
            borderRadius: '4px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h6' gutterBottom>
            Instructions
          </Typography>
          <Typography>
            Use the arrow keys to move Pac-Man and collect all the coins while avoiding the ghosts.
          </Typography>
          <Button variant='contained' color='primary' onClick={handleCloseInstructions} sx={{ marginTop: theme.spacing(2) }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Game;
