/**
 * A shared Prettier configuration for the repository.
 *
 * @type {import("prettier").Config}
 * */
export const prettierConfig = {
  semi: true,
  singleQuote: true,
  printWidth: 200,
  tabWidth: 2,
  useTabs: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  requirePragma: false,
  singleAttributePerLine: true,
  proseWrap: "always",
  endOfLine: "auto",
};