import React, { useState, useEffect, useRef } from "react"
import cx from "classnames"
import Sudoku from "./lib/sudoku"

import "./App.scss"
import "antd/dist/antd.css"
import { Layout, Button, Modal, message } from "antd"

const sudoku = new Sudoku()
sudoku.generate()

// const sudoku = new Sudoku([
//   [4, 0, 0, 0, 0, 0, 8, 0, 5],
//   [0, 3, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 7, 0, 0, 0, 0, 0],
//   [0, 2, 0, 0, 0, 0, 0, 6, 0],
//   [0, 0, 0, 0, 8, 0, 4, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 6, 0, 3, 0, 7, 0],
//   [5, 0, 0, 2, 0, 0, 0, 0, 0],
//   [1, 0, 4, 0, 0, 0, 0, 0, 0]
// ])

// const sudoku = new Sudoku([
//   [0, 3, 0, 0, 0, 0, 0, 0, 1],
//   [0, 0, 0, 5, 0, 0, 0, 0, 4],
//   [0, 0, 5, 0, 0, 7, 0, 0, 0],
//   [0, 0, 0, 0, 3, 0, 0, 0, 9],
//   [6, 0, 0, 0, 0, 0, 0, 0, 0],
//   [7, 0, 0, 0, 0, 0, 0, 4, 0],
//   [0, 9, 0, 0, 4, 0, 0, 0, 0],
//   [0, 5, 0, 0, 0, 0, 7, 0, 0],
//   [0, 0, 0, 0, 0, 8, 0, 6, 0]
// ])

type GridDataType = Array<number[]>

export default function App() {
  const inputRefs = useRef<{ [index: string]: HTMLInputElement | null }>({})

  const [gridData, setGridData] = useState<GridDataType>(sudoku.grid)
  const [solvedCells, setSolvedCells] = useState<GridDataType>([])
  const [solving, setSolving] = useState<boolean>(false)
  const [showTips, setShowTips] = useState<boolean>(false)
  const [editingCell, setEditingCell] = useState<string | null>()

  useEffect(() => {
    if (solving) {
      setTimeout(solveSudoku, 300)
    }
  }, [solving])

  useEffect(() => {
    if (editingCell) {
      if (inputRefs.current) {
        const inputRef = inputRefs.current[editingCell]
        inputRef && inputRef.focus()
      }
    }
  }, [editingCell])

  useEffect(() => {
    const listener = (event: any) => {
      if (!event.target.closest(".sudoku-tips")) {
        setEditingCell(null)
      }
    }

    document.addEventListener("click", listener)

    return () => {
      document.removeEventListener("click", listener)
    }
  }, [])

  const setValue = (x: number, y: number, value: string) => {
    const parsedValue = parseInt(value)

    if (value.length && parsedValue > 9) {
      message.info(`Only 1-9 numbers are allowed to input here!`)
      return false
    }

    try {
      sudoku.set(x, y, parsedValue || 0)
    } catch (err) {
      message.warning(`Conflict! You cannot set ${parsedValue} here!`)
      return false
    }

    setGridData([...sudoku.grid])
  }

  const solveSudoku = () => {
    setSolvedCells(sudoku.emptyCells())

    console.time("Sudoku runs")
    const sudokuSolvedStatus = sudoku.solve()
    console.timeEnd("Sudoku runs")

    setSolving(false)

    if (sudokuSolvedStatus) {
      setGridData([...sudoku.grid])
    } else {
      Modal.error({
        title: "Sudoku",
        content: "Sorry, this sudoku has no solution!"
      })
    }
  }

  const generateSudoku = () => {
    resetSudoku()
    sudoku.generate()
    setGridData([...sudoku.grid])
  }

  const resetSudoku = () => {
    sudoku.reset()
    setSolvedCells([])
    setGridData([...sudoku.grid])
    setShowTips(false)
  }

  return (
    <div className="App">
      <Layout>
        <Layout.Content>
          <div className="sudoku-container">
            <table className="sudoku-table">
              <tbody>
                {gridData.map((row, y) => (
                  <tr
                    key={y}
                    className={cx({
                      "block-boder": (y + 1) % 3 === 0
                    })}
                  >
                    {row.map((value, x) => (
                      <td
                        key={x}
                        className={cx({
                          "block-boder": (x + 1) % 3 === 0,
                          solved: solvedCells.some(
                            arr => arr.join() === [x, y].join()
                          )
                        })}
                        onClick={() => setEditingCell([x, y].join())}
                      >
                        {showTips && !value && editingCell !== [x, y].join() ? (
                          <div className="sudoku-tips">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                              <span key={num}>
                                {sudoku.allowedNumbers(x, y).includes(num) &&
                                  num}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={value || ""}
                            onChange={e => setValue(x, y, e.target.value)}
                            readOnly={solving}
                            ref={input =>
                              (inputRefs.current[[x, y].join()] = input)
                            }
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="sudoku-actions">
              <Button.Group>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setSolving(true)}
                  loading={solving}
                >
                  {solving ? "Solving" : "Solve Now!"}
                </Button>
                <Button
                  size="large"
                  onClick={generateSudoku}
                  disabled={solving}
                >
                  Regenerate Sudoku
                </Button>
                <Button size="large" onClick={() => setShowTips(!showTips)}>
                  {showTips ? "Hide Tips" : "Show Tips"}
                </Button>
                <Button size="large" onClick={resetSudoku} disabled={solving}>
                  Clear All
                </Button>
              </Button.Group>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  )
}
