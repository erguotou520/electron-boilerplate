import { app } from 'electron'
import AutoLaunch from 'auto-launch'
import bootstrap from './bootstrap'
import { isQuiting, appConfig$ } from './data'
import { destroyTray } from './tray'
import { checkUpdate } from './updater'
import renderMenu from './menu'
import './ipc'
import { stop as stopCommand } from './client'
import { createWindow, showWindow, getWindow, destroyWindow } from './window'
import logger from './logger'

const isSecondInstance = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  const _window = getWindow()
  if (_window) {
    if (_window.isMinimized()) {
      _window.restore()
    }
    _window.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

bootstrap.then(() => {
  createWindow()

  if (process.env.NODE_ENV !== 'development') {
    checkUpdate()
  }

  // 开机自启动
  const AutoLauncher = new AutoLaunch({
    name: 'ShadowsocksR Client',
    isHidden: true,
    mac: {
      useLaunchAgent: true
    }
  })

  appConfig$.subscribe(data => {
    const [appConfig, changed] = data
    if (!changed.length) {
      // 初始化时没有配置则打开页面，有配置则不显示主页面
      if (!appConfig.configs.length || !appConfig.ssrPath) {
        showWindow()
      }
      renderMenu()
      // renderTray(appConfig)
    }
    if (!changed.length || changed.indexOf('autoLaunch') > -1) {
      // 初始化或者选项变更时
      AutoLauncher.isEnabled().then(enabled => {
        // 状态不相同时
        if (appConfig.autoLaunch !== enabled) {
          return AutoLauncher[appConfig.autoLaunch ? 'enable' : 'disable']().catch(() => {
            logger.error(`${appConfig.autoLaunch ? '执行' : '取消'}开机自启动失败`)
          })
        }
      }).catch(() => {
        logger.error('获取开机自启状态失败')
      })
    }
  })
})

app.on('window-all-closed', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('window-all-closed')
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 由main进程发起的退出
app.on('before-quit', () => { isQuiting(true) })

app.on('will-quit', e => {
  if (process.env.NODE_ENV === 'development') {
    console.log('will-quit')
  }
  e.preventDefault()
  stopCommand().then(() => {
    destroyWindow()
    destroyTray()
    app.exit(0)
  })
})

app.on('activate', () => {
  if (getWindow() === null) {
    createWindow()
  }
})
