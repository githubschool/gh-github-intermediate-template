import { animFramePolyfill } from './animframe_polyfill.js'
import { GameManager } from './game_manager.js'

window.requestAnimationFrame(function () {
  animFramePolyfill()

  // Initialize the game
  new GameManager(4)
})
