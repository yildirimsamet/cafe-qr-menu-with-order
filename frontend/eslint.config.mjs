import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.config({
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
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
        plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
        rules: {
            // Temel formatlama kuralları
            'semi': ['error', 'always'], // Noktalı virgül kullanımı
            'indent': ['error', 4], // Girinti için 4 boşluk
            'quotes': ['error', 'single'], // Tek tırnak kullanımı
            'brace-style': ['error', '1tbs'], // Süslü parantezlerin aynı satırda başlaması
            'comma-dangle': ['error', 'always-multiline'], // Çok satırlı dizilerde son elemandan sonra virgül
            'comma-spacing': ['error', { 'before': false, 'after': true }], // Virgül sonrası boşluk
            'keyword-spacing': ['error', { 'before': true, 'after': true }], // Anahtar kelimelerden sonra boşluk
            'space-before-blocks': ['error', 'always'], // Bloklardan önce boşluk
            'space-before-function-paren': ['error', 'always'], // Fonksiyon parantezlerinden önce boşluk
            'space-infix-ops': 'error', // Operatörlerin etrafında boşluk
            'arrow-spacing': 'error', // Ok fonksiyonlarında boşluk
            'no-trailing-spaces': 'error', // Satır sonunda boşluk bırakma
            'no-multiple-empty-lines': ['error', { 'max': 1 }], // Birden fazla boş satır bırakma
            'no-mixed-spaces-and-tabs': 'error', // Boşluk ve tab karışımı
            'no-tabs': 'error', // Tab kullanımını yasakla
            'eol-last': ['error', 'always'], // Dosya sonunda boş satır bırak

            // Satır uzunluğu ve okunabilirlik
            'max-len': ['error', { 'code': 120, 'ignoreComments': true, 'ignoreStrings': true }], // Satır uzunluğu sınırı
            'function-paren-newline': ['error', 'multiline'], // Çok satırlı fonksiyonlarda parantezleri yeni satıra al
            'object-curly-newline': ['error', { 'multiline': true, 'consistent': true }], // Çok satırlı objelerde süslü parantezleri yeni satıra al
            'array-bracket-newline': ['error', { 'multiline': true }], // Çok satırlı dizilerde köşeli parantezleri yeni satıra al

            // React ve JSX kuralları
            'react/react-in-jsx-scope': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react/prop-types': 'off',
            'jsx-a11y/no-static-element-interactions': 'off',
            '@next/next/no-img-element': 'off',
            'jsx-a11y/click-events-have-key-events': 'off',
            'react/jsx-indent': ['error', 4], // JSX girintisi
            'react/jsx-indent-props': ['error', 4], // JSX prop'larının girintisi
            'react/jsx-closing-bracket-location': ['error', 'line-aligned'], // JSX kapanış parantezlerinin hizalanması
            'react/jsx-tag-spacing': ['error', { 'closingSlash': 'never', 'beforeSelfClosing': 'always', 'afterOpening': 'never', 'beforeClosing': 'never' }], // JSX etiketlerindeki boşluklar
            'import/no-named-as-default-member': 'off',
            'indent': 'off',
            'eol-last': 'off',
            'react/no-unescaped-entities': 'off',
            // Import/export kuralları
            'import/order': [
                'warn',
                {
                    'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
                },
            ],
            'import/newline-after-import': ['error', { 'count': 1 }], // Import'lardan sonra boş satır bırak
        },
        settings: {
            react: {
                version: 'detect',
            },
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
