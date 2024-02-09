// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  // ...UnoCSS options
  presets: [presetAttributify(), presetUno({ dark: "media" })],
  transformers: [transformerDirectives()],
});
