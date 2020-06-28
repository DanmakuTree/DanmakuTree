export default {
  async logout ({ commit, state }) {
    await window.API.Platform.BiliBili.API.logout()
    commit('deleteUserInfo')
  }
}
