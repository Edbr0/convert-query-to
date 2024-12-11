import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-sql';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('prism', Prism);
});
