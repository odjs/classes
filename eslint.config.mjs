import pluginJavascript from '@eslint/js';
import pluginStylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as pluginTypescriptConfigs } from 'typescript-eslint';

const javascriptPluginConfig = config(
  pluginJavascript.configs.recommended,
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
    semi: true,
    arrowParens: true,
    quoteProps: 'as-needed',
    braceStyle: '1tbs',
  }),
  normalizeRulesConfig('@stylistic', {
    quotes: 'single',
    'linebreak-style': 'windows',
    'padded-blocks': 'off',
  }),
);

const typescriptPluginConfig = config(
  ...pluginTypescriptConfigs.recommended,
  normalizeRulesConfig('@typescript-eslint', {
    'array-type': { default: 'array-simple', readonly: 'array-simple' },
  }),
);

export default config(
  { ignores: ['dist', 'coverage'] },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  javascriptPluginConfig,
  stylisticPluginConfig,
  typescriptPluginConfig,
);

function normalizeRulesConfig(pluginName, rules) {
  if (!rules && pluginName) return normalizeRulesConfig(null, pluginName);
  const entries = Object.entries(rules);
  if (!entries.length) return {};
  const normalizeEntry = createEntryNormalizer(pluginName);
  const entriesNormalized = entries.map(normalizeEntry);
  const rulesNormalized = Object.fromEntries(entriesNormalized);
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
