import pluginJs from '@eslint/js';
import pluginStylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs } from 'typescript-eslint';

const javascriptPluginConfig = config(
  pluginJs.configs.recommended,
  normalizeRulesConfig({
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'no-useless-concat': 'error',
    eqeqeq: 'smart',
  }),
);

const stylisticPluginConfig = config(
  pluginStylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    arrowParens: true,
    quoteProps: 'as-needed',
    braceStyle: '1tbs',
  }),
  normalizeRulesConfig('@stylistic', {
    'linebreak-style': 'windows',
    'padded-blocks': 'off',
  }),
);

const typescriptPluginConfig = config(
  ...configs.recommended,
  normalizeRulesConfig('@typescript-eslint', {
    'array-type': { default: 'array-simple', readonly: 'array-simple' },
  }),
);

export default config(
  { ignores: ['dist', 'coverage'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  javascriptPluginConfig,
  stylisticPluginConfig,
  typescriptPluginConfig,
);

function normalizeRulesConfig(pluginName, rules) {
  if (!rules && pluginName) return normalizeRulesConfig(null, pluginName);
  const normalizeEntry = createEntryNormalizer(pluginName);
  const entries = Object.entries(rules).map(normalizeEntry);
  const rulesNormalized = Object.fromEntries(entries);
  return { rules: rulesNormalized };
}

function createEntryNormalizer(pluginName) {
  if (!pluginName) return ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)];
  const normalizeRuleName = createRuleNameNormalizer(pluginName);
  return ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)];
}

function createRuleNameNormalizer(pluginName) {
  const pluginPrefix = `${pluginName}/`;
  return (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
}

function normalizeRuleEntry(value) {
  if (Array.isArray(value)) return value;
  if (['error', 'off', 'warn'].includes(value)) return value;
  return ['error', value];
}
