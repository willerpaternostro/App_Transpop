<template>
    <q-page >
      <!-- PROPOSIÇÃO -->
       <q-expansion-item
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            :label="proposicao['descricaoTipo']"
            class="full-width  text-white text-center "
            style=" background-image: linear-gradient(to bottom right, green,yellow );margin-top:15px; font-size:20px"
        >
        <div class="row bg-white text-grey-9 text-left" style="font-size:16px">
          <div class="col-12 "> 
            <q-btn class="full-width" text-color="grey-9" color="yellow-3" :label="proposicao['statusProposicao']['descricaoSituacao']?proposicao['statusProposicao']['descricaoSituacao']:'Status não informado'" />
          </div>
          <div class="col-12 row justify-end" style="margin-top:10px"> 
            <q-btn type="a" :href="proposicao['urlInteiroTeor']" target="blank" text-color="white" style="background-image: linear-gradient(to bottom right, green,yellow );" label="Ver na íntegra" />
          </div>
          <div class="col-12" style="margin-top:10px"> 
            <span class="text-weight-bold">Data de apresentação:</span>
            {{new Date(Date.parse(proposicao['dataApresentacao'])).toLocaleString('pt-BR') }}
          </div>
          <div class="col-12" style="margin-top:10px"> 
            <span class="text-weight-bold">Autores:</span>
            <q-badge @click="verAutor(autor)" v-for="(autor,index) in autores" :key="index">
              {{autor['nome'] }} 
            </q-badge>
          </div>
           <div class="col-12" style="margin-top:10px"> 
            <span class="text-weight-bold">Ementa:</span>
            {{proposicao['ementa']}}
          </div>
           <div class="col-12" v-if="proposicao['ementaDetalhada']" style="margin-top:10px"> 
            <span class="text-weight-bold">Detalhes:</span>
            {{proposicao['ementaDetalhada']}}
          </div>
           <div class="col-12" style="margin-top:10px"> 
            <span class="text-weight-bold">Descrição da Tramitação:</span>
            {{proposicao['statusProposicao']['descricaoTramitacao']}}
          </div>
          <div class="col-12" v-if="ultimoRelator" style="margin-top:10px"> 
            <span class="text-weight-bold">Último Relator:</span>
            {{ultimoRelator['ultimoStatus']['nomeEleitoral']}}
          </div>
          <div class="col-12" v-if="ultimoRelator" > 
            <span class="text-weight-bold">Partido:</span>
            {{ultimoRelator['ultimoStatus']['siglaPartido'] + ' - ' + ultimoRelator['ultimoStatus']['siglaUf'] }}
          </div>
          <div class="col-12" v-if="ultimoRelator" style="margin-bottom:40px"> 
            <span v-if="ultimoRelator['ultimoStatus']['email'] " class="text-weight-bold">Email:</span>
            {{ultimoRelator['ultimoStatus']['email'] }}
          </div>
        </div>
        </q-expansion-item>
      <!-- TRAMITAÇÕES --> 
      <q-expansion-item
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            label="Tramitações"
            class="full-width  text-white text-center "
            style=" background-image: linear-gradient(to bottom right, green,yellow );margin-top:15px; font-size:20px"
        >
        <div class="bg-white text-grey-9">
          <div class="row " style="margin-top:10px;padding:10px">
            <q-tree
              :nodes="tramitacoes"
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
                 {{ prop.node.story }}
                </div>
                
              </template>
              <template v-slot:header-generic="prop">
                <div class="row items-center">
                 <q-btn v-if="prop.node.label"  @click="abrirLink(prop.node.label)" no-caps label="Ver na Íntegra" flat type="a"  :href="prop.node.label" color="orange" size="20px"  /> 
                </div>
              </template>
            </q-tree>
          </div>
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
            style=" background-image: linear-gradient(to bottom right, green,yellow );margin-top:15px; font-size:20px;margin-bottom:60px"
        >
        <div class="bg-white text-grey-9">
          <div class="row " style="margin-top:10px;padding:10px">
          <div class="text-left text-h6 col-12">Você é a favor da {{proposicao['siglaTipo'] +' '+proposicao['numero']+ '/' +proposicao['ano']}} ?</div>
          <div class="col-12 row justify-center text-grey-9">
            <div style="padding:10px">
              <q-btn @click="votar('afavor')" :outline="!botaoVotacaoFavor" label="A favor" color="positive" icon="far fa-thumbs-up" />
            </div>
            <div  style="padding:10px">
              <q-btn @click="votar('contra')" :outline="!botaoVotacaoContra" no-caps label="Contra" color="red" icon="far fa-thumbs-down" />
            </div>
          </div>
        </div>
        <div class="row " style="margin-top:40px"> 
          <div class="col-2 self-center">  <q-icon style="padding:5px" class="bg-positive" color="white" name="far fa-thumbs-up" /> </div><div class="col-10">  <q-slider label-always readonly v-model="votacaoAFavor" :min="0" :max="100" color="positive" /> </div>
          <div class="col-2 self-center"> <q-icon  style="padding:5px" class="bg-red" color="white" name="far fa-thumbs-down" /> </div> <div class="col-10"> <q-slider  label-always readonly v-model="votacaoContra" :min="0" :max="100" color="red"/> </div>
        </div>
        <div class="row" style="margin-top:40px;margin-bottom:40px">
          <div class="col-12"><span class="text-h6 ">Total:</span> <span style="font-size:20px;"> 200 votos</span> </div>
        </div>
        </div>
      </q-expansion-item>
    </q-page>
