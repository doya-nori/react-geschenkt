import { Box, Checkbox, Container, Fab, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Game from '../model/game/Game';
import PlayerView from './PlayerView';

const useStyles = makeStyles((theme) => ({
    restartButton: {
        margin: "16px",
        backgroundColor: "#2196F3",
        position: "absolute",
    },
    winner: {
        fontSize: "4rem",
        fontWeight: "bold",
        textAlign: "center",
    },
    table: {

    },
    check: {
        fontSize: "0.2rem"
    },
    upcardLabel: {
        height: "24px",
        padding: "8px",
        textAlign: "center",
    },
    upcard: {
        margin: "auto",
        padding: "8px",
        width: "32px",
        height: "32px",
        display: "flex"
    },
    upcardText: {
        fontFamily: "Roboto",
        fontWeight: 700,
        fontSize: "1.6rem",
        margin: "auto"
    },
    chipBox: {
        textAlign: "center",
        margin: "auto",
        padding: "8px",
        height: "48px",
    },
    chipIcon: {
        fontSize: "1rem"
    },
    configCheck: {
        color: "#009688"
    },
}));

const initGame = () => { return new Game() }

export interface Config {
    hidesScore: boolean
    hidesCpuInfo: boolean
}

const initConfig = (): Config => {
    return { hidesScore: true, hidesCpuInfo: true }
}

const GameBoard = () => {
    const classes = useStyles()

    const gameRef = useRef(initGame())

    useEffect(() => { gameRef.current.start() }, [])

    const [snapshot, setSnapshot] = useState(gameRef.current.snapshot)
    gameRef.current.onUpdated = setSnapshot

    const restart = useCallback(() => {
        gameRef.current.terminate()
        gameRef.current = new Game()
        setSnapshot(gameRef.current.snapshot())
    }, [setSnapshot])

    const [config, setConfig] = useState(initConfig)

    const handleHideScoreCheck = () => {
        const partial: Partial<Config> = { hidesScore: !config.hidesScore }
        setConfig({ ...config, ...partial })
    }

    const handleHideCpuInfoCheck = () => {
        const partial: Partial<Config> = { hidesCpuInfo: !config.hidesCpuInfo }
        setConfig({ ...config, ...partial })
    }

    return (
        <Container maxWidth="sm">
            <Fab className={classes.restartButton}
                onClick={restart}>
                RESTART
            </Fab>
            {snapshot.isOver &&
                <Typography className={classes.winner}>
                    {snapshot.winner} WIN!!
                </Typography>
            }

            <Grid container
                className={classes.table}
                spacing={2}
                justify="center"
                alignItems="center">
                {!snapshot.isOver &&
                    <Grid item sm={2}>
                        <Box className={classes.upcardLabel}>
                            Upcard
                    </Box>
                        <Paper className={classes.upcard}>
                            <Box className={classes.upcardText}>
                                {snapshot.upcard}
                            </Box>
                        </Paper>
                    </Grid>
                }

                {!snapshot.isOver &&

                    <Grid item sm={3}>
                        <Box className={classes.chipBox}>
                            Chip stack: {snapshot.stack}
                            <Box>
                                {Array(snapshot.stack).fill(0).map((_, i) => {
                                    return <MonetizationOnIcon
                                        key={i}
                                        className={classes.chipIcon} />
                                })}
                            </Box>
                        </Box>
                    </Grid>
                }

                {!snapshot.isOver &&
                    <Grid item sm={2} >
                        Remaining deck:{snapshot.deckRemain}
                    </Grid>
                }
                {snapshot.players.map((player, index) => {
                    return (
                        <Grid item sm={12} key={String(index)}>
                            <PlayerView
                                name={player.name}
                                isCpu={player.isCpu}
                                cpuStatus={player.isCpu ? snapshot.cpuStatus[index] : ""}
                                isTurn={index === snapshot.turn}
                                chip={player.chip}
                                hand={player.hand}
                                score={player.score}
                                config={config}
                                onDraw={() => { gameRef.current.draw(index) }}
                                onPay={() => { gameRef.current.pay(index) }}
                            />
                        </Grid>
                    )
                })}
            </Grid>
            <Grid item sm={12}>
                <Checkbox
                    className={classes.configCheck}
                    color="default"
                    checked={config.hidesScore}
                    onClick={handleHideScoreCheck}
                /> Hide score
                <Checkbox
                    className={classes.configCheck}
                    color="default"
                    checked={config.hidesCpuInfo}
                    onClick={handleHideCpuInfoCheck}
                /> Hide CPU info
            </Grid>
        </Container >
    )
}

export default GameBoard