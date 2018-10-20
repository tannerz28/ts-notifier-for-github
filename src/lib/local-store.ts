declare var browser: any

export default {
  async get (key: string) {
    const result = await browser.storage.local.get(key)
    return result[key]
  },

  async set (key: string, value: any) {
    return browser.storage.local.set({ [key]: value })
  },

  async remove (key: string) {
    return browser.storage.local.remove(key)
  },

  async clear () {
    return browser.storage.local.clear()
  }
}
