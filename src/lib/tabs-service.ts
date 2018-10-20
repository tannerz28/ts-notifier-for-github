import OptionsSync from 'webext-options-sync'
import { queryPermission, requestPermission } from './permissions-service'

const syncStore = new OptionsSync()

declare var browser: any

export const createTab = async (url: string) => {
  if (browser.runtime.lastError) {
    throw new Error(browser.runtime.lastError)
  }

  return browser.tabs.create({ url })
}

export const updateTab = async (tabId: any, options: any) => {
  if (browser.runtime.lastError) {
    throw new Error(browser.runtime.lastError)
  }

  return browser.tabs.update(tabId, options)
}

export const queryTabs = async (url: string) => {
  if (browser.runtime.lastError) {
    throw new Error(browser.runtime.lastError)
  }

  const currentWindow = true
  return browser.tabs.query({ currentWindow, url })
}

export const openTab = async (url: string, tab?: {url: string, href: string}) => {
  const { newTabAlways } = await syncStore.getAll()
  if (!newTabAlways) {
    const alreadyGranted = await queryPermission('tabs')
    if (!alreadyGranted) {
      const granted = await requestPermission('tabs')
      if (!granted) {
        return
      }
    }

    const tabs = await queryTabs(url)

    if (tabs && tabs.length > 0) {
      return updateTab(tabs[0].id, { url, active: true })
    }

    if (tab && (tab.url === 'chrome://newtab/' || tab.href === 'about:home')) {
      return updateTab(null, { url, active: false })
    }
  }

  return createTab(url)
}
