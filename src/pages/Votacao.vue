<template>
  <q-page >
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
            class="full-width  text-white text-center "
            style=" background-image: linear-gradient(to bottom right, green,yellow );margin-top:15px; font-size:20px"
        >
        <div  class="row bg-white text-grey-9 text-left" style="font-size:16px">
          <div v-if="votacaoDetalhes['descUltimaAberturaVotacao']" class="col-12 bg-yellow-3 text-center text-weight-bold">
            {{votacaoDetalhes['descUltimaAberturaVotacao']}}
          </div>
          <div v-if="proposicaoCitada['urlInteiroTeor']" class="col-12 " style="margin-top:10px;margin-bottom:10px">
          <q-btn 
            no-caps 
            type="a" :href="proposicaoCitada['urlInteiroTeor']" target="_blank" 
            label="Inteiro teor proposição citada" 
            color="primary"
          />  
          </div>
          <div v-if="proposicaoCitada['urlInteiroTeor']" class="col-12 " style="margin-bottom:10px">
            <q-btn 
              no-caps 
              type="a" :href="proposicaoCitada['urlInteiroTeor']" target="_blank" 
              label="Ver proposição citada" 
              color="positive"
            />
          </div>
          <div v-if="votacaoDetalhes['siglaOrgao']" class="col-12 ">
            <span class="text-weight-bold">Órgão de votação:</span>  {{votacaoDetalhes['siglaOrgao']}}
          </div>
         
          <div v-if="votacaoDetalhes['ultimaApresentacaoProposicao']" class="col-12 ">
            <span class="text-weight-bold">Descrição Proposição:</span>  
            {{votacaoDetalhes['ultimaApresentacaoProposicao']['descricao']?votacaoDetalhes['ultimaApresentacaoProposicao']['descricao']:''}}
          </div>

          <div v-if="proposicoesAfetadas"> 
            <q-tree
              :nodes="proposicoesAfetadas"
              node-key="label"
              accordion
            >
              <template v-slot:default-header="prop" >
                <div class="row items-center">
                  <div style="font-size:16px" class="text-weight-bold text-grey-9">{{ prop.node.label }}</div>
                </div>
              </template>

              <template v-slot:default-body="prop">
                <div style="font-size:14px" v-if="prop.node.story">
                 {{prop.node.story }}
                </div>
           </template>
          
            </q-tree>
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
        class="full-width  text-white text-center "
        style=" background-image: linear-gradient(to bottom right, green,yellow );margin-top:15px; font-size:20px"
      >
        <div class="bg-white text-grey-9">
          <q-expansion-item
            expand-separator
            icon="fas fa-check-circle"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Deputados à favor"
            class="full-width  text-grey-9 text-center "
            style="margin-top:15px; font-size:20px"
          >
            <q-list dense v-if="deputadosFavoraveis">
              <q-item v-for="(deputadoFavoravel,index) in deputadosFavoraveis" :key="index">
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
         <q-expansion-item
            expand-separator
            icon="fas fa-times-circle"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Deputados contra"
            class="full-width  text-grey-9 text-center "
            style="margin-top:15px; font-size:20px"
        > 
         <q-input style="padding:6px" outlined v-model="nomeDeputadoVotoSim" label="Procure um candidato .." />
         <q-list dense v-if="deputadosContrarios">
              <q-item v-for="(deputadoContrario,index) in deputadosContrarios" :key="index">
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
          <q-expansion-item
            expand-separator
            icon="fas fa-grip-lines"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Abstenções / Outros"
            class="full-width  text-grey-9 text-center "
            style="margin-top:15px; font-size:20px"
        > 
          <q-list dense v-if="deputadosAbstencao">
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
            class="full-width  text-white text-center "
            style=" background-image: linear-gradient(to bottom right, green,yellow );margin-top:15px; font-size:20px"
        >
        <div class="bg-white text-grey-9">
          <q-expansion-item
            expand-separator
            icon="fas fa-check-circle"
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-grey-9"
            label="Partidos à favor"
            class="full-width  text-grey-9 text-center "
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
            class="full-width  text-grey-9 text-center "
            style="margin-top:15px; font-size:20px"
        > 
            <q-list dense v-if="partidosAbstencao">
            <q-item v-for="(partidoAbsteve,index) in partidosAbstencao" :key="index">
                <q-item-section top avatar>
                  {{partidoAbsteve['siglaPartidoBloco']}}
                </q-item-section>
                <q-item-section>
                  <q-item-label class="">Orientação:{{partidoAbsteve['orientacaoVoto']}}</q-item-label>
                </q-item-section>

              </q-item>  
            </q-list> 
        </q-expansion-item>
        </div>
      </q-expansion-item> 
      <!-- VOTAÇÃO POPULAR  -->
        <q-expansion-item
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            label="Votação Popular"
            class="full-width  text-white text-center "
            style=" background-image: linear-gradient(to bottom right, green,yellow );margin-top:15px; font-size:20px"
        >
        <div class="bg-white text-grey-9">
          
        </div>
      </q-expansion-item>
  </q-page>
