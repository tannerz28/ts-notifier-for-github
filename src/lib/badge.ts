import * as defaults from './defaults'

declare var browser: any

const render = (text: string, color: [number, number, number, number], title: string): void => {
  browser.browserAction.setBadgeText({ text })
  browser.browserAction.setBadgeBackgroundColor({ color })
  browser.browserAction.setTitle({ title })
}

const getCountString = (count: number): string => {
  if (count === 0) {
    return ''
  }

  if (count > 9999) {
    return '∞'
  }

  return count.toString()
}

const getErrorData = (error: Error) => {
  const title = defaults.getErrorTitle(error)
  const symbol = defaults.getErrorSymbol(error)
  return { symbol, title }
}

export const renderCount = (count: number) => {
  const color = defaults.getBadgeDefaultColor()
  const title = defaults.defaultTitle
  render(getCountString(count), color, title)
}

export const renderError = (error: Error) => {
  const color = defaults.getBadgeErrorColor()
  const { symbol, title } = getErrorData(error)
  render(symbol, color, title)
}

export const renderWarning = (warning: string) => {
  const color = defaults.getBadgeWarningColor()
  const title = defaults.getWarningTitle(warning)
  const symbol = defaults.getWarningSymbol(warning)
  render(symbol, color, title)
}
