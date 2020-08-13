import Table from './Table';
import Player, { PlayerSnapshot } from './Player';
import { CpuSet, CpuStatus } from '../cpu/Cpu';

const PLAYER_NUM = 3
const DEFAULT_CHIP = 11

export interface GameSnapshot {
    isOver: boolean,
    winner: string,
    upcard: number,
    stack: number,
    remaining: number,
    turn: number,
    players: PlayerSnapshot[],
    cpuStatus: string[],
}

var count = 0

export default class Game {
    table: Table = new Table()
    players: Player[]
    turn: number = 0
    cpu: CpuSet
    private isFastMode = false

    c = count++;

    constructor() {
        this.players = Array(PLAYER_NUM)

        for (let i = 0; i < this.players.length; i++) {
            const isCpu = i !== 0
            // const isCpu = true
            const name = isCpu ? ("CPU" + i) : "YOU"
            this.players[i] = new Player(name, DEFAULT_CHIP, isCpu)
        }
        this.cpu = new CpuSet(PLAYER_NUM)
        this.cpu.onStatusChanged = this.onCpuStatusChanged
        this.cpu.setFastMode(this.isFastMode)
    }

    start = () => {
        this.turn = 0
        this.tellCpuTurn()
    }

    pay = (playerIndex: number) => {
        this.verifyTurn(playerIndex)

        this.table.pay()
        this.players[playerIndex].pay()
        this.next()

        this.onUpdated(this.snapshot())
        this.tellCpuTurn()
    }

    draw = (playerIndex: number) => {
        this.verifyTurn(playerIndex)

        const [card, chip] = this.table.draw()
        this.players[playerIndex].draw(card, chip)

        if (this.table.isEmpty()) {
            this.turn = -1
            this.onOver()
        }

        this.onUpdated(this.snapshot())
        this.tellCpuTurn()
    }

    terminate = () => {
        this.cpu.terminate()
    }

    private onCpuStatusChanged = (status: CpuStatus[]) => {
        if (status[this.turn] === "PAY") {
            setTimeout(() => { this.pay(this.turn) },
                this.isFastMode ? 10 : 500)
        }

        if (status[this.turn] === "DRAW") {
            setTimeout(() => { this.draw(this.turn) },
                this.isFastMode ? 10 : 500)
        }

        this.onUpdated(this.snapshot())
    }

    private verifyTurn = (playerIndex: number) => {
        if (playerIndex !== this.turn) {
            throw Error("Illegal opearation by " + playerIndex +
                ", it's " + this.turn + "'s turn.")
        }
    }

    private next = () => {
        this.turn++
        if (this.turn >= this.players.length) this.turn = 0
    }

    private tellCpuTurn = () => {
        if (!this.isOver() && this.players[this.turn].isCpu) {
            this.cpu.onTurn(
                this.turn,
                this.players[this.turn].chip,
                this.table.upcard
            )
        }
    }

    isOver = () => this.turn < 0

    getWinner = () => {
        return this.players.reduce((a, b) => a.score() > b.score() ? a : b)
    }

    onUpdated = (snapshot: GameSnapshot) => { }

    onOver = () => { }

    setFastMode = (isFast: boolean) => {
        this.isFastMode = isFast
        this.cpu.setFastMode(isFast)
    }

    snapshot = (): GameSnapshot => {
        return {
            isOver: this.isOver(),
            winner: this.getWinner().name,
            upcard: this.table.upcard,
            stack: this.table.chipStack,
            remaining: this.table.remain(),
            turn: this.turn,
            players: this.players.map((p) => p.snapshot()),
            cpuStatus: this.cpu.printStatus(),
        }
    }
}
