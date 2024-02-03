// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [presetAttributify(), presetUno({ dark: 'media' })]
})
