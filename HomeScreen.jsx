import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
const HomeScreen = ({ socket, setgameId, ID }) => {
    const navigate = useNavigate();
    const [joinId, setjoinId] = useState('');
    const [err, seterr] = useState({
        error: false,
        message: ''
    });

    useEffect(() => {
        socket.on('err', (msg) => {
            seterr({
                error: true,
                message: msg
            });
        })
    }, [socket]);

    const CreateGame = () => {
        socket.emit('create_game', (roomID) => {
            setgameId(roomID);
            socket.emit('join_game', roomID, ID, () => {
                navigate('/game');
            });
        })
    }

    const handlechange = (e) => {
        const { value } = e.target;
        setjoinId(value);
    }

    const JoinGame = () => {
        seterr({
            error: false,
            message: ''
        });
        setgameId(joinId);
        socket.emit('join_game', joinId, ID, () => {
            navigate('/game')
        });
    }

    return (
        <div>
            <h1>Welcome to 29 Game!</h1>
            <button onClick={CreateGame}>create game</button>
            <input type='text' onChange={handlechange} value={joinId} />
            <button onClick={JoinGame}>Join game</button>
            {
                err.error ? <div>{err.message}</div> : <div></div>
            }
        </div>
    )
};

export default HomeScreen;