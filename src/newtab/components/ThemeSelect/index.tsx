import * as React from 'react'

const themes = ['light', 'dark', 'cupcake', 'retro', 'cyberpunk', 'dracula']

interface ThemeSelectProps {
  value: string
  onChange: (v: string) => void
}
export default function ThemeSelect(props: ThemeSelectProps) {
  const { value, onChange } = props
  return (
    <div className='dropdown'>
      <div tabIndex={0} role='button' className='btn'>
        {value}
        <svg
          width='12px'
          height='12px'
          className='h-2 w-2 fill-current opacity-60 inline-block'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 2048 2048'
        >
          <path d='M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z'></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className='dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52'
      >
        {themes.map((theme) => (
          <li key={theme}>
            <input
              type='radio'
              name='theme-dropdown'
              className='theme-controller btn btn-sm btn-block btn-ghost justify-start'
              aria-label={theme}
              value={theme}
              checked={theme === value}
              onChange={() => onChange(theme)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
