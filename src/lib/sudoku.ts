const SIZE = 9
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default class Sudoku {
  grid: Array<number[]>

  constructor(grid?: Array<number[]>) {
    this.grid = grid || this.defaultGrid()
  }

  reset() {
    this.grid = this.defaultGrid()
  }

  defaultGrid() {
    return [...Array(SIZE)].map(x => [...Array(SIZE).fill(0)])
  }

  get(x: number, y: number): number {
    return this.grid[y][x]
  }

  set(x: number, y: number, value: number): Error | number {
    if (value) {
      if (!this.allowedNumbersInRow(y).includes(value)) {
        throw new Error(`${value} is not allowed in the row ${y}`)
      }

      if (!this.allowedNumbersInColumn(x).includes(value)) {
        throw new Error(`${value} is not allowed in the column ${x}`)
      }

      if (!this.allowedNumbersInBlock(x, y).includes(value)) {
        throw new Error(`${value} is not allowed in the block ${y}`)
      }
    }

    return this.grid[y][x] = value
  }

  row(y: number): number[] {
    return this.grid[y]
  }

  column(x: number): number[] {
    return this.grid.map(row => row[x])
  }

  allowedNumbersInRow(y: number) {
    return NUMBERS.filter(num => !this.row(y).includes(num))
  }

  allowedNumbersInColumn(x: number) {
    return NUMBERS.filter(num => !this.column(x).includes(num))
  }

  allowedNumbersInBlock(x: number, y: number) {
    const bx = Math.floor(x / 3) * 3
    const by = Math.floor(y / 3) * 3

    let numbers_in_block: number[] = []

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        numbers_in_block.push(this.get(bx + i, by + j))
      }
    }

    return NUMBERS.filter(num => !numbers_in_block.includes(num))
  }

  allowedNumbers(x: number, y: number) {
    return this.allowedNumbersInBlock(x, y)
      .filter(num => (
        this.allowedNumbersInRow(y).includes(num) &&
        this.allowedNumbersInColumn(x).includes(num)
      ))
  }

  emptyCells() {
    let cells: Array<[number, number]> = []

    this.grid.forEach((row, y) => {
      row.forEach((num, x) => {
        !num && cells.push([x, y])
      })
    })

    return cells
  }

  solve() {
    // // row
    // for (var y = 0; y < 9; y++) {
    //   var emptyCellsInRow: Array<number[]> = []
    //   this.row(y).forEach((value: number, x: number) => {
    //     !value && emptyCellsInRow.push([x, y])
    //   })

    //   const valuesInEmptyCells = emptyCellsInRow.map((cell: number[]) => (
    //     this.allowedNumbers(cell[0], cell[1])
    //   ))
    // }

    // return this.solvePrimary() || this.solveUltimately()

    return this.solveUltimately()
  }

  solvePrimary() {
    if (!this.emptyCells().length) { return true }

    var loop = false

    this.emptyCells().forEach((cell: number[]) => {
      const [x, y] = cell
      const allowedNumbers = this.allowedNumbers(x, y)

      if (allowedNumbers.length === 1) {
        this.set(x, y, allowedNumbers[0])
        loop = true
      }
    })

    if (loop) { this.solvePrimary() }
  }

  solveUltimately() {
    if (!this.emptyCells().length) { return true }

    let [x, y] = this.emptyCells()[0]
    var allowedNumbers = this.allowedNumbers(x, y)

    while (allowedNumbers.length > 0) {
      let value = allowedNumbers.shift() as number
      this.set(x, y, value)

      try {
        if (this.solve()) { return true }
      } catch(err) {
        // Nothing
      }

      this.set(x, y, 0)
    }

    return false
  }
}
