const cpuStatus =
    ["IDLE", "THINKING", "DRAW", "PAY"] as const;
export type CpuStatus = typeof cpuStatus[number];

export const statusToText = (status: CpuStatus) => {
    var text = ""
    switch (status) {
        case "IDLE":
            text = "(^ ^)"
            break
        case "THINKING":
            text = "(-_-) Hmmm..."
            break
        case "DRAW":
            text = "(0_0) DRAW!!!!!"
            break
        case "PAY":
            text = "(>_<) PAY!!"
            break
    }
    return text
}

export interface GameInfo {
    chip: number
    upcard: number
}


class RandomCpu {
    status: CpuStatus = "IDLE"
    onStatusChanged: (() => void)
    isFast = false

    requestSet: GameInfo[] = []
    doneSet: GameInfo[] = []

    constructor(callback: (() => void)) {
        this.onStatusChanged = callback
    }

    onTurn = (info: GameInfo) => {
        const even =
            (element: GameInfo) =>
                element.chip === info.chip && element.upcard === info.upcard

        if (this.requestSet.some(even) || this.doneSet.some(even)) {
            console.log("There is already the info; skip!")
            return
        }

        this.requestSet.push(info)
        this.handleRequest()
    }

    private sleep = async (ms: number) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }

    private handleRequest = async () => {
        const info = this.requestSet.shift()
        if (info === undefined) return

        this.updateStatus("THINKING")

        await this.sleep(this.isFast ? 10 : 500)

        this.updateStatus(this.shouldPay(info) ? "PAY" : "DRAW")

        await this.sleep(this.isFast ? 10 : 1000)

        this.updateStatus("IDLE")

        this.doneSet.push(info)
    }

    private updateStatus = (status: CpuStatus) => {
        this.status = status
        this.onStatusChanged()
    }

    shouldPay = (info: GameInfo) => {
        if (info.chip <= 0) {
            return false;
        }

        const score =
            (info.upcard / 35) * 0.5 +
            (info.chip / 11) * 0.5
        return score > Math.random()
    }
}

export class CpuSet {
    cpus: RandomCpu[]

    onStatusChanged = (statusList: CpuStatus[]) => { }

    constructor(num: number) {
        this.cpus = Array(num)
        for (let i = 0; i < num; i++) {
            this.cpus[i] = new RandomCpu(this.onChanged)
        }
    }

    onTurn(index: number, chip: number, upcard: number) {
        this.cpus[index].onTurn({
            chip: chip, upcard: upcard,
        })
    }

    onChanged = () => {
        this.onStatusChanged(this.cpus.map((cpu) => cpu.status))
    }

    printStatus = (): string[] => {
        return this.cpus.map((cpu) => {
            return statusToText(cpu.status)
        })
    }

    terminate = () => {
    }

    setFastMode = (isFast: boolean) => {
        this.cpus.forEach((cpu) => { cpu.isFast = isFast })
    }
}