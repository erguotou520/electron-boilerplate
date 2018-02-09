import { Menu, Tray, nativeImage } from 'electron'
import { appConfig$ } from './data'
import * as handler from './tray-handler'
import { checkUpdate } from './updater'
import { isMac, isWin } from '../shared/env'
import { disabledTray, enabledTray, enabledHighlightTray, pacTray, pacHighlightTray, globalTray, globalHighlightTray } from '../shared/icon'

let tray

/**
 * 根据应用配置生成菜单
 * @param {Object} appConfig 应用配置
 */
function generateMenus (appConfig) {
  const base = [
    { label: '帮助', submenu: [
      { label: '检查更新', click: () => checkUpdate(true) },
      { label: '查看日志', click: handler.openLog },
      { label: '项目主页', click: () => { handler.openURL('https://github.com/erguotou520/electron-vue-frame') } },
      { label: 'Bug反馈', click: () => { handler.openURL('https://github.com/erguotou520/electron-vue-frame/issues') } },
      { label: '捐赠', click: () => { handler.openURL('https://github.com/erguotou520/donate') } },
      { label: '打开开发者工具', click: handler.openDevtool }
    ] },
    { label: '退出', click: handler.exitApp }
  ]
  return base
}

// 根据配置显示tray tooltip
function getTooltip (appConfig) {
  return `应用已${appConfig.enable ? '启用' : '禁用'}`
}

/**
 * 更新任务栏菜单
 * @param {Object} appConfig 应用配置
 */
function updateTray (appConfig) {
  const menus = generateMenus(appConfig)
  const contextMenu = Menu.buildFromTemplate(menus)
  tray.setContextMenu(contextMenu)
  tray.setToolTip(getTooltip(appConfig))
}

// 根据应用状态显示不同的图标
function setTrayIcon (appConfig) {
  if (appConfig.enable) {
    if (appConfig.sysProxyMode === 1) {
      tray.setImage(pacTray)
      isMac && tray.setPressedImage(pacHighlightTray)
    } else if (appConfig.sysProxyMode === 2) {
      tray.setImage(globalTray)
      isMac && tray.setPressedImage(globalHighlightTray)
    } else {
      tray.setImage(enabledTray)
      isMac && tray.setPressedImage(enabledHighlightTray)
    }
  } else {
    tray.setImage(disabledTray)
    isMac && tray.setPressedImage(disabledTray)
  }
}

/**
 * 渲染托盘图标和托盘菜单
 */
export default function renderTray (appConfig) {
  // 生成tray
  tray = new Tray(nativeImage.createEmpty())
  updateTray(appConfig)
  setTrayIcon(appConfig)
  tray.on((isMac || isWin) ? 'double-click' : 'click', handler.showMainWindow)
}

/**
 * 销毁托盘
 */
export function destroyTray () {
  if (tray) {
    tray.destroy()
  }
}

// 监听数据变更
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (!changed.length) {
    renderTray(appConfig)
  } else {
    //
  }
})
