import { createStore } from 'vuex'

export default createStore({
  state: {
    stats: {
      playerOneGameWins: 0,
      playerTwoGameWins: 0,
      numOfMatchesTotal: [],
      gameHistory: [],
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
    }
  },
  mutations: {
    playerOneGameWinsAdd(state) {
      state.stats.playerOneGameWins++
    },
    playerTwoGameWinsAdd(state) {
      state.stats.playerTwoGameWins++
    },
    gameHistoryAdd(state, payload) {
      state.stats.gameHistory.unshift(payload)
    },
    numOfMatchesTotalAdd(state, payload) {
      state.stats.numOfMatchesTotal.unshift(payload)
    },
    totalHoursAdd(state, payload) {
      state.stats.totalHours = payload
    },
    totalMinutesAdd(state, payload) {
      state.stats.totalMinutes = payload
    },
    totalSecondsAdd(state, payload) {
      state.stats.totalSeconds = payload
    }
  }
})
