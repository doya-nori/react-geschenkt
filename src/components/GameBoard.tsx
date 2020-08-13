import { Box, Button, Checkbox, Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Game from '../model/game/Game';
import PlayerView from './PlayerView';
import TableView from './TableView';

const useStyles = makeStyles((theme) => ({
    restartButton: {
        margin: "16px",
        backgroundColor: "#2196F3",
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
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

    configCheck: {
        color: theme.palette.secondary.main,
    },
}));

const initGame = () => { return new Game() }

export interface Config {
    hidesScore: boolean
    hidesCpuInfo: boolean
    fastMode: boolean
}

const initConfig = (): Config => {
    return {
        hidesScore: true,
        hidesCpuInfo: true,
        fastMode: false,
    }
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
    gameRef.current.setFastMode(config.fastMode)

    const showAll = useCallback(() => {
        const partial: Partial<Config> = {
            hidesScore: false,
            hidesCpuInfo: false,
        }
        setConfig((c) => { return { ...c, ...partial } })
    }, [setConfig])

    gameRef.current.onOver = showAll

    const handleHideScoreCheck = () => {
        const partial: Partial<Config> = { hidesScore: !config.hidesScore }
        setConfig({ ...config, ...partial })
    }

    const handleHideCpuInfoCheck = () => {
        const partial: Partial<Config> = { hidesCpuInfo: !config.hidesCpuInfo }
        setConfig({ ...config, ...partial })
    }

    const handleFastCheck = () => {
        const partial: Partial<Config> = { fastMode: !config.fastMode }
        setConfig({ ...config, ...partial })
    }

    return (
        <Container maxWidth="sm">
            {snapshot.isOver ?
                <Typography className={classes.winner}>
                    {snapshot.winner} WIN!!
                </Typography>
                :
                <TableView game={snapshot} />
            }

            <Grid container
                className={classes.table}
                spacing={2}
                justify="center"
                alignItems="center">

                {snapshot.players.map((player, index) => {
                    return (
                        <Grid item xs={12} key={String(index)}>
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

                <Grid item xs={6} sm={4}>
                    <Checkbox
                        className={classes.configCheck}
                        color="default"
                        checked={config.hidesScore}
                        onClick={handleHideScoreCheck}
                    /> Hide score
                </Grid>
                <Grid item xs={6} sm={4}>
                    <Checkbox
                        className={classes.configCheck}
                        color="default"
                        checked={config.hidesCpuInfo}
                        onClick={handleHideCpuInfoCheck}
                    /> Hide CPU info
                  </Grid>
                <Grid item xs={6} sm={4}>
                    <Checkbox
                        className={classes.configCheck}
                        color="default"
                        checked={config.fastMode}
                        onClick={handleFastCheck}
                    /> Fast mode
                </Grid >
                <Grid item xs={6} sm={12}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={restart}>
                            RESTART
                    </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )
}

export default GameBoard