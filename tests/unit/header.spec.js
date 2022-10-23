import { shallowMount } from '@vue/test-utils'
import Header from '@/components/Header/index.vue'

describe('Header component tests', () => {
  const classList = {
    add: jest.fn(),
    remove: jest.fn()
  };

  jest.spyOn(document, 'querySelector').mockImplementation(() => ({ classList }));

  jest.spyOn(window, "window", "get").mockImplementation(() => {
    return {
      scrollY: 0,
      addEventListener: (_event, func) => {
        func()
      }
    }
  });

  it('addTransparencyToHeader test', async () => {
    await shallowMount(Header)

    expect(classList.remove).toHaveBeenCalled()
    expect(classList.add).not.toHaveBeenCalled()
  })
})
