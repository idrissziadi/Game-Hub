import React from 'react';
import { BrowserRouter , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Quiz from './pages/Quiz';
import TenziesGame from './pages/TenziesGame';
import DiceRoller from './pages/DiceRoller';
import PhaserGame from './components/PhaserGame';
import RockRollPaper from './pages/RockRollPaper';
import SimonSays from './pages/SimonSays';
import Game from './pages/Game';
import FlipGame from './pages/FlipGame';
import MemoryGame from './pages/MemoryGame';
import TetriesGame from './pages/TetriesGame';
import PingPong from './pages/PingPong';
import PuzzleGame from './pages/PuzzleGame';
function App() {
  return (
    <ThemeProvider theme={theme}> 
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/Home' Component={Home}/>
        <Route path='/About' Component={AboutUs} />
        <Route path='/Contact' Component={ContactUs} />
        <Route path='/Quiz' Component={Quiz} />
        <Route path='/TenziesGame' Component={TenziesGame} />
        <Route path='/DiceRoller' Component={DiceRoller} />
        <Route path='/RockPaperScissor' Component={RockRollPaper} />
        <Route path='SimonSays' Component={SimonSays} />
        <Route path='Game' Component={Game} />
        <Route path='flipgame' Component={FlipGame} />
        <Route path='memorygame' Component={MemoryGame} />
        <Route path='tetriesgame' Component={TetriesGame} />
        <Route path='pingpong' Component={PingPong} />
        <Route path='puzzlegame' Component={PuzzleGame} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
