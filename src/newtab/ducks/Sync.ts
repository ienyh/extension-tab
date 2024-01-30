import {
  Base,
  StreamerMethod,
  filterAction,
  createToPayload,
  PayloadAction,
  DuckState,
} from 'observable-duck'
import { Observable, Subject, Subscription } from 'rxjs'

export interface Adaptor<T = any> {
  watch(): Observable<T>
  preform($state: Observable<T>): void
}
export abstract class Sync extends Base {
  SyncParams: {}
  abstract get adaptor(): Adaptor
  [Symbol.dispose]() {
    super[Symbol.dispose]()
    const { subscription } = this
    if (subscription && !subscription.closed) {
      subscription.unsubscribe()
    }
  }
  preform: Subject<this['SyncParams']>
  subscription: Subscription
  init(getState, dispatch) {
    super.init(getState, dispatch)
    const duck = this
    const { types, adaptor } = duck
    this.subscription = adaptor.watch().subscribe((state) => {
      dispatch({
        type: types.SET,
        payload: state,
      })
    })
    const subject = new Subject<this['SyncParams']>()
    adaptor.preform(subject)
    this.preform = subject
  }
  get quickTypes() {
    enum Type {
      SET,
      PUSH,
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
      state: (state = null, action: PayloadAction): this['SyncParams'] => {
        switch (action.type) {
          case types.SET:
            return action.payload
          case types.PUSH: {
            if (!state) {
              return action.payload
            }
            return {
              ...state,
              ...action.payload,
            }
          }
          default:
            return state
        }
      },
    }
  }
  get quickSelectors() {
    type State = DuckState<this>
    return {
      ...super.quickSelectors,
      state: (s: State) => s.state,
    }
  }
  get creators() {
    const { types } = this
    type SyncParams = this['SyncParams']
    return {
      ...super.creators,
      set: createToPayload<SyncParams>(types.SET),
      push: createToPayload<Partial<SyncParams>>(types.PUSH),
    }
  }

  @StreamerMethod()
  set(action$: Observable<PayloadAction>) {
    const { types, preform, getState } = this
    return action$.pipe(filterAction([types.SET, types.PUSH])).subscribe(() => {
      if (preform) {
        preform.next(getState().state)
      }
    })
  }
}
