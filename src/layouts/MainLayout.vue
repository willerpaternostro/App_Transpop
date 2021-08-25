<template>
  <q-layout view="lHh Lpr lFf"  >
  <!-- HEADER --> 
    <q-header v-if="mostrarHeader" style=" background-image: linear-gradient(to bottom right, green,yellow ); ">
      <q-toolbar>
        <q-btn
          @click="acaoBotaoEsquerdoHeader"
          v-if="mostrarBotaoEsquerdoHeader"
          :icon="iconeBotaoEsquerdoHeader"
          flat
          dense
          round
          aria-label="Menu"
        />

        <q-toolbar-title>
          {{tituloHeader}}
        </q-toolbar-title>

        <div>
          <q-btn
            @click="acaoBotaoDireitoHeader"
            v-if="mostrarBotaoDireitoHeader"
            :icon="iconeBotaoDireitoHeader"
            outline
            dense
            round
          />
        </div>
      </q-toolbar>
     <!-- TABS FAVORITOS --> 
      <q-tabs
        v-if="mostrarTabFavoritos"
        v-model="tabFavoritos"
        class="bg-grey-1 text-center row"
        style="font-size:14px;"
        active-bg-color="grey-4"
        indicator-color="grey-3"
        mobile-arrows
      >
        <q-tab @click="mudarTabFavoritos('deputados')" no-caps  name="deputados"   class="col-4 text-grey-7" label="Deputados" />
        <q-tab @click="mudarTabFavoritos('proposicoes')" no-caps  name="proposicoes"   class="col-4 text-grey-7" label="Proposições" /> 
        <q-tab @click="mudarTabFavoritos('candidatos')" no-caps  name="candidatos"  class="col-4 text-grey-7" label="Candidatos" />
      </q-tabs>
    </q-header>
 
    <!-- ROTEADOR DE PÁGINAS --> 
    <q-page-container >
      <router-view class="q-pa-xs col-xs-12 col-md-8"  />
    </q-page-container>
    <!-- DRAWER--> 
    <q-drawer
      v-model="mostrarDrawer"
      :width="$q.screen.width"
    >
      <q-list  class="text-positive" style="margin-top:180px;padding-left:16px">
        <q-item
          clickable
          v-ripple
          >
            <q-item-section avatar>
              <q-icon ><i class="fas fa-info-circle " aria-hidden="true"></i> </q-icon>
              </q-item-section>
            <q-item-section>Sobre nós</q-item-section>
        </q-item>


        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
           <q-icon> <i class="fas fa-heart"></i></q-icon>
          </q-item-section>

          <q-item-section>Indique a um amigo</q-item-section>
        </q-item>
       
        
        <q-item 
          clickable
          v-ripple 
       >
          <q-item-section avatar>
            <q-icon ><i class="fas fa-users " aria-hidden="true"></i></q-icon>
          </q-item-section>
           <q-item-section>Para Candidatos</q-item-section>
          
        </q-item>
         <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
           <q-icon> <i class="fas fa-times"></i></q-icon>
          </q-item-section>

          <q-item-section>Remover Propagandas</q-item-section>
        </q-item>
        <q-separator style="margin-top:10px;margin-bottom:10px" color="grey-4" />
         <q-item
          clickable
          v-ripple
          >
          
          <q-item-section avatar>
            <q-icon><i class="fa fa-file " aria-hidden="true"></i></q-icon>
          </q-item-section>

          <q-item-section>Termos de uso</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="fas fa-archive"/>
          </q-item-section>

          <q-item-section>Política de privacidade</q-item-section>
        </q-item>
         <q-item 
          clickable
           v-ripple 
         >
          <q-item-section avatar>
            <q-icon ><i class="fa fa-wrench " aria-hidden="true"></i></q-icon>
          </q-item-section>
          <q-item-section>Configurações</q-item-section>
         
        </q-item>
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon><i class="fas fa-sign-out-alt "></i></q-icon>
          </q-item-section>

          <q-item-section>Sair</q-item-section>
        </q-item>
      </q-list>
    
      <q-img class="absolute-top" style="height:180px;  background-image: linear-gradient(to bottom right, green,yellow );" >
        
          <div class="bg-transparent full-width" >
            <q-avatar color="grey-2" text-color="positive" size="80px" >
              W
            </q-avatar>
          <div class="row">
            <span class="text-h6 col-10"> Olá, Willer! </span>
            <q-icon  class="col-2 " name="fas fa-pen" />
          </div>
       <div class="">willer@gmail.com</div> 
          </div>
      </q-img>
      <!--ESTE BOTÃO PRECISA SER NECESSARIAMENTE DEPOIS DE IMG-->
      <q-btn class="absolute-top-right" @click="alterarDrawer"  text-color="white" icon="fas fa-times" flat />
    </q-drawer>
  <!-- FOOTER --> 
    <q-footer v-if="mostrarFooter" style="height:60px" class="bg-transparent text-grey-7">
       <q-tabs
            v-model="tabFooter"
            class="bg-grey-1 text-center"
            style="margin-bottom:20px;height:60px;font-size:14px"
            active-bg-color="grey-4"
            indicator-color="grey-3"
        >
     
        <q-tab style="max-width:20%" no-caps @click="paginaAtual != 'Home'?$router.push({name:'Home'}):''"  name="home" ><q-icon size="25px" name="fas fa-home"/><span class="text-grey-7 " style="font-size:12px">Home</span> </q-tab>
        <q-tab style="max-width:20%" no-caps @click="paginaAtual != 'Favoritos'?$router.push({name:'FavoritosDeputados'}):''" name="favoritos" ><q-icon size="25px" name="fas fa-heart"/><span class="text-grey-7 " style="font-size:12px">Favoritos</span> </q-tab>
        <q-tab style="max-width:20%" no-caps @click="paginaAtual != 'Favoritos'?$router.push({name:'TimeLine'}):''" name="timeline" ><q-icon size="25px" name="fas fa-bars"/><span class="text-grey-7 " style="font-size:12px">Timeline</span> </q-tab>
        <q-tab disable style="max-width:20%" no-caps @click="paginaAtual != 'ListaCandidatos'?$router.push({name:'ListaCandidatos'}):''"  name="votos" ><q-icon size="25px" name="far fa-thumbs-up"/> <span class="text-grey-7 " style="font-size:12px">Votações</span></q-tab>
        <q-tab disable style="max-width:20%" no-caps @click="paginaAtual != 'ListaCandidatos'?$router.push({name:'ListaCandidatos'}):''"  name="candidatos" ><q-icon size="25px" name="fas fa-users"/><span class="text-grey-7 " style="font-size:12px">Candidatos</span></q-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      height:600,
      paginaAtual:"Index",
      mostrarDrawer: false,
      
    //INFORMAÇÕES HEADER
      mostrarHeader:false,
      mostrarBotaoDireitoHeader:false,
      mostrarBotaoEsquerdoHeader:false,
      iconeBotaoDireitoHeader:'',
      iconeBotaoEsquerdoHeader:'',
      tituloHeader:'',
    //TABS FAVORITOS
      tabFavoritos:'deputados',
      mostrarTabFavoritos:false,
    //TABS FAVORITOS
      tabFooter:'home',
    //INFORMAÇÕES FOOTER
      mostrarFooter:false,
    }
  },
  computed:{
 
  },
  methods:{
    // INICIALIZAÇÃO DO LAYOUT
    inicializacaoPagina(){
      if(this.paginaAtual == "Index"){
        this.mostrarHeader = false;
        this.mostrarFooter = false;
      }
      if(this.paginaAtual == "Home"){
        this.mostrarFooter = true;
        this.inicializarHeader({
          mostrarHeader:true,
          mostrarBotaoDireitoHeader:false,
          mostrarBotaoEsquerdoHeader:true,
          iconeBotaoDireitoHeader:'',
          iconeBotaoEsquerdoHeader:'fas fa-bars',
          tituloHeader:'TransPop',
        })
        
      }
      if( this.paginaAtual == "ListaCategoria" || this.paginaAtual == "ListaProposicoes" || 
          this.paginaAtual == "ListaVotacoes" || this.paginaAtual == "ListaDeputados"
        ){
        this.mostrarFooter = false;
        this.inicializarHeader({
          mostrarHeader:true,
          mostrarBotaoDireitoHeader:true,
          mostrarBotaoEsquerdoHeader:true,
          iconeBotaoDireitoHeader:'fas fa-info',
          iconeBotaoEsquerdoHeader:'fas fa-arrow-left',
          tituloHeader:'TransPop',
        })
      }
      if(this.paginaAtual == 'FavoritosDeputados' || this.paginaAtual == 'FavoritosCandidatos' || this.paginaAtual == 'FavoritosProposicoes' || this.paginaAtual == 'FavoritosVotacoes' ){
        this.mostrarTabFavoritos = true
      }else{
        this.mostrarTabFavoritos = false
      }
    },
    inicializarHeader(informacoesHeader){
      console.log(informacoesHeader)
      //mostrarHeader 
      informacoesHeader.mostrarHeader?this.mostrarHeader = informacoesHeader.mostrarHeader: this.mostrarHeader = false
      //mostrarBotaoDireito 
      informacoesHeader.mostrarBotaoDireitoHeader?this.mostrarBotaoDireitoHeader = informacoesHeader.mostrarBotaoDireitoHeader: this.mostrarBotaoDireitoHeader = false
      //mostrarBotaoEsquerdo 
      informacoesHeader.mostrarBotaoEsquerdoHeader?this.mostrarBotaoEsquerdoHeader = informacoesHeader.mostrarBotaoEsquerdoHeader: this.mostrarBotaoEsquerdoHeader = false
      //iconeBotaoDireito 
      informacoesHeader.iconeBotaoDireitoHeader?this.iconeBotaoDireitoHeader = informacoesHeader.iconeBotaoDireitoHeader:this.iconeBotaoDireitoHeader = ''
      //iconeBotaoEsquerdo 
      informacoesHeader.iconeBotaoEsquerdoHeader?this.iconeBotaoEsquerdoHeader = informacoesHeader.iconeBotaoEsquerdoHeader:this.iconeBotaoEsquerdoHeader =''
      //tituloHeader 
      informacoesHeader.tituloHeader?this.tituloHeader = informacoesHeader.tituloHeader:this.tituloHeader = ''
    
    },
    acaoBotaoDireitoHeader(){
      if(this.paginaAtual === 'ListaVotacoes'){this.alterarDialogInformativoVotacao(true)};
      
    },
    acaoBotaoEsquerdoHeader(){
      if(this.paginaAtual == "Home"){
        this.alterarDrawer(); 
      }else{
        this.backButton()
      }
    },
    alterarDrawer(){
      console.log("MUDAR DRAWER");
      this.mostrarDrawer = !this.mostrarDrawer
    },
    backButton(){
      if(this.paginaAtual == "ListaCategoria"){this.$router.push({name:'Home'})}
      if(this.paginaAtual == "ListaProposicoes"){this.$router.push({name:'Home'})}
      if(this.paginaAtual == "ListaVotacoes"){this.$router.push({name:'Home'})}
      if(this.paginaAtual == "ListaDeputados"){this.$router.push({name:'Home'})}
      if(this.paginaAtual == "Deputado"){this.$router.push({name:'ListaDeputados'})}
      if(this.paginaAtual == "Proposicao"){this.$router.push({name:'ListaProposicoes'})}
      if(this.paginaAtual == "Votacao"){this.$router.push({name:'ListaVotacoes'})}
      if(this.paginaAtual == "Home"){console.log("FECHAR APP");}
      if(this.paginaAtual == "Index"){console.log("FECHAR APP");}
    },
    //TAB FAVORITOS
    mudarTabFavoritos(dado){
      if(dado == 'deputados' && this.paginaAtual != 'FavoritosDeputados')this.$router.push({name:'FavoritosDeputados'});
      if(dado == 'proposicoes' && this.paginaAtual != 'FavoritosProposicoes')this.$router.push({name:'FavoritosProposicoes'});
      if(dado == 'votacoes' && this.paginaAtual != 'FavoritosVotacoes')this.$router.push({name:'FavoritosVotacoes'});
      if(dado == 'candidatos' && this.paginaAtual != 'FavoritosCandidatos')this.$router.push({name:'FavoritosCandidatos'});
    },
    // ALTERAR DIALOGS INFORMATIVOS
    alterarDialogInformativoVotacao(dado){
      return this.$store.commit('dadosAbertos/alterarDialogInformativoVotacao',dado)
    },
  },
  watch:{
    $route: function(paginaAtual, paginaAnterior){
      this.paginaAtual = paginaAtual.name;
      this.paginaAnterior = paginaAnterior.name;
      this.$q.localStorage.set('paginaAtual',this.paginaAtual)
      this.$q.localStorage.set('paginaAnterior',this.paginaAnterior)
      console.log(this.paginaAtual);
      this.inicializacaoPagina();
    }
  }
}
</script>
<style scoped >
.q-tab {
  padding: 0px 4px !important;
}
</style>