import { StreamerMethod, createToPayload, filterAction, reduceFromPayload } from 'observable-duck'
import { Observable } from 'rxjs'
import { Action } from 'redux'
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
  @StreamerMethod()
  watchUpdate(action$: Observable<Action>) {
    const duck = this
    const { dispatch, creators } = duck
    dispatch(
      creators.set({
        theme: 'default',
      })
    )
    return action$.pipe(filterAction([])).subscribe(() => {
      const state = duck.getState()
      console.log(state)
    })
  }
}
