import OptionsSync from 'webext-options-sync'
import { makeApiRequest, getNotifications, getTabUrl } from './api'
import { getNotificationReasonText } from './defaults'
import { openTab } from './tabs-service'
import localStore from './local-store'

const syncStore = new OptionsSync()

declare var browser: any

export const closeNotification = async (notificationId: any) => {
  return browser.notifications.clear(notificationId)
}

export const openNotification = async (notificationId: any) => {
  const url = await localStore.get(notificationId)

  await closeNotification(notificationId)

  if (url) {
    try {
      const { json } = await makeApiRequest(new URL(url).pathname)
      const targetUrl = json.message === 'Not Found' ? await getTabUrl() : json.html_url
      return openTab(targetUrl)
    } catch (_) {
      return openTab(await getTabUrl())
    }
  }

  return false
}

export const removeNotification = async (notificationId: any) => localStore.remove(notificationId)

export const getNotificationObject = (notificationInfo: any) => {
  return {
    title: notificationInfo.subject.title,
    iconUrl: 'icon-notif.png',
    type: 'basic',
    message: notificationInfo.repository.full_name,
    contextMessage: getNotificationReasonText(notificationInfo.reason)
  }
}

export const filterNotificationsByDate = (notifications: any[], lastModified?: string) => {
  if (!lastModified) {
    return notifications
  }
  const lastModifedTime = new Date(lastModified).getTime()
  return notifications.filter(n => new Date(n.updated_at).getTime() > lastModifedTime)
}

export const showNotifications = (notifications: any[] = [], lastModified?: string) => {
  for (const notification of filterNotificationsByDate(notifications, lastModified)) {
    const notificationId = `github-notifier-${notification.id}`
    const notificationObject = getNotificationObject(notification)
    browser.notifications.create(notificationId, notificationObject)
    localStore.set(notificationId, notification.subject.url)
  }
}

export const playNotification = async (notifications: any[] = [], lastModified?: string) => {
  if (filterNotificationsByDate(notifications, lastModified).length > 0) {
    const audio = new Audio()
    audio.src = await browser.extension.getURL('/sounds/bell.ogg')
    audio.play()

    return true
  }

  return false
}

export const checkNotifications = async (lastModified?: string) => {
  const notifications = await getNotifications(100) || []
  const { showDesktopNotif, playNotifSound } = await syncStore.getAll()

  if (showDesktopNotif) {
    await showNotifications(notifications, lastModified)
  }

  if (playNotifSound) {
    await playNotification(notifications, lastModified)
  }
}
