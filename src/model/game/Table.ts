const CARD_MIN = 3
const CARD_MAX = 35
const EXCLUDE_NUM = 9

export default class Table {
    private deck: number[] = Array(0)
    private drawCount = 0
    upcard: number = 0
    chipStack: number = 0

    constructor() {
        this.shuffleDeck()
        this.upcard = this.deck[this.drawCount]
    }

    private shuffleDeck = () => {
        const array = Array.from(Array(CARD_MAX - CARD_MIN).keys()).map(
            (value: number) => { return value + CARD_MIN }
        )

        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        this.deck = array.slice(EXCLUDE_NUM)
    }

    remain = () => this.deck.length - this.drawCount

    isEmpty = () => this.remain() === 0

    verifyNotEmpty = () => {
        if (this.isEmpty()) throw Error("All cards have been drawn already!")
    }

    pay = () => {
        this.verifyNotEmpty()

        this.chipStack++
    }

    draw = (): number[] => {
        this.verifyNotEmpty()

        const result = [this.upcard, this.chipStack]
        this.drawCount++
        this.upcard = this.deck[this.drawCount]
        this.chipStack = 0

        return result
    }
}