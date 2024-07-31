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
function App() {
  return (
    <ThemeProvider theme={theme}> 
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/About' Component={AboutUs} />
        <Route path='/Contact' Component={ContactUs} />
        <Route path='/Quiz' Component={Quiz} />
        <Route path='/TenziesGame' Component={TenziesGame} />
        <Route path='/DiceRoller' Component={DiceRoller} />
        <Route path='/PhaserGame' Component={PhaserGame} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
