import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

import pluginJavascript from '@eslint/js'
import pluginStylistic from '@stylistic/eslint-plugin'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import { createNodeResolver, flatConfigs as pluginImportConfigs } from 'eslint-plugin-import-x'
import { configs as pluginTypescriptConfigs } from 'typescript-eslint'

// Javascript Plugin

const rulesPluginJavascript = normalizeRules(null, {
  'no-useless-rename': 'on',
  'object-shorthand': 'on',
  'prefer-template': 'on',
  'no-useless-concat': 'on',
  eqeqeq: 'smart',
})

const configPluginJavascript = defineConfig(
  pluginJavascript.configs.recommended,
  { rules: rulesPluginJavascript },
)

// Import Plugin

const rulesPluginImport = normalizeRules('import-x', {
  'consistent-type-specifier-style': 'on',
  'no-useless-path-segments': 'on',
  'no-absolute-path': 'on',
  'no-cycle': 'on',
  'no-nodejs-modules': 'on',
})

const resolversPluginImport = [
  createTypeScriptImportResolver(),
  createNodeResolver(),
]

const configPluginImport = defineConfig(
  { settings: { 'import-x/resolver-next': resolversPluginImport } },
  pluginImportConfigs.recommended,
  pluginImportConfigs.typescript,
  { rules: rulesPluginImport },
)

// Stylistic Plugin

const rulesPluginStylistic = normalizeRules('@stylistic', {
  quotes: 'single',
  'linebreak-style': 'unix',
  'no-extra-parens': 'all',
  'no-extra-semi': 'on',
  'padded-blocks': 'off',
})

const configPluginStylistic = defineConfig(
  pluginStylistic.configs.customize({
    quotes: 'single',
    indent: 2,
    semi: false,
    arrowParens: true,
    quoteProps: 'as-needed',
    braceStyle: '1tbs',
    commaDangle: 'always-multiline',
    blockSpacing: true,
    jsx: false,
  }),
  { rules: rulesPluginStylistic },
)

// TypescriptPlugin

const rulesPluginTypescript = normalizeRules('@typescript-eslint', {
  'array-type': { default: 'array-simple', readonly: 'array-simple' },
  'restrict-template-expressions': 'off',
})

const configPluginTypescript = defineConfig(
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } } },
  ...pluginTypescriptConfigs.strictTypeChecked,
  ...pluginTypescriptConfigs.stylisticTypeChecked,
  { rules: rulesPluginTypescript },
)

const configDisableJavascriptTypeCheck = {
  ...pluginTypescriptConfigs.disableTypeChecked,
  files: ['**/*.{js,mjs,cjs}'],
}

// Config

export default defineConfig(
  globalIgnores(['dist', 'coverage']),
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  configPluginJavascript,
  configPluginImport,
  configPluginStylistic,
  configPluginTypescript,
  configDisableJavascriptTypeCheck,
)

// Helpers

function normalizeRules(pluginName, rules) {
  const normalizeObjectEntry = createObjectEntryNormalizer(pluginName)
  const entries = Object.entries(rules)
  const entriesNormalized = entries.map(normalizeObjectEntry)
  return Object.fromEntries(entriesNormalized)
}

function createObjectEntryNormalizer(pluginName) {
  if (!pluginName) return ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)]
  const normalizeRuleName = createRuleNameNormalizer(pluginName)
  return ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)]
}

function createRuleNameNormalizer(pluginName) {
  const pluginPrefix = `${pluginName}/`
  return (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName
    return `${pluginPrefix}${ruleName}`
  }
}

function normalizeRuleEntry(value) {
  if (value === true || value === 'on') return 'error'
  if (value === false) return 'off'

  if (Array.isArray(value)) {
    if (isSeverity(value[0])) return value
    return ['error', ...value]
  }

  if (isSeverity(value)) return value

  return ['error', value]
}

function isSeverity(value) {
  return ['error', 'off', 'warn'].includes(value)
}
