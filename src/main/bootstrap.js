import path from 'path'
import { app, dialog } from 'electron'
import { ensureDir, pathExists, ensureFile, outputJson } from 'fs-extra'
import logger, { clearLog } from './logger'
import defaultConfig from '../shared/config'
import { isLinux, isNodeInstalled } from '../shared/env'
import { init as initIcon } from '../shared/icon'

// app ready事件
export const readyPromise = new Promise(resolve => {
  if (app.isReady()) {
    resolve()
  } else {
    app.once('ready', resolve)
  }
})

// 检查nodejs是否安装
if (!isNodeInstalled) {
  dialog.showErrorBox('错误', 'nodejs未安装，请先安装nodejs以免后续功能无法使用')
  // nodejs未安装时自动下载并安装
  // require('./nodejs').init()
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// 应用配置存储目录
export const appConfigDir = app.getPath('userData')
// 应用配置存储路径
export const appConfigPath = path.join(appConfigDir, 'electron-vue-frame-config.json')
// 日志路径
export const logPath = path.join(appConfigDir, 'logs/electron-vue-frame.log')

// try fix linux tray dismiss bug
if (isLinux) {
  process.env.XDG_CURRENT_DESKTOP = 'Unity'
}

/**
 * 确保文件存在，目录正常
 */
async function init () {
  initIcon()
  await ensureDir(appConfigDir)
  // 判断配置文件是否存在，不存在用默认数据写入
  const configFileExists = await pathExists(appConfigPath)
  if (!configFileExists) {
    await outputJson(appConfigPath, defaultConfig, { spaces: '\t' })
  }
  await ensureDir(path.join(appConfigDir, 'logs'))
  await ensureFile(logPath)
  await clearLog()

  if (process.env.NODE_ENV === 'development') {
    console.log('Config file\'s path: %s\nLog file\'s path: %s', appConfigPath, logPath)
  } else {
    logger.info('file ensured')
  }
  return readyPromise
}

export default init()
