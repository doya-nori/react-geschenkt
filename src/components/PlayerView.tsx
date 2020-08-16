import { Box, Button, Chip, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import ComputerIcon from '@material-ui/icons/Computer';
import FaceIcon from '@material-ui/icons/Face';
import React from "react";
import { Config } from "./GameBoard";

const useStyles = makeStyles((theme) => ({
    base: {
        backgroundColor: theme.palette.primary.light,
        marginTop: "4px",
        marginBottom: "4px",
    },
    name: {
        margin: "auto",
        textAlign: "center",
        padding: "4px",
        backgroundColor: "#607D8B",
        color: "#FFFFFF"
    },
    handContainer: {
        maxWidth: "100%",
    },
    handCard: {
        textAlign: "center",
        padding: "4px",
        fontSize: "0.8rem",
        margin: "4px",
    },
    button: {
        fontSize: "0.8rem",
        padding: "0rem",
        flexShrink: 1,
    },
    turnIcon: {
        padding: "4px",
        fontSize: "24px",
        color: "#FF5722"
    },
    userChip: {
        maxWidth: "100%"
    }
}));

interface PlayerViewProps {
    name: string
    isCpu: boolean
    hand: number[]
    chip: number
    isTurn: boolean
    score: number | null
    cpuStatus: string
    config: Config
    onPay(): void
    onDraw(): void
}

const PlayerView = (props: PlayerViewProps) => {
    const classes = useStyles()

    const showsButton = (!props.isCpu && props.isTurn)
    const showsStatus = props.isCpu

    const showsScore = !props.config.hidesScore && !props.config.hidesScore
    const showsChip = !(props.isCpu && props.config.hidesCpuInfo)

    const PlayerFace = () => {
        return (
            <Box display="flex" justifyContent="center"
                textOverflow="ellipsis">
                <Chip
                    className={classes.userChip}
                    color={props.isTurn ? "secondary" : "default"}
                    label={props.name}
                    icon={props.isCpu ? <ComputerIcon /> : <FaceIcon />}
                />
            </Box>
        )
    }


    const Buttons = () => {
        return (
            <Grid container>
                <Grid item xs={6} >
                    <Box display="flex" justifyContent="center">
                        <Button
                            className={classes.button}
                            variant="contained" onClick={props.onPay}
                            disabled={props.chip < 1}
                        >PAY [P]</Button>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box display="flex" justifyContent="center">
                        <Button
                            className={classes.button}
                            variant="contained" onClick={props.onDraw}
                        >DRAW [D]</Button>
                    </Box>
                </Grid>
            </Grid>
        )
    }

    const Status = () => {
        return (
            <Typography variant="body2">
                {props.cpuStatus}
            </Typography>
        )
    }

    const Hand = () => {
        return (
            <Grid container className={classes.handContainer}>
                {props.hand.map((value) => {
                    return (
                        <Grid item xs={2} sm={1} key={String(value)} >
                            <Paper className={classes.handCard}>
                                {String(value)}
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    return (
        <Grid
            container
            className={classes.base}
            spacing={2}
            justify="space-evenly"
            alignItems="center"
        >
            <Grid item xs={4}>
                <PlayerFace />
            </Grid>
            <Grid item xs sm />
            <Grid item xs={7} sm={4}>
                {showsButton && <Buttons />}
                {showsStatus && <Status />}
            </Grid>

            <Grid item xs={12} sm={8}>
                <Hand />
            </Grid>
            <Grid item xs={12} sm={4}>
                <Box>
                    {showsChip && "Chip: " + props.chip}

                </Box>
                <Box>
                    {showsScore && "Score: " + props.score}
                </Box>
            </Grid>
        </Grid >
    )
}

export default PlayerView