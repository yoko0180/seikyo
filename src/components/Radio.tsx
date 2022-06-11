import { nanoid } from 'nanoid'

export const Radio: React.FC<{
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: any
  checkedTarget: any
  prefixId: string
}> = ({ onChange, value, checkedTarget, prefixId, children }) => (
  <div>
    <input
      type="radio"
      id={prefixId + 'radio_' + value}
      value={value}
      checked={checkedTarget === value}
      onChange={onChange}
    />
    <label htmlFor={prefixId + 'radio_' + value}>{children}</label>
  </div>
)

export type RadioItem = {
  text: string
  value: any
}

export const RadioItems: React.FC<{
  onChange: React.ChangeEventHandler<HTMLInputElement>
  label: string
  title?: string
  items: RadioItem[]
  checkedTarget: any
}> = ({ label, title, items, checkedTarget, onChange }) => {
  const prefixId = 'r' + nanoid()
  return (
    <div className="p-2">
      <h4 title={title}>{label}</h4>
      {items.map((item, index) => (
        <Radio key={`radio-` + index} prefixId={prefixId} value={item.value} checkedTarget={checkedTarget} onChange={onChange}>
          {item.text}
        </Radio>
      ))}
    </div>
  )
}