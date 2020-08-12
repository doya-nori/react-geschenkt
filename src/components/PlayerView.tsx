import { Box, Button, Grid, makeStyles, Paper } from "@material-ui/core";
import ComputerIcon from '@material-ui/icons/Computer';
import FaceIcon from '@material-ui/icons/Face';
import StarIcon from '@material-ui/icons/Star';
import React from "react";
import { Config } from "./GameBoard";

const useStyles = makeStyles((theme) => ({
    base: {
        padding: "12px",
        backgroundColor: "#F9FBE7",
        marginTop: "4px",
        marginBottom: "4px",
        fill: "true",
    },
    name: {
        margin: "auto",
        textAlign: "center",
        padding: "16px",
        backgroundColor: "#607D8B",
        color: "#FFFFFF"
    },
    handContainer: {
        maxWidth: "100%",
    },
    handCard: {
        textAlign: "center",
        padding: "4px",
        fontSize: "12px",
        margin: "4px",
        fill: "true"
    },
    bsutton: {

    },
    turnIcon: {
        padding: "4px",
        fontSize: "24px",
        color: "#FF5722"
    },
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

    const showsScore = !props.config.hidesScore && !props.config.hidesScore
    const showsChip = !(props.isCpu && props.config.hidesCpuInfo)
    const showsHand = !(props.isCpu && props.config.hidesCpuInfo)

    return (
        <Grid
            container
            className={classes.base}
            spacing={2}
            justify="flex-start"
            alignItems="center"
        >
            <Grid item sm={1}>
                {props.isTurn && <StarIcon className={classes.turnIcon} />}
            </Grid>
            <Grid item sm={1}>
                {props.isCpu ? <ComputerIcon /> : <FaceIcon />}
            </Grid>
            <Grid item sm={4}>
                <Box className={classes.name}>
                    {props.name}
                </Box>
            </Grid>
            <Grid item sm={2} />
            {showsButton &&
                <Grid item sm={2}>
                    <Button
                        variant="contained"
                        onClick={props.onPay}
                        disabled={props.chip === 0}
                    >PAY</Button>
                </Grid>
            }
            {showsButton &&
                <Grid item sm={2} >
                    <Button variant="contained" onClick={props.onDraw}
                    >DRAW</Button>
                </Grid>
            }
            {!showsButton && (props.isCpu ?
                (<Grid item sm={4}>
                    {props.cpuStatus}
                </Grid>)
                :
                <Grid item sm={4} />
            )
            }
            <Grid item sm={1} />
            <Grid item sm>
                <Grid container className={classes.handContainer}>
                    {props.hand.map((value) => {
                        return (
                            <Grid item sm={1} key={String(value)} >
                                <Paper className={classes.handCard}>
                                    {showsHand ? String(value) : "??"}
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
            <Grid item sm={2}>
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