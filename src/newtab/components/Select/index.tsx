import * as React from 'react'

interface SelectProps {
  options: Array<{ value: string; text: React.ReactNode }>
  value: string
  onChange: (v: string) => void
}
export default function Select(props: SelectProps) {
  const { options, value, onChange } = props
  return (
    <select
      className='select select-bordered select-sm w-40 max-w-xs'
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.text}
        </option>
      ))}
    </select>
  )
}
