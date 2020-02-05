import Sudoku from "../lib/sudoku"

declare var self: any

self.addEventListener("message", (event: any) => {
  const { gridData, mode } = event.data
  const sudoku = new Sudoku({ mode: mode, grid: gridData })

  console.time("Sudoku runs")
  const sudokuSolvedStatus = sudoku.solve()
  console.timeEnd("Sudoku runs")

  self.postMessage({
    success: sudokuSolvedStatus,
    gridData: sudoku.grid
  })

  self.close()
})
