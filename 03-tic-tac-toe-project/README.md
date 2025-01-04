# 2

## 이전 상태를 기반으로 상태 업데이트하기

- React는 상태에 대한 변화의 스케쥴을 조율함
- 상태 변경은 즉각적으로 이루어지는 것이 아님
- 아래 코드의 경우 두번의 상태 변경을 통해 false -> true -> false를 거쳐 false로 변경되어야 할 것 처럼 보임.
- 하지만 React는 두번의 상태 변경을 하나로 합쳐서 처리하기에, 실제로는 false -> true로 작동함 (두 isEditing 모두 현재 상태를 기준으로 잡음 (false) )

```javascript
const [isEditing, setIsEditing] = useState(false)

function handleEditClick() {
  setIsEditing(!isEditing) // false -> true
  setIsEditing(!isEditing) // false -> true
}
```

- 이런 경우 함수형 업데이트를 사용하여 이전 상태를 기반으로 상태를 업데이트 할 수 있음

```javascript
const [isEditing, setIsEditing] = useState(false)

function handleEditClick() {
  setIsEditing((editing) => !editing) // false -> true
  setIsEditing((editing) => !editing) // true -> false
  // 아래 함수의 editing은 첫번째로 예정된 사항 이후 실행되기 떄문에
  // React는 변경된 상태값을 전달하게 됨
}
```

```javascript
import { useState } from "react"

export default function Player({ initialName, symbol, isActive, onChangeName }) {
  const [playerName, setPlayerName] = useState(initialName)
  const [isEditing, setIsEditing] = useState(false)

  function handleEditClick() {
    setIsEditing((editing) => {
      return !editing
    })

    if (isEditing) {
      onChangeName(symbol, playerName)
    }
  }

  function handleChange(event) {
    console.log(event.target.value)
    setPlayerName(event.target.value)
  }

  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {isEditing ? <input type="text" value={playerName} onChange={handleChange} required></input> : null}
        {!isEditing ? <span className="player-name">{playerName}</span> : null}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  )
}
```

## 참조 자료형 업데이트

- 객체나 배열을 업데이트 할 때 직접 바꾸는 방식은 추천하지 않음
- 이전 상태를 하나 복제한 후, 복제된 버전을 수정하는 것을 권장

```javascript
export default function GameBoard({ onSelectSquare, board }) {
    const [gameBoard, setGameBoard] = useState(initialGameBoard)

    function handleSelectSquare(rowIndex, colIndex) {
      setGameBoard((prevGameBoard) => {
        // 아래처럼 객체나 배열을 업데이트 할 때 직접 바꾸는 방식은 추천하지 않음
        // prevGameBoard[rowIndex][colIndex] = "X"
        // return prevGameBoard

        // 이전 상태를 하나 복제한 후, 복제된 버전을 수정하는 것을 권장
        // 객체, 배열은 자바 스크립트 내의 참조 값.
        // 참조 값을 수정하면 메모리 속의 기존 값을 바로 수정하게 되는데, 이 시점은 리액트가 실행하는 예정된 상태 업데이트보다 이전에 일어나게 됨
        // 이런 경우 알 수 없는 버그가 발생할 수 있음
        const updatedGameBoard = [...prevGameBoard.map((innerArray) => [...innerArray])]
        updatedGameBoard[rowIndex][colIndex] = activePlayerSymbol
        return updatedGameBoard
      })

      // 전달받은 onSelectSquare 함수를 실행해서 X, O를 번갈아가며 표시
      onSelectSquare()
    }

    return()
}
```
