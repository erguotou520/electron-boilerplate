import { app, shell } from 'electron'
import bootstrapPromise, { logPath, appConfigPath } from './bootstrap'
import { showWindow } from './window'
export { openDevtool } from './window'
// 打开配置文件
export async function openConfigFile () {
  await bootstrapPromise
  shell.openItem(appConfigPath)
}

// 打开日志文件
export async function openLog () {
  await bootstrapPromise
  shell.openItem(logPath)
}

// 打开订阅管理页面
// export function showSubscribes () {
//   showWindow()
//   sendData(events.EVENT_APP_SHOW_PAGE, { page: 'Options', tab: 'subscribes' })
// }

// 打开窗口
export function showMainWindow () {
  showWindow()
}

// 打开指定的url
export function openURL (url) {
  return shell.openExternal(url)
}

// 退出
export function exitApp () {
  app.quit()
}
