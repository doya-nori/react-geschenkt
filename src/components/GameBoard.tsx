import { Backdrop, Box, Button, Checkbox, CircularProgress, Container, Grid, Typography } from '@material-ui/core';
import { lime } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { auth, loginGoogle, logout } from '../firebase';
import Game from '../model/game/Game';
import PlayerView from './PlayerView';
import TableView from './TableView';

const useStyles = makeStyles((theme) => ({
    container: {
        outlineColor: lime[50],
    },
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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
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

    const [user, setUser] =
        useState(undefined as (null | undefined | firebase.User))

    auth.onAuthStateChanged((user) => {
        setUser(user)
    })

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
        <Container maxWidth="sm"
            className={classes.container}
            tabIndex={-1}
            onKeyDown={(e) => {
                let game = gameRef.current
                if (game.isOver() || game.turn !== 0) return
                if (e.keyCode === 80 && game.players[0].chip > 0) game.pay(0)
                if (e.keyCode === 68) game.draw(0)
            }}>

            {user === null &&
                <Button onClick={loginGoogle}>
                    GOOGLE LOGIN
                </Button>
            }
            {user !== null && user !== undefined &&
                <Button onClick={logout}>
                    LOGOUT
                </Button>
            }

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
                    var name = player.name
                    if (!player.isCpu &&
                        user !== null
                        && user !== undefined
                        && user.displayName !== null) {
                        name = user.displayName
                    }

                    return (
                        <Grid item xs={12} key={String(index)}>
                            <PlayerView
                                name={name}
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
            <Backdrop
                className={classes.backdrop} open={user === undefined}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container >
    )
}

export default GameBoard