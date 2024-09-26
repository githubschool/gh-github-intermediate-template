import { animFramePolyfill } from './animframe_polyfill.js'
import { GameManager } from './game_manager.js'

window.requestAnimationFrame(function () {
  window.localStorage.clear()

  animFramePolyfill()

  // Initialize the game
  new GameManager(4)
})
