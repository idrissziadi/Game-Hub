import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, Typography, Modal, Box, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles'; 
import { Howl } from 'howler';
import { useNavigate } from 'react-router-dom';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Define the shapes of the Tetris pieces with their rotations
const SHAPES = {
  I: [
    [[1, 1, 1, 1]], 
    [[1], [1], [1], [1]], 
  ],
  J: [
    [[0, 0, 1], [1, 1, 1]], 
    [[1, 0], [1, 0], [1, 1]], 
    [[1, 1, 1], [0, 0, 1]], 
    [[1, 1], [0, 1], [0, 1]], 
  ],
  L: [
    [[1, 0, 0], [1, 1, 1]], 
    [[1, 1], [1, 0], [1, 0]], 
    [[1, 1, 1], [0, 0, 1]], 
    [[0, 1], [0, 1], [1, 1]], 
  ],
  O: [
    [[1, 1], [1, 1]], 
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]], 
    [[1, 0], [1, 1], [0, 1]], 
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]], 
    [[1, 0], [1, 1], [1, 0]], 
    [[1, 1, 1], [0, 1, 0]], 
    [[0, 1], [1, 1], [0, 1]], 
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]], 
    [[0, 1], [1, 1], [1, 0]], 
  ],
};

const getRandomShape = () => {
  const shapes = Object.keys(SHAPES);
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape: SHAPES[randomShape],
    type: randomShape,
  };
};

// Sound effects
const moveSound = new Howl({ src: ['./assets/rock.mp3'] });
const rotateSound = new Howl({ src: ['./assets/rotate.wav'] });
const clearLineSound = new Howl({ src: ['./assets/win.wav'] });
const gameOverSound = new Howl({ src: ['./assets/lose.mp3'] });
const clickSound = new Howl({ src: ['./assets/button.wav'] });

