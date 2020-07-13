import * as types from '../mutation-types'

const state = {
  id: 0,
  name: ''
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.UPDATE_USER_ID] (state, { id }) {
    state.id = id
  },
  [types.UPDATE_USER_NAME] (state, { name }) {
    state.name = name
  },
  [types.UPDATE_IMAGE_PATH] (state, { imagePath }) {
    state.imagePath = imagePath
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
