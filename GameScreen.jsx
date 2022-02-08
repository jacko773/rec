import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Grid } from '@material-ui/core'
import BiddingScreen from './BiddingScreen';
import PlayGameScreen from './PlayGameScreen';


const positionId = (playID, position) => {
    switch (position) {
        case 'left':
            return (playID + 1) > 4 ? (playID + 1) % 4 : playID + 1;
        case 'top':
            return (playID + 2) > 4 ? (playID + 2) % 4 : playID + 2;
        case 'right':
            return (playID + 3) > 4 ? (playID + 3) % 4 : playID + 3;
        default:
            return playID;
    }
}

const GameScreen = ({ socket, gameId, playId }) => {
    const [gameState, setgameState] = useState({});
    const [selectedCard, setselectedCard] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [positionArr, setpositionArr] = useState({});
    const [callStarted, setcallStarted] = useState(false);
    const [gameStarted, setgameStarted] = useState(false);
    useEffect(() => {
        socket.on('call_started', async (state) => {
            setisLoading(false);
            setgameState(state);
            setcallStarted(true);
        })
        socket.on('game_state', async (state) => {
            setgameState(state);
        })
        socket.on('game_to_start', async (state) => {
            setisLoading(true);
        })
        socket.on('game_started', async (state) => {
            setisLoading(false);
            setcallStarted(false);
            setgameState(state);
        })

    }, []);

    useEffect(() => {
        const position = {};
        position.left = positionId(playId, 'left');
        position.right = positionId(playId, 'right');
        position.top = positionId(playId, 'top');
        position.self = positionId(playId, 'self');
        setpositionArr(position);
    }, [playId]);


    const SelectCard = (data) => {
        setselectedCard(data);
    }
    const Play = () => {
        socket.emit('played_card', selectedCard, playId, gameId);
    }

    if (!playId) <></>

    return (
        <div style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            <h1>Welcome to 29 Game Screen!</h1>
            {gameState && gameState[playId] &&
                <div className='outer_game_board'>
                    <Grid className='inner_game_board'>
                        <Grid container className='top_game_grid'>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                {positionArr.top}
                                -
                                {gameState[positionArr.top] && gameState[positionArr.top]['id']}
                            </Grid>
                        </Grid>
                        <Grid container className='middle_game_grid' style={{ alignItems: 'center' }}>
                            <Grid item xs={2} style={{ textAlign: 'left' }}>
                                {positionArr.left}
                                -
                                {gameState[positionArr.left] && gameState[positionArr.left]['id']}
                            </Grid>
                            <Grid item xs={8}>
                                {
                                    callStarted && <BiddingScreen gameState={gameState} socket={socket} gameId={gameId} playId={positionArr.self}></BiddingScreen>
                                }
                                {
                                    !callStarted && <PlayGameScreen gameState={gameState} positionArr={positionArr}></PlayGameScreen>
                                }
                            </Grid>
                            <Grid item xs={2} style={{ textAlign: 'right' }}>
                                {positionArr.right}
                                -
                                {gameState[positionArr.right] && gameState[positionArr.right]['id']}
                            </Grid>
                        </Grid>
                        <Grid container className='card_game_grid'>
                            <Grid item xs={12} style={{ alignItems: 'baseline', textAlign: 'center', }}>
                                <div disabled={!gameStarted}>
                                    {gameState[positionArr.self].cards && gameState[positionArr.self].cards.map(data => {
                                        return <img src={data.image} disabled width={50} height={50} className={selectedCard.code === data.code ? 'highlight' : 'not_highlight'} style={{ marginRight: -25 }} onClick={() => SelectCard(data)} ></img>
                                    })}
                                </div>


                            </Grid>
                        </Grid>
                        <Grid container className='bottom_game_grid'>
                            <Grid item xs={12} style={{ alignItems: 'baseline', textAlign: 'center', }}>
                                <div>{positionArr.self}-{gameState[positionArr.self]['id']}</div>
                                <div>
                                    {(playId === 1 || playId === 3) ? gameState['points']['1-3'] : gameState['points']['2-4']}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>

                </div>
            }
            <div style={{ float: 'right' }}>
                <button onClick={Play} disabled={gameState['turn_position'] !== playId}>move</button>
            </div>
            <div>
                {
                    JSON.stringify(gameState)
                }
            </div>
        </div>
    )
};

export default GameScreen;


