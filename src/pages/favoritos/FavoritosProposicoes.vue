<template>
    <q-page >
        <!-- MSG NENHUM ENCONTRADO -->
        <div v-if="proposicoesDetalhadas.length == 0" class="row justify-center" style="margin-top:40px"> 
            <p class="text-grey-7 text-center" style="font-size:16px">Você ainda não adicionou nenhuma proposicao aos seus favoritos ...</p>
            <q-btn @click="$router.push({name:'ListaProposicoes'})" icon-right="fas fa-search" rounded color="primary" text-color="white" label="Procurar proposições" no-caps />
        </div>
        <!-- CARD PROPOSIÇÕES FAVORITOS -->
        <div class="row justify-center">
            <div v-if="proposicoesDetalhadas">
                <div class="" v-for="(proposicao,index) in proposicoesDetalhadas" :key="index" style="border: 1px solid green;border-radius:10px; padding:10px;margin-bottom:6px" >
                    <div class="row" style="margin-bottom:5px">
                        <div class="text-h6 col-11 text-grey-9">  {{proposicao.siglaTipo +' ' +proposicao.numero +'/'+proposicao.ano}} </div> 
                        <div class="col-1 text-center" style="margin-top:5px">
                            <q-icon @click="salvarProposicaoFavoritos(index)" v-model="coracoesFavoritos[index]" size="21px" color="red" :name="coracoesFavoritos[index]['situacao']?'fas fa-heart':'far fa-heart'" />
                        </div>
                    </div>
                    
                    <div style="font-size:16px; margin-bottom:5px"><span class="text-weight-bold text-grey-9">Ementa:</span>{{proposicao.ementa}} </div>
                    <div><span class="text-weight-bold text-grey-9">Ano: </span> {{proposicao.ano}} </div>
                    <div style="margin-bottom:5px"><span class="text-weight-bold text-grey-9">Situação:</span>{{proposicao.statusProposicao.descricaoSituacao}}</div>
                
                    <div class="row justify-end"><q-btn color="primary" rounded no-caps label="Ver detalhes" @click="verDetalhes(proposicao)"  text-color="white" /> </div> 
                </div>
            </div>
        </div>
    </q-page>
</template>
<script>
const SELECT_ITEMS = [ 15,30, 50, 100];
const UFs =[
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
export default {
  data () {
    return {
        tab:'deputados',
        proposicoesDetalhadas:[],
        coracoesFavoritos:[]
    }
  },
  computed:{
  
  },
    methods:{
        verDetalhes(proposicao){
            this.$router.push({name:'Proposicao', params:{proposicao:proposicao}})
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
        informacaoDeputado(deputadoEscolhido){
            return this.$store.dispatch("dadosAbertos/informacaoDeputado",deputadoEscolhido)
        },
           salvarProposicaoFavoritos(index){
    //Salvar IDs para pesquisa rápida
    //Salvar proposicões para utilizar na página Favoritos (delimitar qtde?)
     
      this.coracoesFavoritos[index]['situacao'] = !this.coracoesFavoritos[index]['situacao']

      let proposicao = this.proposicoesDetalhadas[index];
      let proposicoes = this.$q.localStorage.getItem('proposicoesFavoritos');
      let ids = this.$q.localStorage.getItem('ID_proposicoesFavoritos');
    if(!ids.includes(proposicao.id)){ //Incluir Favoritos
        proposicoes.push(proposicao);
        ids.push(proposicao.id);
    }else{// Excluir Favoritos
        let retirarID = ids;
        let retirarProposicao = proposicoes;
        retirarID.forEach((idRemover,index) =>{ 
            if(idRemover === proposicao.id){
                ids.splice(index,1)
            }
        })
        retirarProposicao.forEach((proposicaoRemover,index)=>{
            if(proposicaoRemover.id === proposicao.id){
                proposicoes.splice(index,1)
            }
        })
    }
   
    this.$q.localStorage.set('ID_proposicoesFavoritos',ids)
    this.$q.localStorage.set('proposicoesFavoritos',proposicoes)
   
   },
    verificarCoracao(){
       let proposicoesFavoritos = this.$q.localStorage.getItem('ID_proposicoesFavoritos');
        this.proposicoesDetalhadas.forEach(element =>{
            if(proposicoesFavoritos.includes(element.id)){
                this.coracoesFavoritos.push({id:element.id,situacao:true})
            }else{
                this.coracoesFavoritos.push({id:element.id,situacao:false})
            }      
        }) 
   },
  },
    watch:{
        proposicoesDetalhadas:function(val){
            console.log(val);          
            this.coracoesFavoritos=[]
            this.verificarCoracao()
        }
    },
    beforeMount(){
        if(this.$q.localStorage.getItem('proposicoesFavoritos')){
                this.proposicoesDetalhadas = this.$q.localStorage.getItem('proposicoesFavoritos')
                this.verificarCoracao()
            }
    },
    mounted(){
       
    }
}
</script>
<style >

</style>

