import {
  Base,
  Cache,
  DuckState,
  From,
  PayloadAction,
  StreamerMethod,
  createToPayload,
  filterAction,
  reduceFromPayload,
} from 'observable-duck'
import { Observable } from 'rxjs'
import { webSocket } from 'rxjs/webSocket'
import { debounceTime } from 'rxjs/operators'
import { Action } from 'redux'
import { runtime } from '@src/newtab/layout/setting'
import reporter from '@src/common/reporter'

export enum Engine {
  Google = 'google',
  Bing = 'bing',
}
export const EngineMeta = {
  [Engine.Google]: {
    text: 'Google',
    getQueryString: (query) => `https://www.google.com/search?q=${query}`,
  },
  [Engine.Bing]: {
    text: 'Bing',
    getQueryString: (query) => `https://www.bing.com/search?q=${query}`,
  },
}

interface CompleteItem {
  text: string
  desc?: string
  image?: string
}

export default class Search extends Base {
  get quickTypes() {
    enum Type {
      SET_ENGINE,
      SET_VALUE,
      SEARCH,
      SET_COMPLETES,
      SET_COMPLETE_SELECTED,
      KEYDOWN,
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
      completes: reduceFromPayload<CompleteItem[]>(types.SET_COMPLETES, []),
      completeSelected: reduceFromPayload<string>(types.SET_COMPLETE_SELECTED, ''),
    }
  }
  get creators() {
    const { types } = this
    return {
      setEngine: createToPayload<Engine>(types.SET_ENGINE),
      setValue: createToPayload<string>(types.SET_VALUE),
      search: createToPayload<void>(types.SEARCH),
      keydown: createToPayload<string>(types.KEYDOWN),
    }
  }
  @From(runtime.redux)
  accept(setting$: Observable<DuckState<typeof runtime.duck>>) {
    const { creators, getState, dispatch } = this
    return setting$.pipe(debounceTime(100)).subscribe((value) => {
      const engine = value.state?.engine
      if (engine && getState().engine !== engine) {
        dispatch(creators.setEngine(engine as Engine))
      }
    })
  }
  @Cache()
  get websocket$() {
    const { types, dispatch } = this
    let $ = webSocket('wss://api.bonjourr.lol/suggestions')
    this.subscription.add(
      $.subscribe({
        next: (data: CompleteItem[]) =>
          dispatch({
            type: types.SET_COMPLETES,
            payload: data,
          }),
        error: reporter.error,
      })
    )
    return $
  }
  @StreamerMethod()
  watchComplete(action$: Observable<Action>) {
    const duck = this
    const { types, getState, dispatch } = duck
    return action$
      .pipe(filterAction([types.SET_VALUE, types.SET_ENGINE]), debounceTime(300))
      .subscribe(() => {
        const { value, engine } = getState()
        if (!value) {
          dispatch({
            type: types.SET_COMPLETES,
            payload: [],
          })
          dispatch({
            type: types.SET_COMPLETE_SELECTED,
            payload: '',
          })
          return
        }
        duck.websocket$.next({ q: value, with: engine })
      })
  }
  @StreamerMethod()
  watchSearch(action$: Observable<Action>) {
    const duck = this
    return action$.pipe(filterAction(duck.types.SEARCH)).subscribe(() => {
      const { value, engine, completeSelected } = duck.getState()
      if (value) {
        const query = completeSelected || value
        location.assign(EngineMeta[engine as Engine].getQueryString(query))
      }
    })
  }
  @StreamerMethod()
  watchKeydown(action$: Observable<PayloadAction<string>>) {
    const duck = this
    const { types, creators, dispatch } = duck
    return action$.pipe(filterAction(types.KEYDOWN)).subscribe((action) => {
      const key = action.payload
      if (key === 'Enter') {
        dispatch(creators.search())
      }
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        const { completes, completeSelected } = duck.getState()
        if (!completeSelected) {
          dispatch({
            type: types.SET_COMPLETE_SELECTED,
            payload: completes[0].text,
          })
          return
        }
        const current = completes.findIndex((item) => item.text === completeSelected)
        if (current === -1) {
          return
        }
        dispatch({
          type: types.SET_COMPLETE_SELECTED,
          payload: completes.at(
            (key === 'ArrowDown' ? current + 1 : current - 1) % completes.length
          ).text,
        })
      }
    })
  }
}
