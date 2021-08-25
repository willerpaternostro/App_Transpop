<template>
  <q-page >
    <q-expansion-item
        style="margin-bottom:20px"
        expand-separator
        expand-icon="fas fa-filter"
        label="Clique aqui para Pesquisa avançada"
        class="text-weight-bold bg-yellow-2"
      >
      <q-form class="bg-grey-2">
        <div class="row">
          <div class="col-4">
            <label>Mês início</label>
            <q-select style="padding:4px" outlined v-model="filtro_mesInicio" :options="select_mes"    />
          </div>
          <div class="col-4">
            <label>Mês Final</label>
            <q-select class="col-4"  style="padding:4px" outlined v-model="filtro_mesFinal" :options="select_mes"   />
          </div>
          <div class="col-4">
             <label>Ano</label>
           <q-input  class="col-4" mask="####" style="padding:4px"  outlined  label="Ano" />
          </div>
        </div>
        <div class="row">
          <q-select style="padding:4px" class="col-12" outlined v-model="filtro_orgao" :options="select_orgaos"  label="Selecione o órgão de votação" />
        </div>
        <q-select  style="padding:4px" outlined v-model="filtro_itens" :options="select_itens"  label="Itens por página"  />

        <div class="q-gutter-sm">
          <q-radio v-model="filtro_situacao" val="1" label="Aprovadas" />
          <q-radio v-model="filtro_situacao" val="0" label="Reprovadas" />
          <q-radio v-model="filtro_situacao" val="tudo" label="Todas" />
        </div>
       
        <div class="row justify-end" style="padding:4px">
          <q-btn @click="requisitarVotacoes" color="dark" label="Pesquisar" no-caps />
        </div>    
      </q-form>
    </q-expansion-item>
    <!-- CARD VOTAÇÃO -->
    <div @click="$router.push({name:'Votacao', params:{votacao:votacao}})"  v-for="(votacao,index) in votacoes" :key="index" style="border: 1px solid green;border-radius:10px; padding:10px;margin-bottom:6px" >
      <div class="row" style="margin-bottom:5px">
        <div style="font-size:16px;" class="col-12 text-grey-9 text-weight-bold"> {{votacao.descricao}}</div> 
      </div>
      <div style="margin-bottom:5px">
        <span class="text-weight-bold text-grey-9">Situação:</span>
        <q-badge text-color="white" :color="votacao['aprovacao']?'positive':'red'" :label="votacao['aprovacao']?'Aprovada':'Reprovada'"  />
      </div>
      <div><span class="text-weight-bold text-grey-9">Órgão: </span> {{votacao.siglaOrgao}} </div>
      <div><span class="text-weight-bold text-grey-9">Data Registro: </span> {{ new Date(Date.parse(votacao.dataHoraRegistro)).toLocaleString('pt-BR') }}</div>
      <div class="row justify-end"><q-btn color="primary" rounded no-caps label="Ver detalhes"  text-color="white" /> </div>
    </div>

    <!-- DIALOG INFORMATIVO -->
    <q-dialog
      v-model="mostrarDialogInformativoVotacao"
      full-height
    >
      <q-card class="column full-height text-grey-9 full-width" style="width: 300px;font-size:18px">
        <q-card-section>
          <div class="text-h5 text-center">O que é uma votação?</div>
        </q-card-section>
        
        <q-card-section class="col q-pt-none text-justify scroll">
          <q-img src="~assets/Homem_Duvida.jpg" />
          <p>A votação é a última etapa da tramitação de uma proposição.</p>
          <p>O resultado dessa votação é uma decisão tomada por um grupo de deputados, no âmbito de um órgão legislativo específico, como o Plenário e as comissões.</p>
          <p>Sempre tem um e <b>somente um objeto</b>, que é a proposição efetivamente votada. </p>
          <p>Cada votação pode gerar tramitações e outros efeitos sobre uma ou mais proposições que sejam relacionadas à proposição que é objeto da votação.</p>
        </q-card-section>
      
        <q-card-actions align="right" class="bg-white">
          <q-btn text-color="grey-9" no-caps flat label="Saber Mais" v-close-popup />
          <q-btn @click="alterarDialogInformativoVotacao(false)" text-color="positive" no-caps flat label="Entendi" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { axiosInstance } from 'boot/axios';