</template>
<script>
const config = { headers: { 'Content-Type': 'application/json' } };
import { axiosInstance } from 'boot/axios'
import {Axios} from 'boot/axios'

export default {
  data () {
    return {
        nomeDeputadoVotoSim:'',
        votacao:[],
        votacaoDetalhes:[],
        evento:[],
        urlVideo:[],
        proposicaoCitada:'',
        proposicoesAfetadas: [
        {
          label: 'Proposições Afetadas',
          header: 'root',
          children: []
        }
      ],
      deputadosFavoraveis:[],
      deputadosContrarios:[],
      deputadosAbstencao:[],

      partidosFavoraveis:[],
      partidosContrarios:[],
      partidosAbstencao:[],

      mostrarVotosDeputados:false,
      mostrarVotosPartidos:false,
    }
  },
  methods:{
    procurarEvento(){
      let url = this.votacao['uriEvento']
      console.log("EVENTOO VIDEO");   
      console.log(url);
      if(url){
        Axios.get(url,config).then((response) =>{
        console.log("EVENTOO VIDEO");
        console.log(response.data);
        this.evento = response.data.dados

        let complementoUrl = response.data.dados.urlRegistro.split('watch?v=')
        console.log(complementoUrl);
        this.urlVideo = 'https://www.youtube.com/embed/'+complementoUrl[1]
        console.log(this.urlVideo);
        }).catch(erro =>{

            console.log(erro);
        })
       }
    },
    procurarDetalhesVotacao(url){
      Axios.get(url,config).then((response) =>{
        console.log(response);
        this.votacaoDetalhes = response.data.dados
        if(this.votacaoDetalhes['ultimaApresentacaoProposicao']['uriProposicaoCitada']){
          let uri = this.votacaoDetalhes['ultimaApresentacaoProposicao']['uriProposicaoCitada']
          this.procurarProposicao(uri) 
          this.votacaoDetalhes['proposicoesAfetadas'].forEach(element => {
              let proposicao = {
                label: element.siglaTipo +'/'+ element.numero,
              }
            this.proposicoesAfetadas[0].children.push(proposicao)
          });
        }
      }).catch(erro =>{
          console.log(erro);
      })
    },
    procurarProposicao(url){
      Axios.get(url,config).then((response) =>{
        console.log(response);
        this.proposicaoCitada = response.data.dados
      }).catch(erro =>{
          console.log(erro);
      })
    },
    procurarVotos(url){
      if(url){
        Axios.get(url+'/votos',config).then((response) =>{
        let todosVotos = response.data.dados
          if(Array.isArray(todosVotos)){
            if(todosVotos.length > 0){
              this.mostrarVotosDeputados = true
              this.deputadosFavoraveis = todosVotos.filter(element =>{
              return element['tipoVoto'] == 'Sim'
              })
              this.deputadosContrarios = todosVotos.filter(element => {
                return element['tipoVoto'] == 'Não'
              })
              this.deputadosAbstencao = todosVotos.filter(element => {
                return (element['tipoVoto'] != 'Sim' && element['tipoVoto'] != 'Não')
              })
            }
          }
        }).catch(erro =>{
            console.log(erro);
        })
      }
    },
    procurarOrientacaoPartido(url){
      if(url){
        Axios.get(url+'/orientacoes',config).then((response) =>{
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
          }
        }
        }).catch(erro =>{
            console.log(erro);
        })
      }
    
    }
  },
  watch:{

  },
  beforeMount(){
    console.log(this.$route.params);
    if(this.$route.params.votacao){
        this.votacao = this.$route.params.votacao
        this.procurarEvento()
        this.procurarDetalhesVotacao(this.votacao['uri'])
        this.procurarVotos(this.votacao['uri'])
        this.procurarOrientacaoPartido(this.votacao['uri'])
    }
  },
  mounted(){
    
  }
   
}
</script>
<style >

</style>