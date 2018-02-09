import defaultConfig from '../../../shared/config'
import { merge, getUpdatedKeys } from '../../../shared/utils'
import { syncConfig } from '../../ipc'

const state = {
  appConfig: defaultConfig
}

const mutations = {
  // 更新应用配置
  updateConfig (state, targetConfig) {
    const changed = getUpdatedKeys(state.appConfig, targetConfig)
    if (changed.length) {
      const extractConfig = {}
      changed.forEach(key => { extractConfig[key] = targetConfig[key] })
      merge(state.appConfig, extractConfig)
      console.log('config updated: ', extractConfig)
    }
  }
}

const actions = {
  initConfig ({ commit }, { config, meta }) {
    commit('updateConfig', config)
  },
  updateConfig ({ getters, commit }, targetConfig) {
    commit('updateConfig', targetConfig)
    syncConfig(targetConfig)
  }
}

export default {
  state,
  mutations,
  actions
}
