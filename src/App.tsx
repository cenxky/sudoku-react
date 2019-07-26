import React, { useState } from 'react'
import cx from 'classnames'
import Sudoku from './lib/sudoku'

import './App.scss'
import 'antd/dist/antd.css'
import { Layout, Button, Modal, message } from 'antd'

// const sudoku = new Sudoku()
const sudoku = new Sudoku([
  [5, 1, 9, 0, 0, 0, 4, 3, 0],
  [7, 2, 4, 9, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 5, 4, 9, 0, 0],
  [1, 7, 0, 0, 4, 0, 2, 0, 6],
  [0, 0, 0, 0, 9, 0, 0, 0, 3],
  [0, 0, 3, 0, 0, 6, 0, 8, 0],
  [0, 0, 1, 4, 7, 0, 0, 6, 0],
  [0, 0, 0, 5, 0, 8, 1, 2, 0],
  [0, 9, 0, 0, 6, 0, 3, 0, 4]
])

type GridDataType = Array<number[]>

export default function App() {
  const [gridData, setGridData] = useState<GridDataType>(sudoku.grid)
  const [solvedCells, setSolvedCells] = useState<GridDataType>([])

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

    console.time('Sudoku runs');

    if (sudoku.solve()) {
      setGridData([...sudoku.grid])
    } else {
      Modal.error({
        title: 'Sudoku',
        content: 'Sorry, this sudoku has no solution!'
      });
    }

    console.timeEnd('Sudoku runs');
  }

  const resetSudoku = () => {
    sudoku.reset()
    setSolvedCells([])
    setGridData([...sudoku.grid])
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
                    className={cx({ "block-boder": (y + 1) % 3 === 0 })}
                  >
                    {row.map((value, x) => (
                      <td
                        key={x}
                        className={cx({
                          "block-boder": (x + 1) % 3 === 0,
                          "solved": solvedCells.some(arr => arr.join() === [x, y].join())
                        })}
                      >
                        <input
                          type="text"
                          value={value || ""}
                          onChange={e => setValue(x, y, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="sudoku-actions">
              <Button.Group>
                <Button type="primary" size="large" onClick={solveSudoku}>Solve Now!</Button>
                <Button type="default" size="large" onClick={resetSudoku}>Clear All</Button>
              </Button.Group>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  )
}
