import * as React from 'react'
import { ConnectedProps } from 'observable-duck'
import Duck from './Duck'
import * as classnames from 'classnames'

export default function Template(props: ConnectedProps<Duck>) {
  const { duck, store, dispatch } = props
  const { creators } = duck
  const handlers = React.useMemo(
    () => ({
      setValue: (v: string) => dispatch(creators.setValue(v)),
      search: () => dispatch(creators.search()),
      keydown: (v: string) => dispatch(creators.keydown(v)),
    }),
    []
  )
  return (
    <div className={classnames('dropdown', store.completes.length && 'dropdown-open')}>
      <div className='join border shadow-md'>
        <input
          className='input min-w-96 join-item focus:outline-none border-none'
          placeholder='Search'
          enterKeyHint='search'
          value={store.value}
          onChange={(event) => handlers.setValue(event.target.value)}
          onKeyDown={(event) => handlers.keydown(event.key)}
        />
        <button className='btn join-item glass' onClick={handlers.search}>
          Search
        </button>
      </div>
      {!!store.completes.length && (
        <div className='dropdown-content z-[1] w-full p-2 mt-1 shadow-md bg-base-100 rounded-box'>
          <ul className='menu p-0'>
            {store.completes.map((complete) => (
              <li
                className={classnames(
                  'cursor-pointer',
                  'rounded-md',
                  complete.text === store.completeSelected && 'bg-base-300'
                )}
                key={complete.text}
                onClick={() => {
                  handlers.setValue(complete.text)
                  handlers.search()
                }}
              >
                <span
                  className={classnames(complete.desc && 'tooltip tooltip-right')}
                  data-tip={complete.desc}
                >
                  <div className='flex justify-start items-center'>
                    {complete.image && (
                      <img
                        className='mr-2 h-6'
                        src={complete.image}
                        alt={complete.text}
                        loading='lazy'
                      />
                    )}
                    {complete.text}
                  </div>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
