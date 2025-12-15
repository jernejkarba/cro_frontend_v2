const routes = [
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
    ],
  },
  {
    path: '/financna-kartica',
    component: () => import('layouts/Default.vue'),
    children: [{ path: '', component: () => import('pages/FinancnaKartica.vue') }],
  },
  {
    path: '/financna-kartica-prikaz',
    component: () => import('layouts/Default.vue'),
    children: [{ path: '', component: () => import('pages/FinancnaKarticaPrikaz.vue') }],
  },
  // catch-all route za 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
