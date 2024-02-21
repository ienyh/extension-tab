import Template from './Template'
import Duck from './Duck'
import { create } from '@src/utils/connect'

export const runtime = create(Duck)
export default runtime.connect(Template)