const TetriesGame = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState(
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(getRandomShape());
  const [piecePosition, setPiecePosition] = useState({ x: 4, y: 0 });
  const [pieceRotation, setPieceRotation] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [nextPiece, setNextPiece] = useState(getRandomShape());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && !isPaused) movePieceDown();
    }, 500);

    const handleKeyPress = (event) => {
      if (gameOver || isPaused) return;
      if (event.key === 'ArrowLeft') {
        movePieceLeft();
        moveSound.play();
      } else if (event.key === 'ArrowRight') {
        movePieceRight();
        moveSound.play();
      } else if (event.key === 'ArrowDown') {
        movePieceDown();
        moveSound.play();
      } else if (event.key === 'ArrowUp') {
        rotatePiece();
        rotateSound.play();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [piecePosition, pieceRotation, gameOver, isPaused]);

  const movePieceDown = () => {
    const newPosition = { x: piecePosition.x, y: piecePosition.y + 1 };
    if (!isValidMove(newPosition, pieceRotation)) {
      fixPiece();
      setCurrentPiece(nextPiece);
      setNextPiece(getRandomShape());
      setPiecePosition({ x: 4, y: 0 });
      setPieceRotation(0);
      if (!isValidMove({ x: 4, y: 0 }, 0)) {
        setGameOver(true);
        gameOverSound.play();
      }
      return;
    }
    setPiecePosition(newPosition);
  };

  const movePieceLeft = () => {
    const newPosition = { x: piecePosition.x - 1, y: piecePosition.y };
    if (isValidMove(newPosition, pieceRotation)) {
      setPiecePosition(newPosition);
    }
  };

  const movePieceRight = () => {
    const newPosition = { x: piecePosition.x + 1, y: piecePosition.y };
    if (isValidMove(newPosition, pieceRotation)) {
      setPiecePosition(newPosition);
    }
  };

  const rotatePiece = () => {
    const newRotation = (pieceRotation + 1) % currentPiece.shape.length;
    if (isValidMove(piecePosition, newRotation)) {
      setPieceRotation(newRotation);
    }
  };

  const isValidMove = (position, rotation) => {
    const shape = currentPiece.shape[rotation];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] && (board[y + position.y] === undefined || board[y + position.y][x + position.x] === undefined || board[y + position.y][x + position.x])) {
          return false;
        }
      }
    }
    return true;
  };

  const fixPiece = () => {
    const shape = currentPiece.shape[pieceRotation];
    const newBoard = board.map((row) => row.slice());
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          newBoard[y + piecePosition.y][x + piecePosition.x] = 1;
        }
      }
    }
    setBoard(newBoard);
    clearLines(newBoard);
  };

  const clearLines = (board) => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const clearedLines = BOARD_HEIGHT - newBoard.length;
    if (clearedLines > 0) {
      clearLineSound.play();
      setScore(score + clearedLines * 100);
      setBoard([...Array(clearedLines).fill(Array(BOARD_WIDTH).fill(0)), ...newBoard]);
      if (score / 1000 >= level) {
        setLevel(level + 1);
      }
    }
  };

  const renderBoard = () => {
    const newBoard = board.map((row) => row.slice());
    const shape = currentPiece.shape[pieceRotation];
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && newBoard[y + piecePosition.y] && newBoard[y + piecePosition.y][x + piecePosition.x] !== undefined) {
          newBoard[y + piecePosition.y][x + piecePosition.x] = cell;
        }
      });
    });
    return newBoard;
  };

  const handleShowInstructions = () => {
    setModalOpen(true);
    clickSound.play();
  };

  const handleCloseInstructions = () => {
    setModalOpen(false);
    clickSound.play();
  };

  const handleRestart = () => {
    setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(getRandomShape());
    setPiecePosition({ x: 4, y: 0 });
    setPieceRotation(0);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    clickSound.play();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    clickSound.play();
  };

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.palette.background.default }}>
      <Paper elevation={5} style={{ padding: '20px', textAlign: 'center', width: '80%', maxWidth: '600px' ,borderRadius: theme.shape.borderRadius}}>
        <Typography variant="h3" gutterBottom>Tetris</Typography>
        <Button variant="contained" color="primary" onClick={handleShowInstructions} style={{ margin: '5px' }}>Instructions</Button>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: '10px' }}>
              <Typography variant="h6">Score: {score}</Typography>
              <Typography variant="h6">Level: {level}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: '10px' }}>
              <Typography variant="h6">Next Piece:</Typography>
              {/* Render the next piece */}
              {nextPiece.shape[0].map((row, rowIndex) => (
                <Grid container key={rowIndex} justifyContent="center">
                  {row.map((cell, cellIndex) => (
                    <Grid key={cellIndex} item style={{ width: '20px', height: '20px', backgroundColor: cell ? 'black' : 'white', border: '1px solid gray' }} />
                  ))}
                </Grid>
              ))}
            </Paper>
          </Grid>
        </Grid>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${BOARD_WIDTH}, 20px)`, gap: '1px', margin: '20px 0' }}>
          {renderBoard().map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div key={`${rowIndex}-${cellIndex}`} style={{ width: '20px', height: '20px', backgroundColor: cell ? 'black' : 'white', border: '1px solid gray' }}></div>
            ))
          )}
        </div>
        
        <Button variant="contained" color="primary" onClick={handlePause} style={{ margin: '5px' }}>{isPaused ? 'Resume' : 'Pause'}</Button>
        <Button variant="contained" color="secondary" onClick={handleRestart} style={{ margin: '5px' }}>Restart</Button>
        <Button variant="contained" color="primary" onClick={() => {navigate('/Home');clickSound.play();}} style={{ margin: '5px' }}>Home</Button>
      </Paper>
      <Modal open={modalOpen} onClose={handleCloseInstructions}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Instructions</Typography>
          <Typography variant="body1">
            Use the arrow keys to move and rotate the pieces. Your goal is to complete horizontal lines to clear them. The game is over when the pieces stack to the top of the board.
          </Typography>
          <Button variant="contained" onClick={handleCloseInstructions} style={{ marginTop: '10px' }}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TetriesGame;
