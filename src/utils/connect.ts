import { FunctionComponent } from 'react'
import { Base, ConnectedProps, DuckType, Runtime } from 'observable-duck'
import logger from './logger'

export default function connect<
  TDuck extends DuckType<Base>,
  TComponent extends FunctionComponent<ConnectedProps<Base>>,
>(Duck: TDuck, Component: TComponent) {
  return Runtime.create(Duck, { middlewares: [logger] }).connect(Component)
}
