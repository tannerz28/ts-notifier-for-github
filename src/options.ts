import OptionsSync from 'webext-options-sync'
import { queryPermission, requestPermission } from './lib/permissions-service'

const syncStore = new OptionsSync()
syncStore.syncForm('#options-form')

declare var browser: any

const update = async ({ name, checked }: {name: string, checked: boolean}) => {

  console.log(name, checked)

  if (name === 'showDesktopNotif' && checked) {
    try {
      const alreadyGranted = await queryPermission('notifications')

      if (!alreadyGranted) {
        const granted = await requestPermission('notifications')
        checked = granted
      }
    } catch (err) {
      checked = false

      const element = document.getElementById('notifications-permission-error')

      if (element) {
        element.style.display = 'block'
      }
    }
  }

  browser.runtime.sendMessage('update')
}

document.querySelectorAll('#options-form [name]').forEach(input => {
  input.addEventListener('change', (e) => {
    if (e.currentTarget) {
      update({
        checked: e.returnValue,
        name: input.nodeName
      })
    }
  })
})
