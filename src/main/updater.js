import { autoUpdater } from 'electron-updater'
import { showNotification } from './notification'

let forceUpdate = false

// 自定义检测更新事件
autoUpdater
  .on('error', err => {
    showNotification(err ? (err.stack || err) : 'unknown', '检查更新失败')
  })
  .on('update-available', UpdateInfo => {
    showNotification(`检测到最新版本${UpdateInfo.version}，系统将自动下载并更新`)
    autoUpdater.downloadUpdate()
  })
  .on('update-not-available', () => {
    forceUpdate && showNotification('当前已是最新版，无需更新')
  })
  .on('update-downloaded', () => {
    showNotification('应用已完成更新，下次启动将加载最新版本')
  })

// 检查更新
export function checkUpdate (force = false) {
  forceUpdate = force
  autoUpdater.checkForUpdates()
}
