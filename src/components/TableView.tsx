import { Box, makeStyles, Paper, Table, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import React from "react";
import { GameSnapshot } from "../model/game/Game";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        padding: "1rem"
    },
    chipIcon: {
        fontSize: "1rem",
    },
    chipIconTransparent: {
        fontSize: "1rem",
        color: "#00000000"
    },
    textTransparent: {
        color: "#00000000",
    },

    container: {
        maxWidth: "28rem",
        margin: "0.2rem"
    },
    cell: {
        textAlign: "center",
    }

}))

export interface TableViewProps {
    game: GameSnapshot
}


const CHIP_ICON_MAX = 9

const TableView = (props: TableViewProps) => {
    const classes = useStyles()

    const ChipIcons = () => {
        return (
            <React.Fragment>
                {Array(CHIP_ICON_MAX).fill(0).map((_, i) => {
                    return <MonetizationOnIcon
                        className={i < props.game.stack ?
                            classes.chipIcon : classes.chipIconTransparent} />
                })}

                {props.game.stack <= CHIP_ICON_MAX ?
                    <Box className={classes.textTransparent}
                        component="div" display="inline">
                        ...
                    </Box>
                    : <Box component="div" display="inline">
                        ...
                    </Box>
                }
            </React.Fragment>
        )
    }

    return (
        <Box className={classes.root}>
            <TableContainer
                component={Paper}
                className={classes.container}>
                <Table size="small">
                    <TableRow>
                        <TableCell className={classes.cell}>
                            <Typography variant="h5">
                                Upcard
                            </Typography>
                        </TableCell>
                        <TableCell className={classes.cell}>
                            <Typography variant="h4">
                                {props.game.upcard}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.cell}>
                            Remaining deck
                        </TableCell>
                        <TableCell className={classes.cell}>
                            {props.game.remaining}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.cell}>
                            <Typography variant="h5">
                                Chip stack
                            </Typography>
                        </TableCell>
                        <TableCell className={classes.cell}>
                            <Typography variant="h5">
                                <span>{props.game.stack}<br /></span>
                                <ChipIcons />
                            </Typography>
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
        </Box >
        // <React.Fragment>
        //     <Box display="flex" justifyContent="center">
        //         <Paper className={classes.upcard}>
        //             <Box className={classes.upcardText}>
        //                 Upcard : {props.game.upcard}
        //             </Box>
        //         </Paper>
        //     </Box>

        //     <Grid item xs={4} sm={4}>
        //         <Box className={classes.chipBox}>
        //             Chip stack: {props.game.stack}
        //             <Box>
        //                 {Array(Math.min(9, props.game.stack)).fill(0).map((_, i) => {
        //                     return <MonetizationOnIcon
        //                         key={i}
        //                         className={classes.chipIcon} />
        //                 })}
        //                 {props.game.stack > 9 &&
        //                     "..."
        //                 }
        //             </Box>
        //         </Box>
        //     </Grid>

        //     <Grid item xs={4} sm={2} >
        //         Remaining deck:{props.game.deckRemain}
        //     </Grid>

        // </React.Fragment>
    )
}

export default TableView