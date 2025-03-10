import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.config({
        ignorePatterns: ['node_modules', 'public', '.next', '.vercel', 'dist'],
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            },
        },
        extends: [
            'next/core-web-vitals',
            'plugin:react/recommended',
            'plugin:react-hooks/recommended',
            'plugin:jsx-a11y/recommended',
            'plugin:import/recommended',
            'plugin:@next/next/recommended',
            'prettier',
        ],
        plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', 'prettier'],
        rules: {
            semi: ['error', 'always'],
            indent: ['error', 4],
            quotes: ['error', 'single'],
            'brace-style': ['error', '1tbs'],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': ['error', { before: false, after: true }],
            'keyword-spacing': ['error', { before: true, after: true }],
            'space-before-blocks': ['error', 'always'],
            'space-before-function-paren': ['error', 'always'],
            'space-infix-ops': 'error',
            'arrow-spacing': 'error',
            'no-trailing-spaces': 'error',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'no-mixed-spaces-and-tabs': 'error',
            'no-tabs': 'error',
            'eol-last': ['error', 'always'],
            'max-len': ['error', { code: 120, ignoreComments: true, ignoreStrings: true }],
            'function-paren-newline': ['error', 'multiline'],
            'object-curly-newline': ['error', { multiline: true, consistent: true }],
            'array-bracket-newline': ['error', { multiline: true }],
            'react/react-in-jsx-scope': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react/prop-types': 'off',
            'jsx-a11y/no-static-element-interactions': 'off',
            '@next/next/no-img-element': 'off',
            'jsx-a11y/click-events-have-key-events': 'off',
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            'react/jsx-first-prop-new-line': ['error', 'multiline'],
            'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
            'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
            'react/jsx-tag-spacing': [
                'error',
                {
                    closingSlash: 'never',
                    beforeSelfClosing: 'always',
                    afterOpening: 'never',
                    beforeClosing: 'never',
                },
            ],
            'import/no-named-as-default-member': 'off',
            indent: 'off',
            'eol-last': 'off',
            'react/no-unescaped-entities': 'off',
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/newline-after-import': ['error', { count: 1 }],
        },
        settings: {
            react: {
                version: 'detect',
            },
            next: {
                rootDir: 'src',
            },
            rootDir: ['.'],
            'import/resolver': {
                alias: {
                    map: [['@', './src']],
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
    }),
];

export default eslintConfig;
