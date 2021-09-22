<template>
  <q-page >
    <q-expansion-item
      style="margin-bottom:20px"
      expand-separator
      expand-icon="fas fa-filter"
      label="Clique aqui para Pesquisa avançada"
      class="text-weight-bold bg-yellow-2"
    >
       <div class="bg-grey-2">
        <br> 
          <q-input outlined v-model="filtro_autor" label="Autor da proposição" /><br>
          <q-input outlined v-model="filtro_ano" mask="####" label="Ano de criação" /><br>
    
          <q-select outlined v-model="filtro_siglaTipo" :options="options_siglaTipo" label="Tipo da proposição" /><br>
          <q-select outlined v-model="filtro_codTema" :options="options_categorias" label="Categoria" /><br>
      
          <q-select outlined v-model="filtro_itens" :options="options_itens" label="itens"  /><br>
            <div class="row justify-end" style="padding-bottom:16px">
              <q-btn @click="pesquisaComFiltro" color="dark" label="Pesquisar" no-caps />
            </div>    
       </div>
    </q-expansion-item>
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
    <div class="text-black text-h6 text-grey-7" v-if="msgSemResultado">Nenhum resultado encontrado</div>
  </q-page>
</template>
<script>
import { axiosInstance } from 'boot/axios'
import {Axios} from 'boot/axios'
  const config = { headers: { 'Content-Type': 'application/json' } };
  const CATEGORIAS_Nomes = [ //https://dadosabertos.camara.leg.br/api/v2//referencias/proposicoes/codTema
    'Economia',
    'Educação',
    'Saúde',
    'Turismo',
    'Comunicações',
    'Direito e Justiça',
    'Esporte e Lazer',
    'Defesa e Segurança',
    'Estrutura Fundiária',
    'Administração Pública',
    'Direito Constitucional',
    'Trabalho e Emprego',
    'Arte, Cultura e Religião',
    'Viação, Transporte e Mobilidade',
    'Ciências Sociais e Humanas',
    'Finanças Públicas e Orçamento',
    'Direitos Humanos e Minorias',
    'Ciência, Tecnologia e Inovação',
    'Indústria, Comércio e Serviços',
    'Direito Civil e Processual Civil',
    'Previdência e Assistência Social',
    'Direito e Defesa do Consumidor',
    'Homenagens e Datas Comemorativas',
    'Política, Partidos e Eleições',
    'Direito Penal e Processual Penal',
    'Ciências Exatas e da Terra',
    'Cidades e Desenvolvimento Urbano',
    'Processo Legislativo e Atuação Parlamentar',
    'Energia, Recursos Hídricos e Minerais',
    'Agricultura, Pecuária, Pesca e Extrativismo',
    'Relações Internacionais e Comércio Exterior',
    'Meio Ambiente e Desenvolvimento Sustentável',   
  ]
  const CATEGORIAS_COD = [
    40,
    46,
    56,
    60,
    37,
    76,
    39,
    57,
    51,
    34,
    68,
    58,
    35,
    61,
    86,
    70,
    44,
    62,
    66,
    42,
    52,
    67,
    72,
    74,
    43,
    85,
    41,
    53,
    54,
    64,
    55,
    48,
  ]
  const SIGLA_TIPO = [ 
    'PL  - Projeto de Lei',
    'PLP - Projeto de Lei Complementar',
    'PEC - Proposta de Emenda à Constituição',
    'MPV - Medida Provisória',
    'PLV - Projeto de Lei de Conversão',
    'PDL - Projeto de Decreto Legislativo',
    'PRC - Projeto de Resolução',
    'REQ - Requerimento',
    'RIC - Requerimento de Informação',
    'Outros'
  ]
  const SELECT_ITEMS = [ 15,30, 50, 100];
export default {
  data () {
    return {
      consultaInicial:'', //Quando vem de ListaCategorias
      proposicoes:[],
      proposicoesDetalhadas:[],

      msgSemResultado:false,
     
    //FILTROS PESQUISA AVANÇADA
      filtro_autor:'',
      filtro_ano:'',
      filtro_dataInicio:'',
      filtro_dataFim:'',
      filtro_siglaTipo:'',
      filtro_codTema:'',
  
      filtro_itens:'',
    //SELECTS
      options_siglaTipo:SIGLA_TIPO,
      options_categorias:CATEGORIAS_Nomes,
      options_itens:SELECT_ITEMS,

      codigoCategoria:CATEGORIAS_COD,

       coracoesFavoritos:[]
    }
  },
  computed:{

  },
  methods:{
    pesquisaComFiltro(){
        let consulta= ''   
        if(this.filtro_itens)
            consulta = "?itens="+this.filtro_itens
        else
            consulta = "?itens=15"
    
        //filtro_autor
        if(this.filtro_autor){consulta = consulta + "&autor=" + this.filtro_autor}
         //filtro_ano
        if(this.filtro_ano){consulta = consulta + "&ano=" + this.filtro_ano}

        //filtro_siglaTipo
        if(this.filtro_siglaTipo){
          this.filtro_siglaTipo = this.filtro_siglaTipo.split('-')[0]
          console.log(this.filtro_siglaTipo);
          consulta = consulta + "&siglaTipo=" + this.filtro_siglaTipo
        }
        //filtro_codTema
        if(this.filtro_codTema){
          let indexCodCategoria = this.options_categorias.findIndex(element => {return element == this.filtro_codTema})
          consulta = consulta + "&codTema=" +this.codigoCategoria[indexCodCategoria]
        }

        this.requisitarProposicoes(consulta)
    },
    async requisitarProposicoes(consulta){  
      await axiosInstance.get("proposicoes"+consulta,config).then((response) =>{
        let resultado = response.data.dados
        this.proposicoes = resultado
        this.proposicoesDetalhadas = []
      
        if(Array.isArray(resultado)){
          if(resultado.length > 0){
            this.msgSemResultado = false
            resultado.forEach(element => {
              if(element.uri){ 
                Axios.get(element.uri,config).then((response) =>{
                  console.log(response.data.dados)
                  this.proposicoesDetalhadas.push(response.data.dados)
                  this.$q.localStorage.set('ultimaPesquisaProposicoes',this.proposicoesDetalhadas);
                }).catch((erro)=>{
                  console.log(erro)
                })
              }
            })
          }else{
            this.msgSemResultado = true
          }
        }
        }).catch((erro)=>{
          console.log(erro)
          this.msgSemResultado = false
        })
    },
    verDetalhes(proposicao){
       this.$router.push({name:'Proposicao', params:{proposicao:proposicao}})
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
          console.log(Array.isArray(val));          
          this.coracoesFavoritos=[]
          this.verificarCoracao()
    }
  },
  beforeMount(){
    if(!this.$q.localStorage.getItem('ultimaPesquisaProposicoes')){
      if(this.$route.params){
        this.consultaInicial = this.$route.params.consulta
        this.filtro_siglaTipo = this.$route.params.filtroA
        this.filtro_codTema = this.$route.params.filtroB
        this.requisitarProposicoes(this.consultaInicial)
        this.$q.localStorage.set('ultimosAutoresProposicoes',[])
      }
    }else{
      let ultimasProposicoes = this.$q.localStorage.getItem('ultimaPesquisaProposicoes')
      if(ultimasProposicoes.length > 0){
        this.proposicoesDetalhadas = ultimasProposicoes
      }
    }  
 },
 mounted(){

 }

}
</script>
<style >
.itemProposicoes{
    padding: 20px 0px 20px 0px  !important;
}
</style>

