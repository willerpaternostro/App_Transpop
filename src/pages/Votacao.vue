<template>
  <q-page v-show="mostrarTela">
      <div v-if="evento"> 
        <q-video
          v-if="evento['urlRegistro']"
         :ratio="16/9"
          :src="urlVideo"
        />
      </div>
      <!-- PROPOSIÇÃO -->
       <q-expansion-item
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            label="Proposição Citada"
            class="full-width  text-white text-center bg-gradient"
            style=" ;margin-top:15px; font-size:20px"
        >
        <div  class="row bg-white text-grey-9 text-left" style="font-size:16px">
          <div v-if="votacaoDetalhes['descUltimaAberturaVotacao'] || votacaoDetalhes['descricao'] " class="col-12 bg-yellow-3 text-center text-weight-bold">
            {{votacaoDetalhes['descUltimaAberturaVotacao']?votacaoDetalhes['descUltimaAberturaVotacao']:votacaoDetalhes['descricao']}}
          </div>
         
          <div v-if="proposicaoCitada['urlInteiroTeor']" class="col-12 " style="padding:10px 0px 5px 0px">
            <q-btn 
              no-caps 
              type="a" :href="proposicaoCitada['urlInteiroTeor']" target="_blank" 
              label="Ver proposição citada" 
              color="primary"
            />
          </div>
          <div v-if="votacaoDetalhes['siglaOrgao']" class="col-12 " style="padding:5px 0px 5px 0px">
            <span class="text-weight-bold">Órgão de votação:</span>  {{votacaoDetalhes['siglaOrgao']}}
          </div>
         
          <div v-if="votacaoDetalhes['descricao']" class="col-12 " style="padding:5px 0px 5px 0px">
            <span v-if="votacaoDetalhes['descricao']" class="text-weight-bold">
              Descrição Votação:
            </span>  
            {{votacaoDetalhes['descricao']?votacaoDetalhes['descricao']:''}}
          </div>
          <div v-if="votacaoDetalhes['ultimaApresentacaoProposicao']" class="col-12 " style="padding:5px 0px 5px 0px">
            <span v-if="votacaoDetalhes['ultimaApresentacaoProposicao']['descricao']" class="text-weight-bold">
              Descrição Proposição Citada:
            </span>  
            {{votacaoDetalhes['ultimaApresentacaoProposicao']['descricao']?votacaoDetalhes['ultimaApresentacaoProposicao']['descricao']:''}}
          </div>

          <div v-if="proposicoesAfetadas" >
            <div class="text-weight-bold" style="margin-top:10px" v-if="proposicoesAfetadas.length > 0">Proposições Afetadas</div> 
             <!-- Enviar para página de Proposicao--> 
            <q-btn 
              @click="verProposicaoAfetada(prop['uri'])"
              v-for="(prop,index) in proposicoesAfetadas"
              :key="index"
              color="red"  
              rounded 
              :label="prop['siglaTipo'] + '/' + prop['id']"
              style="margin-top:10px" 
            />
          </div>
        </div>
        </q-expansion-item>
      <!-- Votos Deputados --> 
      <q-expansion-item
        v-if="mostrarVotosDeputados"
        default-opened
        expand-separator
        icon=""
        expanded-icon="fas fa-chevron-down"
        expand-icon="fas fa-chevron-right"
        expand-icon-class="text-white"
        label="Voto dos Deputados"
        class="full-width  text-white text-center bg-gradient"
        style="margin-top:15px; font-size:20px"
      >

        <div class="bg-white text-grey-9">
        <div class="row justify-center">  
          <div class="col-12">
          <apexchart 
            type="pie" 
            :options="optionsGraficoDeputados" 
            :series="seriesGraficoDeputados"
          ></apexchart>
          </div>
        </div>
        <!-- DEPUTADOS FAVORÁVEIS --> 
          <q-expansion-item
            expand-separator
            icon="fas fa-check-circle"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Deputados à favor"
            class="full-width  text-grey-9 text-center"
            style="margin-top:15px; font-size:20px"
          >
             <q-input 
              @input="filtrarDeputadosFavoraveis"
              style="padding:6px" 
              filled 
              v-model="procurarDeputadoVotoSim" 
              label="Procure um candidato .." />
       
            <q-list dense v-if="deputadosFavoraveis">
              <q-item v-for="(deputadoFavoravel,index) in filtroDeputadosFavoraveis" :key="index">
                <q-item-section top avatar>
                  <img height="60px" width="60px" :src="deputadoFavoravel['deputado_']['urlFoto']" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="">{{deputadoFavoravel['deputado_']['nome']}}</q-item-label>
                  <q-item-label caption>Partido:{{deputadoFavoravel['deputado_']['siglaPartido']+' - '+deputadoFavoravel['deputado_']['siglaUf']}}</q-item-label>
                </q-item-section>

                <q-item-section side >
                  <q-item-label style="font-size:16px">Voto</q-item-label>
                  <q-badge color="positive" text-color="white" label="Sim" />
                </q-item-section>
              </q-item>  
            </q-list> 
          </q-expansion-item>
        <!-- DEPUTADOS CONTRA --> 
         <q-expansion-item
            expand-separator
            icon="fas fa-times-circle"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Deputados contra"
            class="full-width  text-grey-9 text-center"
            style="margin-top:15px; font-size:20px"
        > 
         <q-input 
         @input="filtrarDeputadosContrarios"
          style="padding:6px" 
          filled 
          v-model="procurarDeputadoVotoNao" 
          label="Procure um candidato .." 
         />
         <q-list dense v-if="deputadosContrarios">
              <q-item v-for="(deputadoContrario,index) in filtroDeputadosContrarios" :key="index">
                <q-item-section top avatar>
                  <img height="60px" width="60px" :src="deputadoContrario['deputado_']['urlFoto']" />
                </q-item-section>

                <q-item-section class="text-left">
                  <q-item-label >{{deputadoContrario['deputado_']['nome']}}</q-item-label>
                  <q-item-label caption>Partido:{{deputadoContrario['deputado_']['siglaPartido']+' - '+deputadoContrario['deputado_']['siglaUf']}}</q-item-label>
                </q-item-section>

                 <q-item-section side >
                  <q-item-label style="font-size:16px">Voto</q-item-label>
                  <q-badge color="red" text-color="white" label="Não" />
                </q-item-section>
              </q-item>  
            </q-list> 
        </q-expansion-item>
        <!-- DEPUTADOS ABSTENÇÕES --> 
          <q-expansion-item
            expand-separator
            icon="fas fa-grip-lines"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Abstenções / Outros"
            
            class="full-width text-grey-9  text-center "
            style="margin-top:15px; font-size:20px"
        > 
          <q-list dense v-if="deputadosAbstencao" >
              <q-item v-for="(deputadoAbsteve,index) in deputadosAbstencao" :key="index">
                <q-item-section top avatar>
                  <img height="60px" width="60px" :src="deputadoAbsteve['deputado_']['urlFoto']" />
                </q-item-section>

                <q-item-section class="text-left">
                  <q-item-label >{{deputadoAbsteve['deputado_']['nome']}}</q-item-label>
                  <q-item-label caption>Partido:{{deputadoAbsteve['deputado_']['siglaPartido']+' - '+deputadoAbsteve['deputado_']['siglaUf']}}</q-item-label>
                </q-item-section>

                <q-item-section side >
                  <q-item-label caption>Voto:</q-item-label>
                  <q-badge color="red" text-color="white" label="Não" />
                </q-item-section>
              </q-item>  
            </q-list> 
        
        </q-expansion-item>
        </div>
      </q-expansion-item> 
      <!-- Orientão partidos --> 
        <q-expansion-item
          v-if="mostrarVotosPartidos"
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            label="Orientação dos Partidos"
            class="full-width  text-white text-center bg-gradient"
            style="margin-top:15px; font-size:20px; margin-bottom:80px"
        >
        <div class="bg-white text-grey-9">
          <apexchart 
            type="donut" 
            :options="optionsGraficoPartidos" 
            :series="seriesGraficoPartidos"
          ></apexchart>
          <q-expansion-item
            expand-separator
            icon="fas fa-check-circle"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Partidos à favor"
            class="full-width  text-grey-9 text-center"
            style="margin-top:15px; font-size:20px"
          >
            <q-list dense v-if="partidosFavoraveis">
              <q-item v-for="(partidoFavoravel,index) in partidosFavoraveis" :key="index">
                <q-item-section top avatar>
                  <q-chip>  {{partidoFavoravel['siglaPartidoBloco']}} </q-chip>
                </q-item-section>
                <q-item-section style="font-size:16px" class="text-right">
                  <q-item-label >Orientação: <q-badge color="positive" text-color="white">{{partidoFavoravel['orientacaoVoto']}}</q-badge></q-item-label>
                </q-item-section>

              </q-item>  
            </q-list> 
          </q-expansion-item>
         <q-expansion-item
            expand-separator
            icon="fas fa-times-circle"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Partidos contra"
            class="full-width  text-grey-9 text-center "
            style="margin-top:15px; font-size:20px"
        > 
         <q-list dense v-if="partidosContrarios">
            <q-item v-for="(partidoContrario,index) in partidosContrarios" :key="index">
                <q-item-section top avatar>
                  <q-chip>{{partidoContrario['siglaPartidoBloco']}}</q-chip>
                </q-item-section>
                <q-item-section style="font-size:16px" class="text-right">
                  <q-item-label class="">Orientação:  <q-badge color="red" text-color="white">{{partidoContrario['orientacaoVoto']}}</q-badge></q-item-label>
                </q-item-section>

              </q-item>  
            </q-list> 
        </q-expansion-item> 
          <q-expansion-item
            expand-separator
            icon="fas fa-grip-lines"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Abstenções / Outros"
            class="full-width  text-grey-9 text-center"
            style="margin-top:15px; font-size:20px"
        > 
            <q-list dense v-if="partidosAbstencao">
            <q-item v-for="(partidoAbsteve,index) in partidosAbstencao" :key="index">
                <q-item-section top avatar>
                <q-chip>  {{partidoAbsteve['siglaPartidoBloco']}} </q-chip>
                </q-item-section>
              </q-item>  
            </q-list> 
        </q-expansion-item>
        </div>
      </q-expansion-item> 
      <!-- VOTAÇÃO POPULAR  
        <q-expansion-item
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            label="Votação Popular"
            class="full-width  text-white text-center bg-gradient"
            style="margin-top:15px; font-size:20px;margin-bottom:60px"
        >
        <div class="bg-white text-grey-9">
          
        </div>
      </q-expansion-item>
      -->
  </q-page>
