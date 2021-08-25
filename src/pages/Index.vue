<template>
  <q-page >
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      animated
      class="rounded-borders"
      swipeable
      :height="alturaTela*0.8+'px'"
    >
      <q-carousel-slide name="slide1" >
          <q-img
            src="~assets/procurar_mobile.svg"
            :height="alturaTela*0.6+'px'"
            contain
          />
          <div class="row justify-center ">
            <span class="col-xs-12 col-sm-6 text-center text-h6">{{atributosPagina.tituloUmApresentacao}}</span>
          </div>
          <div class="row justify-center" style="margin-top:10px">
            <p class="col-xs-12 col-sm-6 text-center ">{{atributosPagina.paragrafoUmApresentacao}}</p>
          </div>
      </q-carousel-slide>
      <q-carousel-slide name="slide2" >
         <q-img
           src="~assets/mulheres_votando_eletronicamente.svg"
          :height="alturaTela*0.6+'px'"
          contain
        />
         <div class="row justify-center">
            <span class="col-xs-12 col-sm6 text-center text-h6">{{atributosPagina.tituloDoisApresentacao}}</span>
          </div>
          <div class="row justify-center" style="margin-top:10px">
            <p class="col-xs-12 col-sm-6 text-center ">{{atributosPagina.paragrafoDoisApresentacao}}</p>
          </div>
      </q-carousel-slide>
      <q-carousel-slide name="slide3" >
        <q-img
          src="~assets/mulheres_votando_eletronicamente.svg"
          :height="alturaTela*0.6+'px'"
          contain
        />
        <div class="row justify-center ">
          <span class="col-xs-12 col-sm-6 text-center text-h6">{{atributosPagina.tituloTresApresentacao}}</span>
        </div>
        <div class="row justify-center" style="margin-top:10px">
          <p class="col-xs-12 col-sm-6 text-center ">{{atributosPagina.paragrafoTresApresentacao}}</p>
        </div>
      </q-carousel-slide>
    </q-carousel>
    <div class="absolute-bottom bg-white text-positive">
     
      
      <div class="row justify-center">
        <q-btn-group flat>
          <q-btn @click="slide='slide1'" flat :color="corIconesApresentacaoApp" icon="fas fa-star" />
          <q-btn @click="slide='slide2'" flat :color="corIconesApresentacaoApp" :icon="iconeDoisApresentacaoApp?'fas fa-star':'far fa-star'"  />
          <q-btn @click="slide='slide3'" flat :color="corIconesApresentacaoApp" :icon="iconeTresApresentacaoApp?'fas fa-star':'far fa-star'"  />
        </q-btn-group>
      </div>
      <div class="row justify-center " style="padding:20px">
        <q-btn @click="continuar" text-color="primary"  class="col-xs-8 col-sm-3" label="Continuar" rounded no-caps color="yellow" />
      </div>
    </div>
  </q-page>
</template>

<script>

const atributosPagina = {
  backgroundColorTela:'',
  corIconesApresentacaoApp:'positive',
  //Títulos
  tituloUmApresentacao:'Bem-Vindo ao Transpop!',
  tituloDoisApresentacao:'O seu voto pode fazer a diferença!',
  tituloTresApresentacao:'Acompanhe todas as proposições!',
  //Parágrafos
  paragrafoUmApresentacao:'No Transparência Popular você fica sabendo o que os nossos políticos estão votando',
  paragrafoDoisApresentacao:'Mostre a Câmara qual o seu voto na proposição a ser votada',
  paragrafoTresApresentacao:' Avalie se os candidatos que votaram dão match com seu voto.'

}
export default {
  name: 'Index',
  data(){
    return{
      atributosPagina:atributosPagina, //Alterar apenas a variável
      alturaTela:600,
      slide: 'slide1',
      iconeDoisApresentacaoApp:false,
      iconeTresApresentacaoApp:false,
      corIconesApresentacaoApp:'positive'
    }
  },
  methods:{
    continuar(){
      console.log(this.slide)
      if(this.slide == 'slide1'){
        this.slide = 'slide2'
        this.iconeDoisApresentacaoApp = true;
        this.iconeTresApresentacaoApp =false;
        return
      }
        
      if(this.slide == 'slide2'){
        this.slide = 'slide3'
        this.iconeDoisApresentacaoApp = true;
        this.iconeTresApresentacaoApp = true;
        return
      }
      
      if(this.slide == 'slide3'){
        this.$q.localStorage.set('primeiraVezApp',true)
        this.$router.push({name:'Home'})
      }
    },
  },
  watch:{
    slide:function(valor){
      console.log(valor);
      if(this.slide == 'slide1'){
        this.iconeDoisApresentacaoApp = false;
        this.iconeTresApresentacaoApp = false;
      }
      if(this.slide == 'slide2'){
        this.iconeDoisApresentacaoApp = true;
        this.iconeTresApresentacaoApp = false;
      }
      if(this.slide == 'slide3'){
        this.iconeDoisApresentacaoApp = true;
        this.iconeTresApresentacaoApp = true;
      }
    }
  },
  beforeCreate(){
    // Mexe apenas no localStorage.
    if(!this.$q.localStorage.getItem('primeiraVezApp')){ // Inicia variáveis do localStorage
      this.$q.localStorage.set('primeiraVezApp',false)
      this.$q.localStorage.set('deputadosFavoritos',[])
      this.$q.localStorage.set('ID_deputadosFavoritos',[])
      this.$q.localStorage.set('proposicoesFavoritos',[])
      this.$q.localStorage.set('ID_proposicoesFavoritos',[])
    }else{
      this.$router.push({name:'Home'})
    }
  },
  created(){
  
 
  },
  beforeMount(){
  
   
  },
  mounted(){
    console.log(this.$q.screen)
    this.alturaTela = this.$q.screen.height
  
  }
}
</script>

<style>

</style>
 