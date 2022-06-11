const Hinmoku: React.FC<{label: string}> = ({label}) => {
  const doChange = (e: string) => {}
  return (
    <div>
      <label htmlFor="">
        <span className="hin">{label}</span>
        <input
          type="number"
          className="num border p-3 rounded text-gray-900"
          onChange={(e) => doChange(e.target.value.trim())}
        />
      </label>
    </div>
  )
}

export default Hinmoku
