import React, { useState, useEffect, useRef } from 'react';
import { Button, Grid, Paper, Typography, Modal, Box, Slider, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler';

// Updated paths assuming files are in the public/assets folder
const paddleHitSound = new Howl({ src: ['/assets/pingpong.wav'] });
const scoreSound = new Howl({ src: ['/assets/score.wav'] });
const gameOverSound = new Howl({ src: ['/assets/lose.wav'] });
const loseSound = new Howl({ src: ['/assets/lose.mp3'] });
const clickSound = new Howl({ src: ['/assets/button.wav'] });
const inputSound = new Howl({ src: ['/assets/keyboard.wav'] });

const initialBallState = { x: 300, y: 200, speedX: 5, speedY: 5 };
const initialPaddleState = { left: 150, right: 150 };

const PingPong = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [ball, setBall] = useState(initialBallState);
  const [paddles, setPaddles] = useState(initialPaddleState);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [leftPlayerName, setLeftPlayerName] = useState('');
  const [rightPlayerName, setRightPlayerName] = useState('');
  const [remainingTime, setRemainingTime] = useState(60);
  const [ballSpeed, setBallSpeed] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const ballRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameRunning) {
      // Timer setup
      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            setGameOver(true);
            pauseGame();
            clearInterval(timerRef.current);
            gameOverSound.play();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Key press handler
      const handleKeyPress = (e) => {
        switch (e.key) {
          case 'ArrowUp':
            setPaddles((prev) => ({ ...prev, right: Math.max(prev.right - 10, 0) }));
            break;
          case 'ArrowDown':
            setPaddles((prev) => ({ ...prev, right: Math.min(prev.right + 10, 300) }));
            break;
          case 'z':
            setPaddles((prev) => ({ ...prev, left: Math.max(prev.left - 10, 0) }));
            break;
          case 's':
            setPaddles((prev) => ({ ...prev, left: Math.min(prev.left + 10, 300) }));
            break;
          default:
            break;
        }
      };

      // Game update loop
      const updateGame = () => {
        setBall((prevBall) => {
          let newX = prevBall.x + prevBall.speedX;
          let newY = prevBall.y + prevBall.speedY;

          // Check for collisions with paddles
          const ballRect = ballRef.current.getBoundingClientRect();
          const paddleLeftRect = document.getElementById('paddle-left').getBoundingClientRect();
          const paddleRightRect = document.getElementById('paddle-right').getBoundingClientRect();

          if (
            (ballRect.left <= paddleLeftRect.right &&
              ballRect.right >= paddleLeftRect.left &&
              ballRect.top <= paddleLeftRect.bottom &&
              ballRect.bottom >= paddleLeftRect.top) ||
            (ballRect.left <= paddleRightRect.right &&
              ballRect.right >= paddleRightRect.left &&
              ballRect.top <= paddleRightRect.bottom &&
              ballRect.bottom >= paddleRightRect.top)
          ) {
            paddleHitSound.play();
            const isLeftPaddle = ballRect.left <= paddleLeftRect.right;

            // Calculate new angle based on collision point
            const paddleTop = isLeftPaddle ? paddleLeftRect.top : paddleRightRect.top;
            const paddleBottom = isLeftPaddle ? paddleLeftRect.bottom : paddleRightRect.bottom;
            const paddleCenter = (paddleTop + paddleBottom) / 2;
            const hitPosition = (prevBall.y - paddleCenter) / (paddleBottom - paddleTop);

            const angle = hitPosition * Math.PI / 4; // Ball's new direction based on hit position

            const newSpeedX = isLeftPaddle ? Math.abs(prevBall.speedX) : -Math.abs(prevBall.speedX);
            const newSpeedY = prevBall.speedY * Math.cos(angle);

            newX = prevBall.x + newSpeedX;
            newY = prevBall.y + newSpeedY;

            return { ...prevBall, speedX: newSpeedX, speedY: newSpeedY, x: newX, y: newY };
          }

          // Check for collisions with top and bottom walls
          if (newY <= 0 || newY >= 380) {
            newY = newY <= 0 ? 1 : 379;
            return { ...prevBall, speedY: -prevBall.speedY, y: newY };
          }

          // Check for game over
          if (newX < 0 || newX > 600) {
            if (newX < 0) {
              setRightScore((score) => score + 1);
            } else {
              setLeftScore((score) => score + 1);
            }
            scoreSound.play();
            setBall(initialBallState); // Reset ball position
            return { ...prevBall, x: 300, y: 200 }; // Reset ball position
          }

          return { ...prevBall, x: newX, y: newY };
        });
      };

      const intervalId = setInterval(updateGame, 50);
      window.addEventListener('keydown', handleKeyPress);

      return () => {
        clearInterval(intervalId);
        clearInterval(timerRef.current);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [gameRunning, ball]);

  const startGame = () => {
    if (!leftPlayerName || !rightPlayerName) {
      alert('Please enter both player names.');
      return;
    }
    setBall({ ...initialBallState, speedX: ballSpeed, speedY: ballSpeed });
    setPaddles(initialPaddleState);
    setLeftScore(0);
    setRightScore(0);
    setGameOver(false);
    setGameRunning(true);
    setRemainingTime(60); // Reset time to 60 seconds
    clickSound.play(); // Play click sound
  };

  const restartGame = () => {
    setBall({ ...initialBallState, speedX: ballSpeed, speedY: ballSpeed });
    setPaddles(initialPaddleState);
    setLeftScore(0);
    setRightScore(0);
    setGameOver(false);
    setGameRunning(true);
    setRemainingTime(60); // Reset time to 60 seconds
    clickSound.play(); // Play click sound
  };

  const pauseGame = () => {
    setGameRunning(false);
    clearInterval(timerRef.current); // Clear the timer
    clickSound.play(); // Play click sound
  };

  const handleSpeedChange = (event, newValue) => {
    setBallSpeed(newValue);
    clickSound.play(); // Play click sound
  };

  const handleShowInstructions = () => {
    setInstructionsOpen(true);
    clickSound.play(); // Play click sound
  };

  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
    clickSound.play(); // Play click sound
  };

  const handleNavigateHome = () => {
    clickSound.play(); // Play click sound
    navigate('/Home'); // Navigate to /Home
  };

  return (
    <Grid container minHeight={"100vh"} sx={{ display: "flex", justifyContent: "center", alignItems: "center", background: theme.palette.background.default }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ padding: "30px", borderRadius: theme.shape.borderRadius, background: theme.palette.background.paper }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Typography variant='h3'>Ping Pong Game</Typography>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Left Player Name"
                value={leftPlayerName}
                onChange={(e) => {setLeftPlayerName(e.target.value) ; inputSound.play()}}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Right Player Name"
                value={rightPlayerName}
                onChange={(e) => {setRightPlayerName(e.target.value) ; inputSound.play()}}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant='h6'>
                {leftPlayerName || "Left Player"}: {leftScore} - {rightPlayerName || "Right Player"}: {rightScore}
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant='h6'>
                Time Remaining: {remainingTime}s
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "600px",
                    height: "400px",
                    border: `2px solid ${theme.palette.primary.main}`,
                    position: "relative",
                    background: "rgb(200, 200, 200)",
                  }}
                >
                  <div
                    id="paddle-left"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: paddles.left,
                      width: "10px",
                      height: "100px",
                      background: theme.palette.secondary.main,
                    }}
                  />
                  <div
                    id="paddle-right"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: paddles.right,
                      width: "10px",
                      height: "100px",
                      background: theme.palette.secondary.main,
                    }}
                  />
                  <div
                    ref={ballRef}
                    style={{
                      position: "absolute",
                      left: ball.x,
                      top: ball.y,
                      width: "20px",
                      height: "20px",
                      background: theme.palette.error.main,
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: 300 }}>
                <Typography id="ball-speed-slider" gutterBottom>
                  Ball Speed
                </Typography>
                <Slider
                  value={ballSpeed}
                  onChange={handleSpeedChange}
                  step={1}
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  aria-labelledby="ball-speed-slider"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <Button variant="contained" onClick={startGame} disabled={gameRunning}>Start Game</Button>
              <Button variant="contained" onClick={pauseGame} disabled={!gameRunning}>Pause Game</Button>
              <Button variant="contained" onClick={restartGame}>Restart Game</Button>
              <Button variant="contained" onClick={handleShowInstructions}>Instructions</Button>
              <Button variant="contained" color='secondary' onClick={handleNavigateHome}>Home</Button>
            </Grid>

            <Modal open={instructionsOpen} onClose={handleCloseInstructions}>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2">Instructions</Typography>
                <Typography sx={{ mt: 2 }}>
                  Left Player: Move up (Z), Move down (S)
                  <br />
                  Right Player: Move up (Arrow Up), Move down (Arrow Down)
                </Typography>
              </Box>
            </Modal>

            <Modal open={gameOver} onClose={() => setGameOver(false)}>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2">Game Over</Typography>
                <Typography sx={{ mt: 2 }}>
                  {leftScore > rightScore ? `${leftPlayerName || "Left Player"} wins!` : `${rightPlayerName || "Right Player"} wins!`}
                </Typography>
                <Button onClick={restartGame} sx={{ mt: 2 }}>Restart</Button>
              </Box>
            </Modal>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PingPong;
