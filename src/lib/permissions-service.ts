declare var browser: any

export const queryPermission = async (permission: any) => {
  const granted = await browser.permissions.contains({ permissions: [permission] })

  if (browser.runtime.lastError) {
    throw new Error(browser.runtime.lastError)
  }

  return granted
}

export const requestPermission = async (permission: any) => {
  const granted = await browser.permissions.request({ permissions: [permission] })

  if (browser.runtime.lastError) {
    throw new Error(browser.runtime.lastError)
  }

  return granted
}
