module.exports = {
    root: true,
    extends: '@react-native-community',
    plugins: ['import'],
    rules: {'no-unused-vars': 0, '@typescript-eslint/no-unused-vars': 0},
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
                alias: {
                    assets: './src/assets',
                    components: './src/components',
                    navigation: './src/navigation',
                    screens: './src/screens',
                    services: './src/services',
                    utils: './src/utils',
                    store: './src/store',
                    '@rna': './src/vendor/react-native-arsenal/lib',
                },
            },
        },
    },
};
