// src/components/PhaserGame.js

import React, { useRef, useEffect } from 'react';


const PhaserGame = () => {
  const gameContainer = useRef(null);



  return (
    <div ref={gameContainer} style={{ width: '100%', height: '100%' }} />
  );
};

export default PhaserGame;
