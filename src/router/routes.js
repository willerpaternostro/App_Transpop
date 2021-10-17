
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name:'Index' },
      { path: 'cadastro', component: () => import('src/pages/Cadastro.vue'), name:'Cadastro' },
      { path: 'login', component: () => import('src/pages/Login.vue'), name:'Login' },
      { path: 'esqueci-senha', component: () => import('src/pages/EsqueciSenha.vue'), name:'EsqueciSenha' },
      { path: 'home', component: () => import('src/pages/Home.vue'), name:'Home' },
      { path: 'timeline', component: () => import('src/pages/TimeLine.vue'), name:'TimeLine' },
      
      { path: 'lista-categoria', component: () => import('src/pages/ListaCategoria.vue'), name:'ListaCategoria' },
      { path: 'lista-votacoes', component: () => import('pages/ListaVotacoes.vue'), name:'ListaVotacoes' },
      { path: 'lista-deputados', component: () => import('pages/ListaDeputados.vue'), name:'ListaDeputados' },
      { path: 'lista-proposicoes', component: () => import('src/pages/ListaProposicoes.vue'), name:'ListaProposicoes' },

      { path: 'deputado', component: () => import('src/pages/Deputado.vue'), name:'Deputado' },
      { path: 'proposicao', component: () => import('src/pages/Proposicao.vue'), name:'Proposicao' },
      { path: 'votacao', component: () => import('src/pages/Votacao.vue'), name:'Votacao' },
      //CANDIDATOS
      { path: 'lista-candidatos', component: () => import('src/pages/candidatos/ListaCandidatos.vue'), name:'ListaCandidatos' },
      //Favoritos
      { path: 'favoritos-deputados', component: () => import('src/pages/favoritos/FavoritosDeputados.vue'), name:'FavoritosDeputados' },
      { path: 'favoritos-candidatos', component: () => import('src/pages/favoritos/FavoritosCandidatos.vue'), name:'FavoritosCandidatos' },
      { path: 'favoritos-proposicoes', component: () => import('src/pages/favoritos/FavoritosProposicoes.vue'), name:'FavoritosProposicoes' },
      { path: 'favoritos-votacoes', component: () => import('src/pages/favoritos/FavoritosVotacoes.vue'), name:'FavoritosVotacoes' },
      //Privacidade
      { path: 'privacidade', component: () => import('src/pages/Privacidade.vue'), name:'Privacidade' }
     
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
