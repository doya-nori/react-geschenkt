export default class Player {
    name: string
    chip: number
    hand: number[] = Array(0)
    isCpu: boolean

    constructor(name: string, initialChip: number, isCpu: boolean) {
        this.name = name
        this.chip = initialChip
        this.isCpu = isCpu
    }

    pay = () => {
        if (this.chip <= 0) throw Error("Cannot pay because this user have chip")
        this.chip--
    }

    draw = (card: number, chip: number) => {
        this.hand.push(card)
        this.hand.sort((a, b) => a - b)
        this.chip += chip
    }

    score = (): number => {
        var score = this.chip;
        for (let i = this.hand.length - 1; i >= 0; i--) {
            if (i > 0 && this.hand[i] - this.hand[i - 1] === 1) {
                continue
            }
            score -= this.hand[i]
        }
        return score
    }

    snapshot = (): PlayerSnapshot => {
        return {
            name: this.name,
            chip: this.chip,
            hand: this.hand.slice(),
            score: this.score(),
            isCpu: this.isCpu,
        }
    }
}

export interface PlayerSnapshot {
    name: string,
    chip: number,
    hand: number[],
    score: number,
    isCpu: boolean,
}