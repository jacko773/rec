import { Grid } from "@material-ui/core";

const PlayGameScreen = ({ gameState, positionArr }) => {
    return (
        <Grid container>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <img src={gameState['played_card'][positionArr.top].image} width={50} height={50}  ></img>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
                <img src={gameState['played_card'][positionArr.left].image} width={50} height={50}  ></img>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
                <img src={gameState['played_card'][positionArr.right].image} width={50} height={50}  ></img>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <img src={gameState['played_card'][positionArr.self].image} width={50} height={50}  ></img>
            </Grid>
        </Grid>
    )
};

export default PlayGameScreen;
