import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Bring in Next.js + TypeScript configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add your custom rule overrides
  {
    rules: {
      // Disable this rule globally
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;