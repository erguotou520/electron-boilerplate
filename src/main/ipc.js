import { ipcMain } from 'electron'
import { readJsonSync } from 'fs-extra'
import * as events from '../shared/events'
import { appConfigPath } from './bootstrap'
import { updateAppConfig } from './data'
import { hideWindow } from './window'
import defaultConfig, { mergeConfig } from '../shared/config'
import { showNotification } from './notification'
import logger from './logger'

/**
 * ipc-main事件
 */
ipcMain.on(events.EVENT_APP_ERROR_RENDER, e => {
  // 渲染进程报错
  logger.error(e)
}).on(events.EVENT_APP_HIDE_WINDOW, () => {
  // 隐藏窗口
  hideWindow()
}).on(events.EVENT_APP_WEB_INIT, e => {
  // 页面初始化
  let stored
  try {
    stored = readJsonSync(appConfigPath)
    mergeConfig(stored)
  } catch (e) {
    stored = defaultConfig
  }
  e.returnValue = {
    config: stored
  }
}).on(events.EVENT_RX_SYNC_RENDERER, (e, data) => {
  // 同步数据
  if (process.env.NODE_ENV === 'development') {
    console.log('received sync data: ', data)
  }
  updateAppConfig(data, true)
}).on(events.EVENT_APP_NOTIFY_RENDERER, (e, body, title) => {
  // 显示来自renderer进程的通知
  showNotification(body, title)
})
