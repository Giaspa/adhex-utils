
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'adhex-utils',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/adhex-utils"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2523, hash: '3baf4593b29bd3979613a3ff998cfb65f8e145ecda397f2e9a726e148fea2d26', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1017, hash: '744209b1b7042e4fb925c2ff5b002f8a30b9e3ef8d8d36c77911fe93f262f958', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 11535, hash: '10ea9a3258ea4dba29b0658eeae2e35aee459e2f4dcdb531f84c25c8f48e49bf', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-7KF2OZYB.css': {size: 7985, hash: '+npyGgAI+PY', text: () => import('./assets-chunks/styles-7KF2OZYB_css.mjs').then(m => m.default)}
  },
};
