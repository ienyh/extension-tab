import { FunctionComponent } from 'react'
import { Base, ConnectedProps, DuckType, Runtime } from 'observable-duck'
import logger from './logger'

export function create<TDuck extends Base>(Duck: DuckType<TDuck>) {
  return Runtime.create(Duck, { middlewares: [logger] })
}

export default function connect<
  TDuck extends Base,
  TComponent extends FunctionComponent<ConnectedProps<TDuck>>,
>(Duck: DuckType<TDuck>, Component: TComponent) {
  return create(Duck).connect(Component)
}
