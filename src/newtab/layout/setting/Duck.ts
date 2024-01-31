import { createToPayload, reduceFromPayload } from 'observable-duck'
import { Sync } from '@src/newtab/ducks/Sync'
import { ChromeStorageAdaptor } from './StorageAdaptor'

export default class Setting extends Sync {
  SyncParams: {
    theme?: string
  }
  get adaptor() {
    return new ChromeStorageAdaptor<this['SyncParams']>('sync')
  }
  get quickTypes() {
    enum Type {
      TOGGLE,
    }
    return {
      ...super.quickTypes,
      ...Type,
    }
  }
  get reducers() {
    const { types } = this
    return {
      ...super.reducers,
      visible: reduceFromPayload<boolean>(types.TOGGLE, false),
    }
  }
  get creators() {
    const { types } = this
    return {
      ...super.creators,
      toggle: createToPayload<boolean>(types.TOGGLE),
    }
  }
}
