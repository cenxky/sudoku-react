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

    return (this.grid[y][x] = value)
  }

  row(y: number): number[] {
    return this.grid[y]
  }

  column(x: number): number[] {
    return this.grid.map(row => row[x])
  }

  allowedNumbersInRow(y: number) {
    const row = this.row(y)
    return NUMBERS.filter(num => !row.includes(num))
  }

  allowedNumbersInColumn(x: number) {
    const column = this.column(x)
    return NUMBERS.filter(num => !column.includes(num))
  }

  allowedNumbersInBlock(x: number, y: number) {
    const bx = Math.floor(x / 3) * 3
    const by = Math.floor(y / 3) * 3

    let numbersInBlock: number[] = []

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        numbersInBlock.push(this.get(bx + i, by + j))
      }
    }

    return NUMBERS.filter(num => !numbersInBlock.includes(num))
  }

  allowedNumbers(x: number, y: number) {
    const numbersInBlock = this.allowedNumbersInBlock(x, y)

    if (numbersInBlock.length > 1) {
      const numbersInRow = this.allowedNumbersInRow(y)
      const numbersInColumn = this.allowedNumbersInColumn(x)
      return numbersInBlock.filter(
        num => numbersInRow.includes(num) && numbersInColumn.includes(num)
      )
    } else {
      return numbersInBlock
    }
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

  anyEmptyCell(allowedNumbersLength = SIZE + 1) {
    let cell: number[] = []

    this.emptyCells().some((emptyCell: number[]) => {
      const [x, y] = emptyCell
      const length = this.allowedNumbers(x, y).length

      if (length < allowedNumbersLength) {
        cell = emptyCell
        allowedNumbersLength = length
      }

      return length === 1
    })

    return cell
  }

  isSolved() {
    return this.grid.every((row, y) => row.every((num, x) => num))
  }

  solve() {
    return this.solveUltimately()
  }

  solveUltimately() {
    if (this.isSolved()) {
      return true
    }

    let [x, y] = this.anyEmptyCell()
    var allowedNumbers = this.allowedNumbers(x, y)

    while (allowedNumbers.length > 0) {
      let value = allowedNumbers.shift() as number
      this.set(x, y, value)

      try {
        if (this.solveUltimately()) {
          return true
        }
      } catch (err) {
        // Nothing
      }

      this.set(x, y, 0)
    }

    return false
  }
}
