
import os from 'os'
import { execSync } from 'child_process'

export const platform = os.platform()

export const isWin = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'

// nodejs 是否已安装
export let isNodeInstalled
// node 版本号
export let nodeVersion
// git 是否安装
export let isGitInstalled
// atom 是否安装
export let isAtomInstalled
// vs code 是否安装
export let isVSCodeInstalled
// webstorm 是否安装
export let isWebstromInstalled

function execResult (command) {
  return execSync(command).toString().trim()
}

function isInstalled (command, regex) {
  return regex.test(execResult(command))
}

try {
  const v = execResult('node -v')
  isNodeInstalled = /^v?\d{1,2}.\d{1,2}.\d{1,2}$/.test(v)
  if (isNodeInstalled) {
    nodeVersion = v
  }
  isGitInstalled = isInstalled('git --version', /^git version \d{1,2}.\d{1,2}.\d{1,2}/)
  isAtomInstalled = isInstalled('atom -v', /^Atom[ \r]+: \d{1,2}.\d{1,2}.\d{1,2}/)
  isVSCodeInstalled = isInstalled('code -v', /^\d{1,2}.\d{1,2}.\d{1,2}/)
} catch (e) {}
