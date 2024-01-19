import {
  Base,
  StreamerMethod,
  createToPayload,
  filterAction,
  reduceFromPayload,
} from 'observable-duck'
import { Observable } from 'rxjs'
import { Action } from 'redux'

export enum Engine {
  Google = 'google',
  Bing = 'bing',
}
export const EngineMeta = {
  [Engine.Google]: {
    text: 'Google',
    getQueryString: (query) => `https://www.google.com/search?q=${query}`
  },
  [Engine.Bing]: {
    text: 'Bing',
    getQueryString: (query) => `https://www.bing.com/search?q=${query}`
  },
}

export default class Search extends Base {
  get quickTypes() {
    enum Type {
      SET_ENGINE,
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
      engine: reduceFromPayload<Engine>(types.SET_ENGINE, Engine.Google),
    }
  }
  get creators() {
    const { types } = this
    return {
      setEngine: createToPayload<Engine>(types.SET_ENGINE),
      setValue: createToPayload<string>(types.SET_VALUE),
      search: createToPayload<void>(types.SEARCH),
    }
  }
  @StreamerMethod()
  watchUpdate(action$: Observable<Action>) {
    const duck = this
    return action$.pipe(filterAction(duck.types.SEARCH)).subscribe(() => {
      const { value, engine } = duck.getState()
      if (value) {
        location.assign(EngineMeta[engine as Engine].getQueryString(value))
      }
    })
  }
}
