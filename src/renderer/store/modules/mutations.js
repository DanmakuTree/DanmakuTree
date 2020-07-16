export default {
  hiddenModal (state) {
    state.modalVisible = false
  },
  updateRoomList (state, data) {
    state.roomList = data
  },
  init (state) {
    state.initializing = false
  },
  deleteUserInfo (state) {
    state.isLogin = false
    state.userInfo = {}
  },
  setModuleList (state, data) {
    state.moduleList = data
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
