import { shallowMount } from '@vue/test-utils'
import Statistics from '@/components/Statistics/index.vue'
import store from '@/store/index.js'

describe('Statistics component tests', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = await shallowMount(Statistics, {
      global: {
        plugins: [store]
      }
    })
  })

  it('formatedTotalTimer test', async () => {
    expect(wrapper.find('.timer').text()).toEqual('00:00:00')

    await wrapper.vm.$store.commit('totalHoursAdd', 1)
    await wrapper.vm.$store.commit('totalMinutesAdd', 36)
    await wrapper.vm.$store.commit('totalSecondsAdd', 12)

    expect(wrapper.find('.timer').text()).toEqual('01:36:12')
  })

  it('percentageOfPlayerOneWins test', async () => {
    expect(wrapper.find('.circle.player-1-win').text()).toEqual('0%')
    expect(wrapper.find('.circle.player-1-lose').text()).toEqual('0%')

    await wrapper.vm.$store.commit('playerOneGameWinsAdd')
    await wrapper.vm.$store.commit('playerTwoGameWinsAdd')
    await wrapper.vm.$store.commit('playerOneGameWinsAdd')

    expect(wrapper.find('.circle.player-1-win').text()).toEqual('67%')
    expect(wrapper.find('.circle.player-1-lose').text()).toEqual('33%')
  })

  it('percentageOfPlayerTwoWins test', async () => {
    expect(wrapper.find('.circle.player-2-win').text()).toEqual('33%')
    expect(wrapper.find('.circle.player-2-lose').text()).toEqual('67%')

    await wrapper.vm.$store.commit('playerTwoGameWinsAdd')
    await wrapper.vm.$store.commit('playerOneGameWinsAdd')
    await wrapper.vm.$store.commit('playerTwoGameWinsAdd')

    expect(wrapper.find('.circle.player-2-win').text()).toEqual('50%')
    expect(wrapper.find('.circle.player-2-lose').text()).toEqual('50%')
  })

  it('gameHistory test', async () => {
    expect(wrapper.vm.gameHistory.length).toEqual(10)
    expect(wrapper.vm.gameHistory.filter(res => res !== undefined)).toEqual([])

    await wrapper.vm.$store.commit('gameHistoryAdd', 'P1')

    expect(wrapper.vm.gameHistory.filter(res => res !== undefined)).toEqual(['P1'])

    await wrapper.vm.$store.commit('gameHistoryAdd', 'P2')
    await wrapper.vm.$store.commit('gameHistoryAdd', 'P1')

    expect(wrapper.vm.gameHistory.filter(res => res !== undefined)).toEqual(['P1', 'P2', 'P1'])
  })

  it('playedMatchs test', async () => {
    expect(wrapper.vm.playedMatchs.length).toEqual(10)
    expect(wrapper.vm.playedMatchs.filter(res => res !== undefined)).toEqual([])

    await wrapper.vm.$store.commit('numOfMatchesTotalAdd', 'P1')

    expect(wrapper.vm.playedMatchs.filter(res => res !== undefined)).toEqual(['P1'])
  })
})
