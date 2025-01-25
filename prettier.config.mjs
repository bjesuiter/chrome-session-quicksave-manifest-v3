// prettier.config.mjs

import * as prettierPluginTailwind from "prettier-plugin-tailwindcss";

export default {
  // prettierPluginTailwind auto-detects: tailwindConfig: './tailwind.config.js',
  plugins: [prettierPluginTailwind],
  // default: trailingComma: "es5",
  singleQuote: false,
  requirePragma: false,
  arrowParens: "always",
}
