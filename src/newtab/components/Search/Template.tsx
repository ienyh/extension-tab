import * as React from 'react'
import { ConnectedProps } from 'observable-duck'
import Duck, { Engine, EngineMeta } from './Duck'

export default function Template(props: ConnectedProps<Duck>) {
  const { duck, store, dispatch } = props
  const { creators } = duck
  const handlers = React.useMemo(
    () => ({
      search: () => dispatch(creators.search()),
    }),
    []
  )
  return (
    <div>
      <div className='join border shadow-sm'>
        <select
          className='select join-item'
          onChange={(event) => dispatch(creators.setEngine(event.target.value as Engine))}
        >
          {Object.keys(EngineMeta).map((engine) => (
            <option key={engine} value={engine}>
              {EngineMeta[engine].text}
            </option>
          ))}
        </select>
        <input
          className='input min-w-72 join-item focus:outline-none border-none'
          placeholder='Search'
          enterKeyHint='search'
          value={store.value}
          onChange={(event) => dispatch(creators.setValue(event.target.value))}
          onKeyDown={(event) => event.key === 'Enter' && handlers.search()}
        />
        <button className='btn join-item glass' onClick={handlers.search}>
          Search
        </button>
      </div>
    </div>
  )
}
