export default function Section({ title, children, ...props }) {
  return (
    // ...props : id와 같은 속성을 전달받아 펼쳐 요소에 추가할 수 있게 해줌
    <section {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
