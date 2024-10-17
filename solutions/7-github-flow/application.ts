import { animFramePolyfill } from './animframe_polyfill.js'
import { GameManager } from './game_manager.js'

window.requestAnimationFrame(function () {
  animFramePolyfill()

  // Lab 6: Grid Size
  new GameManager(5)
})
