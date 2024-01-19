import {
  Base,
  StreamerMethod,
  createToPayload,
  filterAction,
  reduceFromPayload,
} from 'observable-duck'
import { Observable } from 'rxjs'
import { Action } from 'redux'

export default class ThemeSwitch extends Base {
  get quickTypes() {
    enum Type {
      SET_VALUE,
      SEARCH,
    }
    return {
      ...Type,
    }
  }
  get reducers() {
    const types = this.types
    return {
      value: reduceFromPayload<string>(types.SET_VALUE, ''),
    }
  }
  get creators() {
    const { types } = this
    return {
      setValue: createToPayload<string>(types.SET_VALUE),
      search: createToPayload<void>(types.SEARCH),
    }
  }
  @StreamerMethod()
  watchUpdate(action$: Observable<Action>) {
    const duck = this
    return action$.pipe(filterAction(duck.types.SEARCH)).subscribe(() => {
      const state = duck.getState()
    })
  }
}
