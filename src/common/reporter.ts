import { Subject, fromEvent, map, merge } from 'rxjs'
import showErrorToast from './error'

const error$ = new Subject<Error>()

error$.subscribe((error) => showErrorToast({ message: error.message }))

const reporter = {
  error: (error: Error) => error$.next(error),
}

merge(fromEvent(window, 'error'), fromEvent(window, 'unhandledrejection'))
  .pipe(
    map((event: ErrorEvent) => {
      event.preventDefault()
      return event.error
    })
  )
  .subscribe(reporter.error)

export default reporter
