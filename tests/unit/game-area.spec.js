import { mount } from '@vue/test-utils'
import GameArea from '@/components/GameArea/index.vue'
import store from '@/store/index.js'

describe('GameArea component tests', () => {
  describe('Methods tests', () => {
    let wrapper;
  
    beforeEach(async () => {
      wrapper = await mount(GameArea, {
        global: {
          plugins: [store]
        },
      })
    })

    it('gameResult test', async () => {
      const changeColorOfWinnerSpy = jest.spyOn(wrapper.vm, 'changeColorOfWinner')
      const pauseTimerSpy = jest.spyOn(wrapper.vm, 'pauseTimer')
      const numOfMatchesTotalAddSpy = jest.spyOn(wrapper.vm, 'numOfMatchesTotalAdd')
      const openModalSpy = jest.spyOn(wrapper.vm, 'openModal')
      
      // Game not started
      let response = await wrapper.vm.gameResult([['', '', ''], ['', '', ''], ['', '', '']].flat())

      expect(response).toBeNull()
      expect(changeColorOfWinnerSpy).not.toHaveBeenCalled()
      expect(pauseTimerSpy).not.toHaveBeenCalled()
      expect(numOfMatchesTotalAddSpy).not.toHaveBeenCalled()
      expect(wrapper.vm.playerOneMatchWins).toBe(0)
      expect(wrapper.vm.playerTwoMatchWins).toBe(0)
      expect(wrapper.vm.numOfMatches).toBe(0)
      
      // Player one wins
      response = await wrapper.vm.gameResult([['P1', 'P1', 'P1'], ['P2', 'P2', ''], ['', '', '']].flat())
      
      expect(response).toBe('P1')
      expect(wrapper.vm.playerOneMatchWins).toBe(1)
      expect(wrapper.vm.playerTwoMatchWins).toBe(0)
      expect(wrapper.vm.numOfMatches).toBe(1)
      expect(changeColorOfWinnerSpy).toHaveBeenCalled()
      expect(pauseTimerSpy).toHaveBeenCalled()
      expect(numOfMatchesTotalAddSpy).toHaveBeenCalled()
      expect(wrapper.vm.hadAMatchDraw).toBeFalsy()

      // Have a match draw
      response = await wrapper.vm.gameResult([['P1', 'P2', 'P1'], ['P1', 'P1', 'P2'], ['P2', 'P1', 'P2']].flat())
      
      expect(response).toBe(null)
      expect(wrapper.vm.numOfMatches).toBe(2)
      expect(openModalSpy).toHaveBeenCalled()
      expect(numOfMatchesTotalAddSpy).toHaveBeenCalledTimes(2)
      expect(pauseTimerSpy).toHaveBeenCalledTimes(2)
      expect(wrapper.vm.hadAMatchDraw).toBeTruthy()
    })

    it('chooseCell test', async () => {
      const startTimerSpy = jest.spyOn(wrapper.vm, 'startTimer')

      wrapper.vm.currentPlayer = 'P2'

      wrapper.setData({
        gameBoard: [['P1', '', ''], ['', '', ''], ['', '', '']],
      })
      
      // When click on a cell that is already filled, nothing should happen
      await wrapper.vm.chooseCell(0, 0)

      expect(wrapper.vm.gameBoard[0][0]).toBe('P1')
      expect(startTimerSpy).not.toHaveBeenCalled()
      expect(wrapper.vm.currentPlayer).toBe('P2')

      // When click on a cell that is not filled, the cell should be filled with the current player
      await wrapper.vm.chooseCell(0, 1)

      expect(wrapper.vm.gameBoard[0][1]).toBe('P2')
      expect(startTimerSpy).toHaveBeenCalled()
      expect(wrapper.vm.currentPlayer).toBe('P1')
    })

    it('restartMatch test', async () => {
      const closeModalSpy = jest.spyOn(wrapper.vm.$refs.contentModal, 'closeModal')

      await wrapper.vm.restartMatch()

      expect(closeModalSpy).toHaveBeenCalled()
      expect(wrapper.vm.gameBoard).toStrictEqual([['', '', ''], ['', '', ''], ['', '', '']])
      expect(wrapper.vm.hadAMatchDraw).toBeFalsy()
    })

    it('restartGame test', async () => {
      const restartMatchSpy = jest.spyOn(wrapper.vm, 'restartMatch')
      const clearTimerSpy = jest.spyOn(wrapper.vm, 'clearTimer')

      await wrapper.vm.restartGame()

      expect(restartMatchSpy).toHaveBeenCalled()
      expect(clearTimerSpy).toHaveBeenCalled()
      expect(wrapper.vm.gameWinner).toBe('')
      expect(wrapper.vm.hadAGameDraw).toBeFalsy()
      expect(wrapper.vm.numOfMatches).toBe(0)
      expect(wrapper.vm.playerOneMatchWins).toBe(0)
      expect(wrapper.vm.playerTwoMatchWins).toBe(0)
    })

    it('startTimer test', async () => {
      expect(wrapper.vm.timerOn).toBeFalsy()
      expect(wrapper.vm.seconds).toBe(0)
      expect(wrapper.vm.minutes).toBe(0)
      expect(wrapper.vm.hours).toBe(0)

      await wrapper.vm.startTimer()
      
      expect(wrapper.vm.timerOn).toBeTruthy()
    })

    it('pauseTimer test', async () => {
      await wrapper.vm.startTimer()

      expect(wrapper.vm.timerOn).toBeTruthy()

      await wrapper.vm.pauseTimer()

      expect(wrapper.vm.timer).not.toBeNull()
      expect(wrapper.vm.timerOn).toBeFalsy()
    })
    
    it('clearTimer test', async () => {
      let commitSpy = jest.spyOn(wrapper.vm.$store, "commit");

      await wrapper.vm.clearTimer()

      expect(commitSpy).toHaveBeenCalledTimes(3);
      expect(wrapper.vm.seconds).toBe(0)
      expect(wrapper.vm.minutes).toBe(0)
      expect(wrapper.vm.hours).toBe(0)
      expect(wrapper.vm.timer).toBeNull()
      expect(wrapper.vm.timerOn).toBeFalsy()
    })

    it('setFirstPlayerRamdomly test', async () => {
      await wrapper.vm.setFirstPlayerRamdomly()

      expect(wrapper.vm.currentPlayer === wrapper.vm.lastFirstPlayer).toBeTruthy()
      expect(wrapper.vm.currentPlayer === wrapper.vm.startPlayer).toBeTruthy()
    })

    it('setCellId test', async () => {
      let result = await wrapper.vm.setCellId(0,1)

      expect(result).toBe('cell-id-1')

      result = await wrapper.vm.setCellId(1,3)

      expect(result).toBe('cell-id-6')

      result = await wrapper.vm.setCellId(2,1)

      expect(result).toBe('cell-id-7')
    })

    it('openModal test', async () => {
      expect(wrapper.vm.$refs.contentModal.$el.style.display).toBe('')

      await wrapper.vm.openModal()

      expect(wrapper.vm.$refs.contentModal.$el.style.display).toBe('block')
    })
  })

  describe('Computed tests', () => {
    it('formatedTimer test', async () => {
      const wrapper = await mount(GameArea, {
        global: {
          plugins: [store]
        },
      })

      expect(wrapper.find('.timer').text()).toEqual('00:00:00')
  
      await wrapper.setData({
        hours: 1,
        minutes: 36,
        seconds: 12,
      })
  
      expect(wrapper.find('.timer').text()).toEqual('01:36:12')
    })
  })
})
