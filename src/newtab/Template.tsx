import * as React from 'react'
import { ConnectedProps } from 'observable-duck'
import Duck from './Duck'
import Search from './components/Search'
import './style.css'
import Setting from './layout/setting'

export default function Template(props: ConnectedProps<Duck>) {
  const { duck, store, dispatch } = props
  return (
    <>
      <div className='carousel h-lvh w-lvw'>
        <div className='tab-container carousel-item w-full h-full flex justify-center items-center'>
          <div className='relative -top-40'>
            <Search />
          </div>
        </div>
        <div className='tab-container carousel-item w-full h-full grid grid-cols-6 gap-4'>
          <div className='border w-100 h-100'>01</div>
          <div>01</div>
          <div>01</div>
          <div className='col-span-2'>
            <Search />
          </div>
          <div>01</div>
          <div>01</div>
          <div>01</div>
        </div>
      </div>
      <Setting />
    </>
  )
}
