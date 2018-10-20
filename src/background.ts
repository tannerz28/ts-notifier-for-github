import OptionsSync from 'webext-options-sync'
import localStore from './lib/local-store'
import { openTab } from './lib/tabs-service'
import { queryPermission } from './lib/permissions-service'
import { getNotificationCount, getTabUrl } from './lib/api'
import { renderCount, renderError, renderWarning } from './lib/badge'
import { checkNotifications, openNotification, removeNotification } from './lib/notifications-service'

const syncStore = new OptionsSync()

declare var browser: any

new OptionsSync().define({
  defaults: {
    token: '',
    rootUrl: 'https://api.github.com/',
    playNotifSound: false,
    showDesktopNotif: false,
    onlyParticipating: false,
    newTabAlways: false
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ]
})

const scheduleAlarm = async (interval: number = 60) => {
  const intervalSetting = await localStore.get('interval') || 60

  if (intervalSetting !== interval) {
    localStore.set('interval', interval)
  }

	// Delay less than 1 minute will cause a warning
  const delayInMinutes = Math.max(Math.ceil(interval / 60), 1)

  browser.alarms.create({ delayInMinutes })
}

const handleLastModified = async (date: string | null) => {
  const lastModified = await localStore.get('lastModified') || new Date(0)

  if (date !== lastModified) {
    localStore.set('lastModified', date)
    const { showDesktopNotif, playNotifSound } = await syncStore.getAll()
    if (showDesktopNotif === true || playNotifSound === true) {
      checkNotifications(lastModified)
    }
  }
}

const handleNotificationsResponse = ({ count, interval, lastModified }: { count: number, interval: number, lastModified: string | null }) => {

  scheduleAlarm(interval)
  handleLastModified(lastModified)

  renderCount(count)
}

const handleError = (error: Error) => {
  scheduleAlarm()

  renderError(error)
}

const handleOfflineStatus = () => {
  renderWarning('offline')
}

async function update () {
  if (navigator.onLine) {
    try {
      handleNotificationsResponse(await getNotificationCount())
    } catch (error) {
      handleError(error)
    }
  } else {
    handleOfflineStatus()
  }
}

const handleBrowserActionClick = async () => {
  await openTab(await getTabUrl())
}

function handleInstalled ({ reason }: {reason: string}) {
  if (reason === 'install') {
    browser.runtime.openOptionsPage()
  }
}

function handleConnectionStatus ({ type }: {type: string}) {
  if (type === 'online') {
    update()
  } else if (type === 'offline') {
    handleOfflineStatus()
  }
}

window.addEventListener('online', handleConnectionStatus)
window.addEventListener('offline', handleConnectionStatus)

browser.alarms.create({ when: Date.now() + 2000 })
browser.alarms.onAlarm.addListener(update)
browser.runtime.onMessage.addListener((message: string) => {
  if (message === 'update') {
    update()
  }
})

async function addNotificationHandler () {
  if (await queryPermission('notifications')) {
    browser.notifications.onClicked.addListener((id: any) => {
      openNotification(id)
    })

    browser.notifications.onClosed.addListener((id: any) => {
      removeNotification(id)
    })
  }
}

addNotificationHandler()

browser.permissions.onAdded.addListener(addNotificationHandler)
browser.runtime.onInstalled.addListener(handleInstalled)
browser.browserAction.onClicked.addListener(handleBrowserActionClick)

update()
