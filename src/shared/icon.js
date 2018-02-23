import { join } from 'path'
import { nativeImage } from 'electron'
import { isMac } from './env'

function getImage (name, template = true, highlight = false) {
  return nativeImage.createFromPath(join(__static, `${name}${(isMac && template) ? (highlight ? 'Highlight' : 'Template') : ''}.png`))
}

export let notificationIcon
export let trayIcon

export function init () {
  notificationIcon = getImage('notification', false, false)
  trayIcon = getImage('tray')
}