</template>
<script>
const config = { headers: { 'Content-Type': 'application/json' } };
import { Axios, axiosInstance } from 'boot/axios'

export default {
  data () {
    return {
      proposicao:'',
      ultimoRelator:'',
      autores:[],
      votacaoAFavor:24.75,
      votacaoContra:75.25,
      botaoVotacaoContra:false,
      botaoVotacaoFavor:false,
      tramitacoes: [
        {
          label: 'Todas Tramitações',
          header: 'root',
          children: []
        }
      ]
    }
  },
  methods:{
    abrirLink(dado){
      window.open(dado,'_blank')
      console.log("Abriu link")
    },
    votar(decisao){
      if(decisao == 'contra'){
        this.botaoVotacaoContra = true
        this.botaoVotacaoFavor = false
        return
      }
       if(decisao == 'afavor'){
        this.botaoVotacaoContra = false
        this.botaoVotacaoFavor = true
        return
      }
          
      
      },
    procurarUltimoRelator(){
      console.log("PROCURAR ULTIMO RELATOR");
      let url = this.proposicao['statusProposicao']['uriUltimoRelator'].split('https://dadosabertos.camara.leg.br/api/v2/')
      axiosInstance.get(url[1],config).then((response) =>{
        console.log(response);
        this.ultimoRelator = response.data.dados
      })
    },
    procurarAutores(){
       console.log("PROCURAR autores");
      let url = this.proposicao['uriAutores'].split('https://dadosabertos.camara.leg.br/api/v2/')
      axiosInstance.get(url[1],config).then((response) =>{
        console.log(response);
        response.data.dados.forEach(element => {
          this.autores.push(element)
        });
      })
    },
    procurarTramitacoes(){
       console.log("PROCURAR TRAMITAÇÕES");
      let url = this.proposicao['uri'].split('https://dadosabertos.camara.leg.br/api/v2/')
      let pesquisa = url[1]+'/tramitacoes'
      axiosInstance.get(pesquisa,config).then((response) =>{
        console.log(response);
        let todasTramitacoes = response.data.dados.sort((a, b) => {
            if (a.sequencia > b.sequencia) {
              return 1;
            }
            if (a.sequencia < b.sequencia) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
        
        if(Array.isArray(todasTramitacoes)){
    
          todasTramitacoes.forEach((element,index) => {
           let tramitacao = {
              label: element.sequencia + ' - '+element.descricaoTramitacao,
              
              children:[
                {label:'Data: '+new Date(Date.parse(element.dataHora )).toLocaleString('pt-BR') },
                {label:'Ambito: '+element.ambito},
                {label:'Órgão tramitação:' +element.siglaOrgao},
                {label:'Despacho', children:[{label:element.despacho}]},
                {label:element.url,header: 'generic',}
               
              ]
            }
            this.tramitacoes[0].children.push(tramitacao)
          })
        }
       
      })
    },
    async verAutor(autor){
      console.log("FUNÇÃO VER AUTOR");
      console.log(autor);
     
      let url = autor.uri
      let orgao = url.includes("/orgaos/")
      console.log(orgao);
      if(url && !orgao){
        const deputado = await Axios.get(url,config).then((res) => {
          console.log("Resultado deputado");
          this.$router.push({name:"Deputado", params:{deputado:res.data.dados}})
        })
      }
      
    }
  },
  watch:{

  },
  beforeMount(){
    if(this.$route.params.proposicao){
      this.proposicao = this.$route.params.proposicao
      this.$q.localStorage.set('ultimaProposicaoVista',this.proposicao)
    }else{
      this.proposicao = this.$q.localStorage.getItem("ultimaProposicaoVista")
    }
  },
  mounted(){
    console.log(this.$route.params);
    if(this.proposicao['statusProposicao']['uriUltimoRelator']){
      this.procurarUltimoRelator()
    }
    if(this.proposicao['uriAutores']){
      this.procurarAutores()
    }
    this.procurarTramitacoes()
  }
   
}
</script>
<style >

</style>