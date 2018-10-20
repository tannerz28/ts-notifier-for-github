export const defaults = {
  rootUrl: 'https://api.github.com/',
  oauthToken: '',
  useParticipatingCount: false,
  interval: 60,
  title: 'Notifier for GitHub'
}

export const notificationReasons: {[key: string]: string} = {
  subscribed: 'You are watching the repository',
  manual: 'You are subscribed to this thread',
  author: 'You created this thread',
  comment: 'New comment',
  mention: 'You were mentioned',
  team_mention: 'Your team was mentioned',
  state_change: 'Thread status changed',
  assign: 'You were assigned to the issue'
}

export const errorTitles: {[key: string]: string} = {
  missing_token: 'Missing access token, please create one and enter it in Options',
  server_error: 'You have to be connected to the Internet',
  data_format_error: 'Unable to find count',
  parse_error: 'Unable to handle server response',
  default: 'Unknown error'
}

export const errorSymbols: {[key: string]: string} = {
  missing_token: 'X',
  default: '?'
}

export const warningTitles: {[key: string]: string} = {
  default: 'Unknown warning',
  offline: 'No Internet connnection'
}

export const warningSymbols: {[key: string]: string} = {
  default: 'warn',
  offline: 'off'
}

export const colors: {[key: string]: [number, number, number, number]} = {
  default: [65, 131, 196, 255],
  error: [166, 41, 41, 255],
  warning: [245, 159, 0, 255]
}

export const getBadgeDefaultColor = () => {
  return colors.default
}

export const getBadgeErrorColor = () => {
  return colors.error
}

export const getBadgeWarningColor = () => {
  return colors.warning
}

export const getWarningTitle = (warning: string) => {
  return warningTitles[warning] || warningTitles.default
}

export const getWarningSymbol = (warning: string) => {
  return warningSymbols[warning] || warningSymbols.default
}

export const getErrorTitle = (error: Error) => {
  return errorTitles[error.message] || errorTitles.default
}

export const getErrorSymbol = (error: Error) => {
  return errorSymbols[error.message] || errorSymbols.default
}

export const getNotificationReasonText = (reason: string) => {
  return notificationReasons[reason] || ''
}

export const defaultTitle = defaults.title
