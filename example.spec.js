import { shallowMount } from '@vue/test-utils'
import Footer from '@/components/Footer/index.vue'

describe('Footer component tests', () => {
  it('Footer be defined', () => {
    const wrapper = shallowMount(Footer)

    expect(wrapper).toBeDefined()
  })
})
