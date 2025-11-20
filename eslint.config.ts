import js from '@eslint/js'
import eslintPluginImportX from 'eslint-plugin-import-x'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const prep_globals = s => Object.fromEntries(s.split(' ').map(g => [g, 'readonly']))
const globals_all = {
    ...prep_globals('Sentry'),
}

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...svelte.configs['flat/recommended'],
    {
        ignores: [
            ...'node_modules,dist,dist-native,android,ios,public,.venv,misc,src/lib/components/ui'
                .split(',')
                .map(x => x + '/**/*'),
            '**/*.d.ts',
        ],
        rules: {
            'no-empty': ['error', {allowEmptyCatch: true}],
            'no-misleading-character-class': 'off',
            'no-unused-vars': ['error', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
            'svelte/prefer-svelte-reactivity': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            globals: {...globals.es2021, ...globals.browser, ...globals_all},
        },
    },
    {
        files: ['vite.config.js', 'build.js', '*.js'],
        languageOptions: {
            globals: {...globals.es2021, ...globals.node},
        },
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: {parser: tseslint.parser},
            globals: {...globals.es2021, ...globals.browser, ...globals_all},
        },
        rules: {
            'no-inner-declarations': 'off',
            'no-self-assign': 'off',
            'svelte/no-at-html-tags': 'off',
            'svelte/require-each-key': 'off',
            'svelte/valid-compile': ['error', {ignoreWarnings: true}],
        },
    },
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
            'import-x': eslintPluginImportX,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'import-x/first': 'error',
            'import-x/newline-after-import': 'error',
            'import-x/no-duplicates': 'error',
            'import-x/extensions': 'off',
        },
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {...globals.es2021, ...globals.browser, ...globals_all},
        },
    },
    {
        files: ['src/util/sw.js'],
        languageOptions: {
            globals: {...globals.es2021, ...globals.serviceworker},
        },
    },
]
