import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios'
import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeScreen from './screen/HomeScreen';
import GameScreen from './screen/GameScreen';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameId, setgameId] = useState('')
  const [ID, setID] = useState(-1);
  const [playId, setplayId] = useState();


  useEffect(() => {
    const newSocket = io(`http://localhost:3006`);

    setSocket(newSocket);

    newSocket.on('player_id', (newCount , cb) => {
      setplayId(newCount);
      cb();
    })


    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const id = parseInt(Math.random() * 1000)
    setID(id);
  }, []);

  return (
    <div className="App">{
      socket && <>
        <Routes>
          <Route path="/" element={<HomeScreen socket={socket} setgameId={setgameId} ID={ID} />} />
          <Route path="game" element={<GameScreen socket={socket} gameId={gameId} playId={parseInt(playId)} />} />
        </Routes>
      </>
    }
    </div>
  );
}

export default App;
