<template>
    <q-page >
        <q-expansion-item
         style="margin-bottom:20px;"
          expand-separator
          expand-icon="fas fa-filter"
          label="Clique aqui para Pesquisa avançada"
          class="text-weight-bold bg-yellow-2"
        >
       <div class="bg-grey-2">
        <br> 
            <q-input outlined v-model="filtro_nome" label="nome" /><br>
            <q-select outlined v-model="filtro_siglaUf" :options="select_ufs"   label="UF Autor" /><br>
            <q-select outlined v-model="filtro_siglaSexo" :options="select_sexo"   label="Sexo" /><br>
            <q-input outlined v-model="filtro_siglaPartido" @input="filtrarPartidos"  label="Partido" />
            <q-list class="bg-white" padding bordered  v-if="filtro_siglaPartido">
                <item @click="filtro_siglaPartido = partido.sigla, partidosFiltrado = []"  v-for="(partido,index) in partidosFiltrado" :key="index">
                    <q-item-section>
                        {{partido.sigla + ' - ' + partido.nome}}
                    </q-item-section>
                </item>
            </q-list>
            <br>
          <q-select outlined v-model="filtro_itens" :options="select_itens"  label="Itens por página"  /><br>
            <div class="row justify-end">
              <q-btn @click="pesquisaComFiltro" color="dark" label="Pesquisar" no-caps />
            </div>    
       </div>
        </q-expansion-item>
         
         <div class="row "><span class="col-12 text-right text-grey-9 text-weight-bold">{{'Resultado: '+deputados.length +' encontrados'}}</span> </div>
        <div class="row justify-center">
            <div  v-for="(deputado,index) in deputados" :key="index" class="col-xs-12 col-sm-4 row" style="border:1px solid green; margin-bottom:5px; border-radius:10px;padding:10px">
              
            <div @click="informacaoDeputado(deputado)"  class="col-xs-3 col-sm-12"><img width="100%" :src="deputado.urlFoto" /></div>
            <div @click="informacaoDeputado(deputado)"  class="col-xs-8 col-sm-12 row" style="padding-left:5px">
                <div class="col-xs-12 text-h6 text-grey-9">{{deputado.nome}} </div>
                <div class="col-xs-12 text-grey-9"><span class="text-weight-bold">Partido:</span>{{deputado.siglaPartido }}</div>
                <div class="col-xs-12 text-grey-9"><span class="text-weight-bold">Estado:</span>{{deputado.siglaUf }}</div>
                <div class="col-xs-12 text-grey-9">{{deputado.email }}</div>
            </div>
                <div class="col-xs-1 text-center" style="margin-top:5px">
                    <q-icon @click="salvarDeputadoFavoritos(index)" v-model="coracoesFavoritos[index]" size="21px" color="red" :name="coracoesFavoritos[index]['situacao']?'fas fa-heart':'far fa-heart'" />
                </div>
            </div>
        </div>
        <q-btn v-show="botaoCarregarMais" @click="carregarMais" class="full-width" label="Carregar mais ..." />
    </q-page>
