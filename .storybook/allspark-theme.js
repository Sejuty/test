import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  colorPrimary: '#546E7A',
  colorSecondary: '#37474F',

  // UI
  appBg: '#263238',
  appContentBg: '#FFFFFF',
  appBorderColor: '#FFFFFF',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#546E7A',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: '#78909C',
  barSelectedColor: '#546E7A',
  barBg: '#C6C6C6',

  // Form colors
  inputBg: '#CFD8DC',
  inputBorder: '#546E7A',
  inputTextColor: '#546E7A',
  inputBorderRadius: 4,

  brandTitle: 'AllSpark',
  brandUrl: '/',
  brandImage: '',
});