import { Adaptor } from '../../ducks/Sync'
import { Observable, Subscription } from 'rxjs'

export class ChromeStorageAdaptor<T> implements Adaptor<T>, Disposable {
  watchDispose: Function | undefined
  stateSubscription: Subscription | undefined
  constructor(private type: 'local' | 'sync' | 'session') {}

  watch(): Observable<T> {
    const adaptor = this
    const $ = new Observable<T>((subscriber) => {
      const latest = () => chrome.storage[adaptor.type].get().then((v: T) => subscriber.next(v))
      const listener: Parameters<typeof chrome.storage.onChanged.addListener>[0] = function (
        changes,
        namespace
      ) {
        if (namespace === adaptor.type) {
          latest()
        }
      }
      latest()
      chrome.storage.onChanged.addListener(listener)
      adaptor.watchDispose = () => {
        chrome.storage.onChanged.removeListener(listener)
      }
    })

    return $
  }

  preform($state: Observable<T>): void {
    const adaptor = this
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
    this.stateSubscription = $state.subscribe((state) => {
      chrome.storage[adaptor.type].set(state)
    })
  }

  [Symbol.dispose](): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe()
    }
    if (this.watchDispose) {
      this.watchDispose()
    }
  }
}
