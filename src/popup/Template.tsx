import * as React from 'react'
import { ConnectedProps } from 'observable-duck'
import Duck from './Duck'
import './style.css'

export default function Template(props: ConnectedProps<Duck>) {
  return (
    <div className='popup'>
      <button onClick={() => chrome.tabs.create({})}>Open New Tab</button>
    </div>
  )
}