</template>
<script>
const SELECT_ITEMS = [
    15,30, 50, 100
];
const UFs =[
    'Todos',
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
];
const PARTIDOS = 
[
    {
    id: 36898,
    sigla: "AVANTE",
    nome: "Avante",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36898"
    },
    {
    id: 37905,
    sigla: "CIDADANIA",
    nome: "Cidadania",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37905"
    },
    {
    id: 37902,
    sigla: "DC",
    nome: "Democracia Cristã",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37902"
    },
    {
    id: 36769,
    sigla: "DEM",
    nome: "Democratas",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36769"
    },
    {
    id: 36899,
    sigla: "MDB",
    nome: "Movimento Democrático Brasileiro",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36899"
    },
    {
    id: 37901,
    sigla: "NOVO",
    nome: "Partido Novo",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37901"
    },
    {
    id: 37900,
    sigla: "PATRI",
    nome: "Patriota",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37900"
    },
    {
    id: 37907,
    sigla: "PATRIOTA",
    nome: "Patriota",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37907"
    },
    {
    id: 36863,
    sigla: "PCB",
    nome: "Partido Constitucionalista Brasileiro",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36863"
    },
    {
    id: 36779,
    sigla: "PCdoB",
    nome: "Partido Comunista do Brasil",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36779"
    },
    {
    id: 36781,
    sigla: "PCO",
    nome: "Partido da Causa Operária",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36781"
    },
    {
    id: 36786,
    sigla: "PDT",
    nome: "Partido Democrático Trabalhista",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36786"
    },
    {
    id: 36793,
    sigla: "PHS",
    nome: "Partido Humanista da Solidariedade",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36793"
    },
    {
    id: 37906,
    sigla: "PL",
    nome: "Partido Liberal",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37906"
    },
    {
    id: 36887,
    sigla: "PMB",
    nome: "Partido da Mulher Brasileira",
    uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36887"
    },
    {
        id: 36801,
        sigla: "PMN",
        nome: "Partido da Mobilização Nacional",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36801"
    },
    {
        id: 36896,
        sigla: "PODE",
        nome: "Podemos",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36896"
    },
    {
        id: 37903,
        sigla: "PP",
        nome: "Progressistas",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37903"
    },
    {
        id: 36762,
        sigla: "PPL",
        nome: "Partido Pátria Livre",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36762"
    },
    {
        id: 36813,
        sigla: "PPS",
        nome: "Partido Popular Socialista",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36813"
    },
    {
        id: 36814,
        sigla: "PR",
        nome: "Partido da República",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36814"
    },
    {
        id: 36815,
        sigla: "PRB",
        nome: "Partido Republicano Brasileiro",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36815"
    },
    {
        id: 36763,
        sigla: "PROS",
        nome: "Partido Republicano da Ordem Social",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36763"
    },
    {
        id: 36824,
        sigla: "PRP",
        nome: "Partido Republicano Progressista",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36824"
    },
    {
        id: 36829,
        sigla: "PRTB",
        nome: "Partido Renovador Trabalhista Brasileiro",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36829"
    },
    {
        id: 36832,
        sigla: "PSB",
        nome: "Partido Socialista Brasileiro",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36832"
    },
    {
        id: 36833,
        sigla: "PSC",
        nome: "Partido Social Cristão",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36833"
    },
    {
        id: 36834,
        sigla: "PSD",
        nome: "Partido Social Democrático",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36834"
    },
    {
        id: 36835,
        sigla: "PSDB",
        nome: "Partido da Social Democracia Brasileira",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36835"
    },
    {
        id: 36837,
        sigla: "PSL",
        nome: "Partido Social Liberal",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36837"
    },
        {
        id: 36839,
        sigla: "PSOL",
        nome: "Partido Socialismo e Liberdade",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36839"
    },
    {
        id: 36843,
        sigla: "PSTU",
        nome: "Partido Socialista dos Trabalhadores Unificado",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36843"
    },
    {
        id: 36844,
        sigla: "PT",
        nome: "Partido dos Trabalhadores",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36844"
    },
    {
        id: 36845,
        sigla: "PTB",
        nome: "Partido Trabalhista Brasileiro",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36845"
    },
    {
        id: 36846,
        sigla: "PTC",
        nome: "Partido Trabalhista Cristão",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36846"
    },
    {
        id: 36851,
        sigla: "PV",
        nome: "Partido Verde",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36851"
    },
    {
        id: 36886,
        sigla: "REDE",
        nome: "Rede Sustentabilidade",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36886"
    },
    {
        id: 37908,
        sigla: "REPUBLICANOS",
        nome: "Republicanos",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37908"
    },
    {
        id: 36852,
        sigla: "S.PART.",
        nome: "Sem Partido",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/36852"
    },
    {
        id: 37904,
        sigla: "SOLIDARIEDADE",
        nome: "Solidariedade",
        uri: "https://dadosabertos.camara.leg.br/api/v2/partidos/37904"
    }
];
import { axiosInstance } from 'boot/axios'
const config = { headers: { 'Content-Type': 'application/json' } };
export default {
  data () {
    return {
        filtro_itens:'',
        filtro_nome:'',
        filtro_siglaUf:'',
        filtro_siglaPartido:'',
        filtro_siglaSexo:'',
        filtro_ordenarPor:'',

        select_itens:SELECT_ITEMS,
        select_sexo:['','M','F'],
        select_ufs:UFs,

        partidos:PARTIDOS,
        partidosFiltrado:[],

        coracoesFavoritos:[]
    }
  },
  computed:{
      deputados(){
          return this.$store.state.dadosAbertos.deputados
      },
      botaoCarregarMais(){
          return this.$store.state.dadosAbertos.botaoCarregarMais
      }
  },
  methods:{
    pesquisaComFiltro(){
        let consulta= ''   
        if(this.filtro_itens)
            consulta = "?itens="+this.filtro_itens
        else
            consulta = "?itens=30"
    
        //filtro_nome
        if(this.filtro_nome){consulta = consulta + "&nome=" + this.filtro_nome}
        //filtro_siglaUf
        if(this.filtro_siglaUf){
            let filtro = this.filtro_siglaUf === 'Todos'?'':this.filtro_siglaUf
            consulta = consulta + "&siglaUf=" + filtro
        }
        //filtro_siglaPartido
        if(this.filtro_siglaPartido){consulta = consulta + "&siglaPartido=" + this.filtro_siglaPartido}
        //filtro_siglaSexo
        if(this.filtro_siglaSexo){consulta = consulta + "&siglaSexo=" + this.filtro_siglaSexo}
        //filtro_ordenarPor
        if(this.filtro_ordenarPor){consulta = consulta + "&ordenarPor=" + this.filtro_ordenarPor}

        return this.$store.dispatch("dadosAbertos/requisitarDeputados",consulta)
    },
   informacaoDeputado(deputadoEscolhido){
       return this.$store.dispatch("dadosAbertos/informacaoDeputado",deputadoEscolhido)
       
   },
   filtrarPartidos(){
       let pesquisa = this.filtro_siglaPartido.toUpperCase()
       this.partidosFiltrado = this.partidos.filter(element => { return element.sigla.includes(pesquisa)}) 
   },
   adicionarProximosDeputados(dados){
        return this.$store.commit('dadosAbertos/adicionarProximosDeputados',dados)
   },
    async carregarMais(){
       let prox = this.$q.localStorage.getItem('nextDeputados')
       prox = prox.split('https://dadosabertos.camara.leg.br/api/v2/deputados/')
       await axiosInstance.get("deputados/"+prox[1],config).then((response) =>{
            console.log(response);
            this.adicionarProximosDeputados(response.data.dados)
            let urlNext = false
            if(response.data.links){
                response.data.links.forEach(elemento => {
                    if(elemento.rel == 'next'){
                        urlNext = elemento.href
                    }
                })
                if(!urlNext ){
                    this.$q.localStorage.set('nextDeputados',false)
                    this.alterarBotaoCarregarMais(false)
                }else{
                    this.$q.localStorage.set('nextDeputados',urlNext)
                    this.alterarBotaoCarregarMais(true)
                }
            }
        }).catch((erro)=>{
            console.log(erro);
        })
   },
   alterarBotaoCarregarMais(dado){
        return this.$store.commit('dadosAbertos/alterarBotaoCarregarMais',dado)
   },
   salvarDeputadoFavoritos(index){
    //Salvar IDs para pesquisa rápida
    //Salvar deputados para utilizar na página Favoritos (delimitar qtde?)
        console.log(this.coracoesFavoritos[index] );
        this.coracoesFavoritos[index]['situacao'] = !this.coracoesFavoritos[index]['situacao']
        console.log(this.coracoesFavoritos[index] );
       let deputado = this.deputados[index];
       let deputados = this.$q.localStorage.getItem('deputadosFavoritos');
       let ids = this.$q.localStorage.getItem('ID_deputadosFavoritos');
    if(!ids.includes(deputado.id)){ //Incluir Favoritos
        deputados.push(deputado);
        ids.push(deputado.id);
    }else{// Excluir Favoritos
        let retirarID = ids;
        let retirarDeputado = deputados;
        retirarID.forEach((idRemover,index) =>{ 
            if(idRemover === deputado.id){
                ids.splice(index,1)
            }
        })
        retirarDeputado.forEach((deputadoRemover,index)=>{
            if(deputadoRemover.id === deputado.id){
                deputados.splice(index,1)
            }
        })
    }
   
    this.$q.localStorage.set('ID_deputadosFavoritos',ids)
    this.$q.localStorage.set('deputadosFavoritos',deputados)
   
   },
   verificarCoracao(){
       let deputadosFavoritos = this.$q.localStorage.getItem('ID_deputadosFavoritos');
        this.deputados.forEach(element =>{
            if(deputadosFavoritos.includes(element.id)){
                this.coracoesFavoritos.push({id:element.id,situacao:true})
            }else{
                this.coracoesFavoritos.push({id:element.id,situacao:false})
            }      
        }) 
   },
  },
  watch:{
      deputados:function(val){
          console.log(val);          
          this.coracoesFavoritos=[]
          this.verificarCoracao()
      }
  },
    beforeMount(){
        if(!this.$q.localStorage.getItem('ultimaPesquisaDeputados')){
            this.pesquisaComFiltro();
        }
        this.verificarCoracao()  
    },
    mounted(){
       
    }
}
</script>
<style >

</style>

