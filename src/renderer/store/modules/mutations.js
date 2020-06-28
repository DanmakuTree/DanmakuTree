export default {
  hiddenModal (state) {
    state.modalVisible = false
  },
  init (state) {
    state.initializing = false
  },
  deleteUserInfo (state) {
    state.isLogin = false
    state.userInfo = {}
  },
  setUserInfo (state, data) {
    state.isLogin = true
    state.userInfo = data
  },
  showModal (state, modalType) {
    state.modalType = modalType
    state.modalVisible = true
  }
}
