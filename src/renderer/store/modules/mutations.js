export default {
  hiddenModal (state) {
    state.isLogin = false
    state.modalVisible = false
  },
  showDefaultModal (state, data) {
    state.isLogin = false
    state.modalVisible = true
  },
  showLoginModal (state, data) {
    state.isLogin = true
    state.modalVisible = true
  }
}
