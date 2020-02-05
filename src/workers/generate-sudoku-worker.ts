import Sudoku from "../lib/sudoku"

declare var self: any

self.addEventListener("message", (event: any) => {
  const sudoku = new Sudoku({ mode: event.data.mode })

  console.time("Sudoku generates")
  sudoku.generate()
  console.timeEnd("Sudoku generates")

  self.postMessage({
    gridData: sudoku.grid
  })

  self.close()
})
