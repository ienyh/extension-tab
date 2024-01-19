import {
  Base,
  StreamerMethod,
  createToPayload,
  filterAction,
  reduceFromPayload,
} from 'observable-duck'
import { Observable } from 'rxjs'
import { Action } from 'redux'

export default class Tab extends Base {
  get quickTypes() {
    enum Type {
      SET,
      SEARCH,
    }
    return {
      ...Type,
    }
  }
  get reducers() {
    const types = this.types
    return {
      value: reduceFromPayload<string>(types.SET, ''),
    }
  }
  get creators() {
    const { types } = this
    return {
      set: createToPayload<string>(types.SET),
      search: createToPayload<void>(types.SEARCH),
    }
  }
  @StreamerMethod()
  watchUpdate(action$: Observable<Action>) {
    const duck = this
    return action$.pipe(filterAction(duck.types.SEARCH)).subscribe(() => {
      const state = duck.getState()
      location.assign(`https://www.google.com/search?q=${state.value}`)
    })
  }
}
