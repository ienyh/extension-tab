import * as React from 'react'
import Search from './components/Search'
import Setting from './layout/setting'

export default function Template() {
  return (
    <>
      <div className='carousel h-lvh w-lvw'>
        <div className='carousel-item w-full h-full flex justify-center items-center'>
          <div className='relative -top-40'>
            <Search />
          </div>
        </div>
      </div>
      <Setting />
    </>
  )
}
