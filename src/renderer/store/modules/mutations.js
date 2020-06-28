export default {
  hiddenModal (state) {
    state.modalVisible = false
  },
  logout (state) {
    state.isLogin = false
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
