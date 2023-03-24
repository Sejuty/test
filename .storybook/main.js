module.exports = {
    stories: ['../src/**/*.stories.(js|mdx)'],
    showPanel: true,
    panelPosition: 'right',
    addons: [
        '@storybook/preset-create-react-app',
        // '@storybook/addon-actions',
        '@storybook/addon-knobs',
        '@storybook/addon-links',
        '@storybook/addon-docs'
    ],
    theme: {
        
        brandTitle: 'AllSpark',
    }
};
