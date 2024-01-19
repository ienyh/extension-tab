import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import Template from './Template'
import Duck from './Duck'
import connect from '@src/utils/connect'
import './index.css'

const Popup = connect(Duck, Template)
ReactDom.createRoot(document.querySelector('#extension-newtab')).render(<Popup />)
