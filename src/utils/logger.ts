import { Middleware } from 'redux';
import { createLogger } from 'redux-logger'

let logger: Middleware
if (process.env.NODE_ENV === 'development') {
  logger = createLogger({
    collapsed: true,
    logger: {
      ...console,
      groupCollapsed: (title: string, ...args) => {
        const [, , action] = title.split(' ');
        const duck = action.split('/')[0].split('%c')[1]
        const transformedTitle = title.replace(`${duck}/`, '')
        const Colors = ['0060F0', 'A736FF', '03905C', '009FD1', 'C6765C', '0E26A0']
        const tagNumber = [].map.call(duck || '', item => parseInt(item, 36) || 0).reduce((a, b) => a + b, 0)
        const tagColor = Colors[tagNumber % Colors.length]
        console.groupCollapsed(
          `%c${duck}${transformedTitle}`,
          `background:#${tagColor} ; padding: 1px 3px; border-radius: 3px;  color: #fff`,
          ...args,
        )
      },
    },
  })
} else {
  logger = () => next => action =>  next(action)
}

export default logger
