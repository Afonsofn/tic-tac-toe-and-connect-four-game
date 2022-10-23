import { shallowMount } from '@vue/test-utils'
import Modal from '@/components/Modal/index.vue'

describe('Modal component tests', () => {
  it('closeModal test', async () => {
    const wrapper = await shallowMount(Modal)

    expect(wrapper.vm.$refs.contentModal.style.display).toBe('')

    await wrapper.vm.closeModal()

    expect(wrapper.vm.$refs.contentModal.style.display).toBe('none')
  })

  describe('Props tests', () => {
    it('If props are empty', async () => {
      const wrapper = await shallowMount(Modal)
  
      expect(wrapper.find('h2').text()).toEqual('We had a draw')
      expect(wrapper.find('p').exists()).toBe(false)
      expect(wrapper.find('button').text()).toEqual('Next Match')
    })

    it('If Player 1 win the game', async () => {
      const wrapper = await shallowMount(Modal, {
        propsData: {
          gameWinner: 'P1'
        }
      })
  
      expect(wrapper.find('h2').text()).toEqual('Congratulations :D')
      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.find('p').text()).toEqual('Player 1 won the Game')
      expect(wrapper.find('button').text()).toEqual('Next Game')
    })

    it('If Player 2 win the match', async () => {
      const wrapper = await shallowMount(Modal, {
        propsData: {
          matchWinner: 'P2'
        }
      })

      expect(wrapper.find('h2').text()).toEqual('Congratulations :D')
      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.find('p').text()).toEqual('Player 2 won the Match')
      expect(wrapper.find('button').text()).toEqual('Next Match')
    })
  })
})
