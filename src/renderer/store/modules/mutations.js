export default {
  hiddenModal (state) {
    state.modalVisible = false
  },
  setUserInfo (state, data) {
    state.userInfo = data
  },
  showModal (state, modalType) {
    state.modalType = modalType
    state.modalVisible = true
  }
}
