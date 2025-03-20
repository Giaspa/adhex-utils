
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/adhex-utils/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/adhex-utils"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3132, hash: '0036576bf369c424cbdab03b1e38f8590e35d1d76e18876cb1b268bddea511de', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1019, hash: 'c51d23c8c76e150e3446f446f339b901ffa0766a473531def192273cf9a30723', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 12176, hash: '0dc9e10455ea171332b7984341f8fed4423e84c76660e1de952cf19ff16fffe4', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5U2PRUSB.css': {size: 10004, hash: 'xluEYQxzSp0', text: () => import('./assets-chunks/styles-5U2PRUSB_css.mjs').then(m => m.default)}
  },
};