</template>
<script>
const config = { headers: { 'Content-Type': 'application/json' } };
import { axiosInstance } from 'boot/axios'
import {Axios} from 'boot/axios'
import { QSpinnerCube } from 'quasar';
import VueApexCharts from 'vue-apexcharts'

export default {
  components:{'apexchart': VueApexCharts },
  data () {
    return {
      //Gráfico Deputados
      optionsGraficoDeputados:{
        colors:['#002776', '#f44336', '#999999'],
        labels: ['Votos Sim', 'Votos Não', 'Abstenções'],
        title:{
          text:'Votos dos Deputados',
          align: 'left',
        },
        chart:{
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              customIcons: []
            },
            export: {
              png: {
                filename: undefined,
              }
            } 
          }
        }
      },
      seriesGraficoPartidos:null,
      //Gráfico Partidos
       optionsGraficoPartidos:{
        colors:['#002776', '#f44336', '#999999'],
        labels: ['Votos Sim', 'Votos Não', 'Abstenções'],
        title:{
          text:'Orientação dos Partidos',
          align: 'left',
        },
        chart:{
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              customIcons: []
            },
            export: {
              png: {
                filename: undefined,
              }
            } 
          }
        }
      },
      seriesGraficoDeputados:null,
      mostrarTela:false,
      procurarDeputadoVotoSim:'',
      procurarDeputadoVotoNao:'',
      votacao:[],
      votacaoDetalhes:[],

      evento:[],
      urlVideo:[],
      proposicaoCitada:'',
      proposicoesAfetadas: [],

      deputadosFavoraveis:[],
      filtroDeputadosFavoraveis:[],
      
      deputadosContrarios:[],
      filtroDeputadosContrarios:[],

      deputadosAbstencao:[],

      partidosFavoraveis:[],
      partidosContrarios:[],
      partidosAbstencao:[],

      mostrarVotosDeputados:false,
      mostrarVotosPartidos:false,
    }
  },
 
  methods:{
    filtrarDeputadosFavoraveis(){
      if(this.procurarDeputadoVotoSim.length == 0){
        this.filtroDeputadosFavoraveis = this.deputadosFavoraveis
      }
      if(this.procurarDeputadoVotoSim.length > 0){
        let conteudo = this.procurarDeputadoVotoSim.toUpperCase()
        this.filtroDeputadosFavoraveis = this.deputadosFavoraveis.filter( element => {
          let nomeDeputado = element.deputado_.nome?element.deputado_.nome.toUpperCase():""
          if(nomeDeputado.includes(conteudo))
            return true
          else
            return false
        })
      }
    },
    filtrarDeputadosContrarios(){
       if(this.procurarDeputadoVotoNao.length == 0){
        this.filtroDeputadosContrarios = this.deputadosContrarios
      }
      if(this.procurarDeputadoVotoNao.length > 0){
        let conteudo = this.procurarDeputadoVotoNao.toUpperCase()
        this.filtroDeputadosContrarios =  this.deputadosContrarios.filter( element => {
          let nomeDeputado = element.deputado_.nome?element.deputado_.nome.toUpperCase():""
          if(nomeDeputado.includes(conteudo))
            return true
          else
            return false
        })
      }
    },

    resolve(){
      this.$q.loading.show({
        backgroundColor:"dark",
        spinnerSize:'80px',
        spinner:QSpinnerCube,
        message:"Carregando ..."
      })
      Promise.allSettled([
        this.procurarEventoPromisse(), 
        this.procurarDetalhesVotacaoPromisse(this.votacao['uri']), 
        this.procurarVotosPromisse(this.votacao['uri']), 
        this.procurarOrientacaoPartidoPromisse(this.votacao['uri'])
      ]).then((response) => {
          console.log(response);
          this.mostrarTela = true
          this.$q.loading.hide()
          // Evento --> response[0] 
          if(response[0]['value'])
            this.resolverEvento(response[0]['value'])
          // Detalhes Votação  --> response[1]
          if(response[1]['value'])
            this.resolverDetalhesVotacao(response[1]['value'])
          //VOTOS --> response[2] 
          if(response[2]['value'])
            this.resolverVotos(response[2]['value'])
          //Orientação Partido
          if(response[3]['value'])
          this.resolverOrientacaoPartido(response[3]['value'])          
        }).catch(erro => {   
            this.mostrarTela = true
            this.$q.loading.hide()
            console.log(erro)
          });
    },
    resolverEvento(response){
      if(response.data.dados.urlRegistro){
         this.evento = response.data.dados
        let complementoUrl = response.data.dados.urlRegistro.split('watch?v=')
        this.urlVideo = 'https://www.youtube.com/embed/'+complementoUrl[1]
      }
     
    },
    async procurarEventoPromisse(){
      let url = this.votacao['uriEvento']
      if(url){
        const response = await Axios.get(url,config)
        return response
      }
    },
    resolverDetalhesVotacao(response){
      this.votacaoDetalhes = response.data.dados
      console.log("DETALHES VOTAçÃO");
      console.log(this.votacaoDetalhes);
      if(this.votacaoDetalhes['ultimaApresentacaoProposicao']['uriProposicaoCitada']){
        let uri = this.votacaoDetalhes['ultimaApresentacaoProposicao']['uriProposicaoCitada']
        this.procurarProposicaoCitada(uri) 
        this.proposicoesAfetadas = this.votacaoDetalhes['proposicoesAfetadas']
      }
    },
    async procurarDetalhesVotacaoPromisse(url){
      const response = await Axios.get(url,config)
      return response
    },
    async procurarProposicaoCitada(url){
      console.log("RESOLVER PROPOSICAO ");
      const response = await Axios.get(url,config)
      this.proposicaoCitada = response.data.dados
      console.log("PROPOSIÇÃO CITADA");
      return response
    },
    resolverVotos(response){
        let todosVotos = response.data.dados
        console.log(todosVotos)
          if(Array.isArray(todosVotos)){
            if(todosVotos.length > 0){
              this.mostrarVotosDeputados = true
              this.deputadosFavoraveis = todosVotos.filter(element =>{
              return element['tipoVoto'] == 'Sim'
              })
              this.filtroDeputadosFavoraveis = this.deputadosFavoraveis
              
              this.deputadosContrarios = todosVotos.filter(element => {
                return element['tipoVoto'] == 'Não'
              })
              this.filtroDeputadosContrarios = this.deputadosContrarios

              this.deputadosAbstencao = todosVotos.filter(element => {
                return (element['tipoVoto'] != 'Sim' && element['tipoVoto'] != 'Não')
              })

              this.seriesGraficoDeputados = []
              let numeroFavoraveis = this.deputadosFavoraveis?this.deputadosFavoraveis.length:0
              let numeroNaoFavoraveis = this.deputadosContrarios?this.deputadosContrarios.length:0
              let numeroAbstencoes = this.deputadosAbstencao?this.deputadosAbstencao.length:0
              this.seriesGraficoDeputados.push(numeroFavoraveis)
              this.seriesGraficoDeputados.push(numeroNaoFavoraveis)
              this.seriesGraficoDeputados.push(numeroAbstencoes)
              
            }
          }
    },
    async procurarVotosPromisse(url){
      if(url){
        const response = await Axios.get(url+'/votos',config)
        return response
      }
    },
    resolverOrientacaoPartido(response){  
        let todosVotos = response.data.dados
        if(Array.isArray(todosVotos)){
          if(todosVotos.length > 0){
            this.mostrarVotosPartidos = true;
            this.partidosFavoraveis = todosVotos.filter(element =>{
            return element['orientacaoVoto'] == 'Sim'
            })
            this.partidosContrarios = todosVotos.filter(element => {
              return element['orientacaoVoto'] == 'Não'
            })
            this.partidosAbstencao = todosVotos.filter(element => {
              return (element['orientacaoVoto'] != 'Sim' && element['orientacaoVoto'] != 'Não')
            })

             this.seriesGraficoPartidos = []
              let numeroFavoraveis = this.partidosFavoraveis?this.partidosFavoraveis.length:0
              let numeroNaoFavoraveis = this.partidosContrarios?this.partidosContrarios.length:0
              let numeroAbstencoes = this.partidosAbstencao?this.partidosAbstencao.length:0
              this.seriesGraficoPartidos.push(numeroFavoraveis)
              this.seriesGraficoPartidos.push(numeroNaoFavoraveis)
              this.seriesGraficoPartidos.push(numeroAbstencoes)
          }
        }
    },
    async procurarOrientacaoPartidoPromisse(url){
      if(url){
        const response = await Axios.get(url+'/orientacoes',config)
        return response
      }
    },
    async verProposicaoAfetada(url){
      const proposicao = await Axios.get(url,config).then((res) =>{
        console.log("ver proposicao");
        console.log(res);
        this.$router.push({name:'Proposicao', params:{proposicao:res.data.dados}})
      }).catch((erro)=>{
        console.log(erro);
      })
    }
  },
  watch:{

  },
  beforeMount(){
    console.log(this.$route.params);
    if(this.$route.params.votacao){
        this.votacao = this.$route.params.votacao
        this.$q.localStorage.set('ultimaVotacaoVista',this.votacao)
        this.resolve(this.votacao)
    }else{
      this.votacao = this.$q.localStorage.getItem('ultimaVotacaoVista')
      this.resolve(this.votacao)
    }
  },
  mounted(){
  
  }
   
}
</script>
<style >

</style>