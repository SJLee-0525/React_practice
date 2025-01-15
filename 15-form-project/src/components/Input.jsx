export default function Input({ label, id, error, ...props }) {
  return (
    <div className="control no-margin">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" name="email" {...props} />
      <div className="control-error">{error && <p>{error}</p>}</div>
    </div>
  )
}
