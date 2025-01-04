// import { useState } from "react"

export default function GameBoard({ onSelectSquare, board }) {
  //   const [gameBoard, setGameBoard] = useState(initialGameBoard)

  //   function handleSelectSquare(rowIndex, colIndex) {
  //     setGameBoard((prevGameBoard) => {
  //       // 아래처럼 객체나 배열을 업데이트 할 때 직접 바꾸는 방식은 추천하지 않음
  //       // prevGameBoard[rowIndex][colIndex] = "X"
  //       // return prevGameBoard

  //       // 이전 상태를 하나 복제한 후, 복제된 버전을 수정하는 것을 권장
  //       // 객체, 배열은 자바 스크립트 내의 참조 값.
  //       // 참조 값을 수정하면 메모리 속의 기존 값을 바로 수정하게 되는데, 이 시점은 리액트가 실행하는 예정된 상태 업데이트보다 이전에 일어나게 됨
  //       // 이런 경우 알 수 없는 버그가 발생할 수 있음
  //       const updatedGameBoard = [...prevGameBoard.map((innerArray) => [...innerArray])]
  //       updatedGameBoard[rowIndex][colIndex] = activePlayerSymbol
  //       return updatedGameBoard
  //     })

  //     // 전달받은 onSelectSquare 함수를 실행해서 X, O를 번갈아가며 표시
  //     onSelectSquare()
  //   }

  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button onClick={() => onSelectSquare(rowIndex, colIndex)} disabled={playerSymbol !== null}>
                  {playerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  )
}
