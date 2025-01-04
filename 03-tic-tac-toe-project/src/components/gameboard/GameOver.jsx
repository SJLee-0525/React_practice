export default function GameOver({ winner, onReMatch }) {
  return (
    <div id="game-over">
      <h2>Game Over!</h2>
      {winner && <p>{winner} won</p>}
      {!winner && <p>It's a draw!</p>}
      <p>
        <button onClick={onReMatch}>REMATCH</button>
      </p>
    </div>
  )
}