import {Axios} from 'boot/axios'
const config = { headers: { 'Content-Type': 'application/json' } };

const ORGAOS = [
  {id:180, sigla:'PLEN', nome:'Plenário', tipoOrgao:'Plenário virtual'},
  {id:4, sigla:'MESA', nome:'Mesa Diretora da Câmara dos Deputados', tipoOrgao:'Comissão Diretora'},
  //COMISSÕES PERMANENTES
  {id:2001, sigla:'CAPADR', nome:'Comissão de Agricultura, Pecuária, Abastecimento e Desenvolvimento Rural', tipoOrgao:'Comissão Permanente'},
  {id:2002, sigla:'CCTCI', nome:'Comissão de Ciência e Tecnologia, Comunicação e Informática', tipoOrgao:'Comissão Permanente'},
  {id:2003, sigla:'CCJC', nome:'Comissão de Constituição e Justiça e de Cidadania', tipoOrgao:'Comissão Permanente'},
  {id:2004, sigla:'CDC', nome:'Comissão de Defesa do Consumidor', tipoOrgao:'Comissão Permanente'},
  {id:2006, sigla:'CDU', nome:'Comissão de Desenvolvimento Urbano', tipoOrgao:'Comissão Permanente'},
  {id:2007, sigla:'CDHM', nome:'Comissão de Direitos Humanos e Minorias', tipoOrgao:'Comissão Permanente'},
  {id:2008, sigla:'CDEICS', nome:'Comissão de Desenvolvimento Econômico, Indústria, Comércio e Serviços', tipoOrgao:'Comissão Permanente'},
  {id:2009, sigla:'CE', nome:'Comissão de Educação', tipoOrgao:'Comissão Permanente'},
  {id:2010, sigla:'CFT', nome:'Comissão de Finanças e Tributação', tipoOrgao:'Comissão Permanente'},
  {id:2011, sigla:'CFFC', nome:'Comissão de Fiscalização Financeira e Controle', tipoOrgao:'Comissão Permanente'},
  {id:2012, sigla:'CME', nome:'Comissão de Minas e Energia', tipoOrgao:'Comissão Permanente'},
  {id:2014, sigla:'CSSF', nome:'Comissão de Seguridade Social e Família', tipoOrgao:'Comissão Permanente'},
  {id:2015, sigla:'CTASP', nome:'Comissão de Trabalho, de Administração e Serviço Público', tipoOrgao:'Comissão Permanente'},
  {id:2016, sigla:'CVT', nome:'Comissão de Viação e Transportes', tipoOrgao:'Comissão Permanente'},
  {id:2017, sigla:'CINDRA', nome:'Comissão de Integração Nacional, Desenvolvimento Regional e da Amazônia', tipoOrgao:'Comissão Permanente'},
  {id:2018, sigla:'CREDN', nome:'Comissão de Relações Exteriores e de Defesa Nacional', tipoOrgao:'Comissão Permanente'},
  {id:5438, sigla:'CLP', nome:'Comissão de Legislação Participativa', tipoOrgao:'Comissão Permanente'},
  {id:5503, sigla:'CSPCCO', nome:'Comissão de Segurança Pública e Combate ao Crime Organizado', tipoOrgao:'Comissão Permanente'},
  {id:6066, sigla:'CTUR', nome:'Comissão de Turismo', tipoOrgao:'Comissão Permanente'},
  {id:6174, sigla:'CMADS', nome:'Comissão de Meio Ambiente e Desenvolvimento Sustentável', tipoOrgao:'Comissão Permanente'},
  {id:6987, sigla:'CAE-SF', nome:'Comissão de Assuntos Econômicos', tipoOrgao:'Comissão Permanente'},
  {id:536996, sigla:'CCULT', nome:'Comissão de Cultura', tipoOrgao:'Comissão Permanente'},
  {id:537236, sigla:'CESPO', nome:'Comissão do Esporte', tipoOrgao:'Comissão Permanente'},
  {id:537480, sigla:'CPD', nome:'Comissão de Defesa dos Direitos das Pessoas com Deficiência', tipoOrgao:'Comissão Permanente'},
  {id:537870, sigla:'CMULHER', nome:'Comissão de Defesa dos Direitos da Mulher', tipoOrgao:'Comissão Permanente'},
  {id:537871, sigla:'CIDOSO', nome:'Comissão de Defesa dos Direitos da Pessoa Idosa', tipoOrgao:'Comissão Permanente'},
]
export default {
  data () {
    return {
      votacoes:[],
      select_itens:[15,30, 50, 100,200],
      select_orgaos:[],
      select_mes:['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    
      filtro_mesInicio:'',
      filtro_mesFinal:'',
      filtro_ano:'',
      filtro_orgao:'',
      filtro_situacao:'',
      filtro_itens:'',
   
    }
  },
  computed:{
    mostrarDialogInformativoVotacao(){
      return this.$store.state.dadosAbertos.mostrarDialogInformativoVotacao
    }
  },
  methods:{
    alterarDialogInformativoVotacao(dado){
      return this.$store.commit('dadosAbertos/alterarDialogInformativoVotacao',dado)
    },
    
    async requisitarVotacoes(){
      this.$q.loading.show({
        message:'Aguarde um momento ... ',
      })
      let date = new Date();
      
      let mes = date.getMonth() <= 10 ? '0' +  date.getMonth() : date.getMonth()
      let dia = date.getDate() <= 10 ? '0'  +  date.getDate() : date.getDate()
      
      let dataInicial = (date.getFullYear()) + '-' + mes + '-' + dia

      let mesDiferenca = parseInt(mes) +1 
      mesDiferenca = mesDiferenca <= 10 ?'0'+mesDiferenca:mesDiferenca

      let dataFinal = (date.getFullYear()) + '-' + mesDiferenca + '-' + dia
  
      
      let itens = this.filtro_itens?'itens='+this.filtro_itens:'itens=200' //Padrão 100 resultados
    //  let orgao = this.filtro_orgao?`&idOrgao=${this.filtro_orgao}`:`&idOrgao=2003,2004`
      let data = "&dataInicio="+dataInicial+'&dataFim='+dataFinal

      let consulta = '?'+ itens  + "&dataInicio=2021-07-07&dataFim=2021-07-15"//data
  
      console.log(consulta);
      await axiosInstance.get("votacoes"+consulta,config).then((response) =>{
        this.$q.loading.hide()
        console.log(response)
        this.votacoes = this.filtro_situacao == 'tudo'?response.data.dados:response.data.dados.filter(element => { return element.aprovacao == this.filtro_situacao})
       // this.votacoes = response.data.dados.filter(element => {return (element.descricao.includes('Sim:') && element.aprovacao == this.filtro_situacao)} )
        this.$q.localStorage.set('ultimaPesquisaVotacoes',this.votacoes)
      
      }).catch((erro)=>{
        this.$q.loading.hide()
        console.log(erro)
      })
    }
  },
    
 beforeMount(){
    ORGAOS.forEach(element => {
      this.select_orgaos.push(element['sigla'] +' - '+element.nome)
    })
    if(!this.$q.localStorage.getItem('ultimaPesquisaVotacoes')){
      if(this.$route.params){
        this.filtro_situacao = this.$route.params.aprovacao
        this.requisitarVotacoes({consulta:''})
      }
    }else{
      this.votacoes = this.$q.localStorage.getItem('ultimaPesquisaVotacoes')
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