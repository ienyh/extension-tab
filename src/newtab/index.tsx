import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import Template from './Template'
import './index.css'

ReactDom.createRoot(document.querySelector('#extension-newtab')).render(<Template />)
