<template>
    <q-page > 
         <div class="row" >
              <div class="col-6 text-left text-weight-bold text-grey-9">Última atualização:<br>
              <span v-if="deputado.ultimoStatus.data" class="text-caption">{{ new Date(Date.parse(deputado.ultimoStatus.data)).toLocaleString('pt-BR') }}</span>
              <span v-if="!deputado.ultimoStatus.data" class="text-caption">Não informado </span>
                </div>
               <div class="col-6 row justify-end ">
            <!-- <q-btn flat round color="grey-9" icon="fas fa-share-alt" /> -->
                <q-btn @click="atualizarDeputadoFavoritos" flat round color="red" :icon="favorito?'fas fa-heart':'far fa-heart'" />
            </div>
        
        </div>
        <div class="row" style="margin-top:20px">
            <div class="text-h6 col-12 text-center text-grey-9">{{deputado.nomeCivil?deputado.nomeCivil:'Não informado'}}</div>
        </div>
        <div class="row " style="margin-top:10px">
            <div class="col-4  row justify-center" style="border-radius:10px;" v-if="deputado">
                <q-img contain v-if="deputado.ultimoStatus.urlFoto"  style="padding:10px" height="180px" :src="deputado.ultimoStatus.urlFoto" /> 
                <q-img contain v-if="!deputado.ultimoStatus.urlFoto" style="padding:10px"  height="180px" src="~assets/icone_deputados.png" />
            </div>
            
            <div class="col-8" style="padding-left:10px">    
                <!-- Nome Eleitoral -->
                <div class="row"> 
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Nome Eleitoral:</span>
                        {{deputado.ultimoStatus.nomeEleitoral}}
                    </div>
                </div>
                <!-- CONDIÇÃO ELEITORAL -->
                <div class="row"> 
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Condição:</span>
                        {{deputado.ultimoStatus.condicaoEleitoral?deputado.ultimoStatus.condicaoEleitoral:'Não informado'}}
                    </div>
                </div>
                <!-- SITUAÇÃO-->
                  <div class="row"> 
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Situação:</span>
                        {{deputado.ultimoStatus.situacao?deputado.ultimoStatus.situacao: 'Não informado'}}
                    </div>
                </div>
                <!-- GABINETE-->
                <div class="row"> 
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Gabinete:</span>
                        {{ informacoesGabinete(deputado.ultimoStatus.gabinete )}}
                    </div>
                </div>
                <!-- TELEFONE GABINETE -->
                <div class="row"> 
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Telefone:</span>
                        {{deputado.ultimoStatus.gabinete.telefone?'(61) '+deputado.ultimoStatus.gabinete.telefone:'Não informado'}}
                    </div>
                </div>
                <!-- PARTIDO -->
                <div class="row">
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Partido:</span>
                        {{informacoesPartido(deputado)}}
                         
                    </div>
                </div>
                <!-- NATURALIDADE -->
                <div class="row"> 
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Natural:</span>
                        {{informacoesNaturalidade(deputado)}}
                    </div>
                </div>
                <!-- ESCOLARIDADE -->
                <div class="row">
                    <div class="col-12 text-grey-9 self-center">
                        <span class="text-weight-bold">Escolaridade:</span>
                        {{deputado.escolaridade?deputado.escolaridade:'Não informado'}}
                    </div>
                </div>
                <!-- PROFISSÕES -->
                <div v-if="profissoes"> 
                    <span class="text-grey-9 text-weight-bold" >Profissões:</span>  
                    <q-badge  style="margin-left:10px;font-size:14px" v-for="(prof,index) in profissoes" :key="index" transparent align="middle" color="positive" :label="prof.titulo" />
                </div>
            </div>
        </div>
   
         <!-- REDES SOCIAIS --> 
        <q-expansion-item
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            label="Redes sociais"
            class="full-width  text-white text-center text-h6 bg-gradient"
            style=" margin-top:15px"
        >
            <div class="row bg-white">
                <div class="col-12 text-grey-9 ">
                    <q-icon name="fas fa-envelope" color="grey" style="padding-right:10px" /> 
                    <span class="text-subtitle1 text-weight-bold">{{deputado.ultimoStatus.email?deputado.ultimoStatus.email:'Não informado'}}</span> 
                </div>
            </div>
            <div class="row bg-white justify-center">
                <div class="col-12">
                    <q-btn :type="redesSociais.facebook?'a':''" target="blank" :href="redesSociais.facebook?redesSociais.facebook:''" :disable="redesSociais.facebook.length == 0?true:false" size="20px" flat :text-color="redesSociais.facebook?'blue':'grey'" icon="fab fa-facebook" />
                    <q-btn :type="redesSociais.instagram?'a':''" target="blank" :href="redesSociais.instagram?redesSociais.instagram:''" :disable="redesSociais.instagram.length == 0?true:false" size="20px"  flat :text-color="redesSociais.instagram?'pink':'grey'" icon="fab fa-instagram" />
                    <q-btn :type="redesSociais.twitter?'a':''" target="blank" :href="redesSociais.twitter?redesSociais.twitter:''" :disable="redesSociais.twitter.length == 0?true:false" size="20px" flat :text-color="redesSociais.twitter?'blue':'grey'" icon="fab fa-twitter" />
                    <q-btn :type="redesSociais.linkedin?'a':''" target="blank" :href="redesSociais.linkedin?redesSociais.linkedin:''" :disable="redesSociais.linkedin.length == 0?true:false" size="20px" flat :text-color="redesSociais.linkedin?'info':'grey'" icon="fab fa-linkedin" />
                    <q-btn :type="redesSociais.youtube?'a':''" target="blank" :href="redesSociais.youtube?redesSociais.youtube:''" :disable="redesSociais.youtube.length == 0?true:false" size="20px" flat :text-color="redesSociais.youtube?'red':'grey'" icon="fab fa-youtube" />
                    
                </div>
            </div>

        </q-expansion-item>
          <!-- PROPOSIÇÕES 
        <q-expansion-item
            default-opened
            expand-separator
            icon=""
            expanded-icon="fas fa-chevron-down"
            expand-icon="fas fa-chevron-right"
            expand-icon-class="text-white"
            label="Proposições"
            class="full-width  text-white text-center text-h6"
            style=" margin-top:15px"
        >
            <div class="row bg-white">
                <div class="col-12 text-grey-9 ">
                    <q-icon name="fas fa-envelope" color="grey" style="padding-right:10px" /> 
                    <span class="text-subtitle1 text-weight-bold">  Em construção</span> 
                </div>
            </div>
        </q-expansion-item>
        -->
        <!-- DESPESAS -->
       
        <q-expansion-item
                expand-separator
                expanded-icon="fas fa-chevron-down"
                expand-icon="fas fa-chevron-right"
                expand-icon-class="text-white"
                label="Despesas"
                class="full-width  text-white text-center text-h6 bg-gradient"
                style=" margin-top:15px"
            >
            
            <div >
                <q-select behavior="menu" @input="procurarDespesas" class="bg-white text-positive" outlined v-model="filtroDespesa_ano" :options="anosDespesas" label="Ano" />
            </div>
            <div class="row bg-white">
                <div class=" col-12 text-red text-h6 bg-white full-width" v-show="!loadingDespesas">
                    <span class="text-grey-9">Total:</span> 
                    R$ {{valorDespesaTotal > 0?valorDespesaTotal.toString().split('.')[0]+','+valorDespesaTotal.toString().split('.')[1].slice(0,2):0}} </div>
            </div>
           
            <q-list class="bg-white text-grey-9 text-justify" style="min-height: 350px;">
                  <transition
                        appear
                        enter-active-class="animated fadeIn"
                        leave-active-class="animated fadeOut"
                    >
                    <q-virtual-scroll
                        style="max-height: 350px;"
                        :items="despesas"
                        separator
                    >
                   
                    <template v-slot="{item,index}">
                        <q-item  :key="index">
                            
                            <q-item-section>
                                <q-item-label class="text-capitalize text-subtitle1">{{item.tipoDespesa.toLowerCase()}}</q-item-label>
                                <q-item-label caption lines="2">{{item.nomeFornecedor}}</q-item-label>
                            </q-item-section>

                            <q-item-section side top>
                                <q-item-label  class="text-weight-bold " caption>Data:{{item.mes+'/'+item.ano}}</q-item-label>
                                <q-item-label  class="text-weight-bold text-subtitle1">R$ {{item.valorLiquido}}</q-item-label>
                                <q-btn flat type="a" target="blank" :href="item.urlDocumento" icon="fas fa-file-pdf" color="grey-9" />
                                <q-item-label  class="text-weight-bold " caption>{{item.tipoDocumento}}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                   
                    </q-virtual-scroll>
                 </transition>
                    <q-inner-loading :showing="loadingDespesas">
                        <q-spinner-gears size="50px" color="primary" />
                    </q-inner-loading>
            </q-list>
        </q-expansion-item>
        <!-- Empregos e Ativades -->
        <q-expansion-item
                expand-separator
                icon=""
                expanded-icon="fas fa-chevron-down"
                expand-icon="fas fa-chevron-right"
                expand-icon-class="text-white"
                label="Empregos Anteriores"
                class="full-width  text-white text-center text-h6 bg-gradient"
                style=" margin-top:15px;margin-bottom:60px"
            >
            <div class="bg-white text-grey-9 " v-if="ocupacoes">
                <div class="row text-justify" v-for="(profissaoAnterior,index) in ocupacoes" :key="index">
                   <div class="col-12">
                        <span class="text-capitalize text-subtitle1">{{profissaoAnterior.titulo?profissaoAnterior.titulo:'Não informado'}}</span>
                        <q-item-label caption  lines="2">
                            {{ informacoesProfissoesAnteriores(profissaoAnterior) }}
                        </q-item-label>
                   </div>
                </div>
            </div>
        </q-expansion-item>
        <!-- Publicações político 
            <q-expansion-item
                    expand-separator
                    icon=""
                    expanded-icon="fas fa-chevron-down"
                    expand-icon="fas fa-chevron-right"
                    expand-icon-class="text-white"
                    label="Publicações"
                    class="full-width  text-white text-center text-h6"
                    style=" margin-top:15px"
                >
                <div class="bg-white text-grey-9 ">
                    <div class="row text-justify" >
                    <div class="col-12 text-h6">
                        Não possui nenhuma publicação
                        </div>
                    </div>
                </div>
            </q-expansion-item>
        -->
    </q-page>
</template>
<script>
const ANOS_DESPESA = [2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009]
const config = { headers: { 'Content-Type': 'application/json' } };
import { axiosInstance } from 'boot/axios'
import {Axios} from 'boot/axios'
export default {
  data () {
    return {
        deputado:null,
        favorito:false,
        profissoes:null,
        ocupacoes:null,
        despesas:null,
        discursos:null,
        frentes:null,
        redesSociais:{twitter:'', facebook:'', instagram:'', linkedin:'', youtube:'', youtube:''},
        
        paginaAtualDespesa:1,
        paginaFinalDespesa:1,
        loadingDespesas:false,
        filtroDespesa_ano:'2021',
        anosDespesas:ANOS_DESPESA,
        valorDespesaTotal:0

    }
  },
    computed:{
        usuarioLogado(){
            return this.$store.state.globais.usuarioLogado
        }
    },
    methods:{
        resolve(){     
            Promise.allSettled([this.profissao(), this.procurarDespesas(), this.procurarOcupacoes()]).then((response) => {        
                // PROFISSÕES --> response[0] 
                this.profissoes = response[0]['value']['data']['dados']
                // DESPESAS  --> response[1]
                //this.despesas = response[1]['value']
                
                //OCUPAÇÕES --> response[2] 
                this.ocupacoes = response[2]['value']['data']['dados']
            }).catch(erro => {   
                console.log(erro);});
        },
        async profissao(){
            const profissoes = await axiosInstance.get("deputados/"+this.deputado.id+"/profissoes",config)
            return profissoes
        },
        async procurarDespesas(){
            this.loadingDespesas = true
            const despesas = await axiosInstance.get("deputados/"+this.deputado.id+"/despesas?itens=100&ano="+this.filtroDespesa_ano,config)
            this.despesas = []
            if(!despesas['data']['dados']){
                this.valorDespesaTotal = 0
                this.despesas = []
                 this.loadingDespesas = false
                return
            }
            if(Array.isArray(despesas['data']['dados'])){ //Quando não tem resultados
                if(despesas['data']['dados'].length == 0){
                    this.valorDespesaTotal = 0
                    this.despesas = []
                    this.loadingDespesas = false
                    return
                }
            }
            let linkPrimeiraPagina = despesas.data.links.find( element =>  element.rel.toUpperCase() == "FIRST")["href"]
            let linkProximaPagina = despesas.data.links.find( element =>  element.rel.toUpperCase() == "NEXT")["href"]
            let linkPaginaAtual = despesas.data.links.find( element =>  element.rel.toUpperCase() == "SELF")["href"]
            let linkUltimaPagina = despesas.data.links.find( element =>  element.rel.toUpperCase() == "LAST")["href"]
           // console.log("LINKS \n"+ linkPrimeiraPagina + "\n" + linkProximaPagina + "\n" + linkUltimaPagina);
            
            let paginaAtualLink = linkPaginaAtual.split("&")[1]
            let qtdPaginaAtual = parseInt(paginaAtualLink.split("pagina=")[1])
            this.paginaAtualDespesa = qtdPaginaAtual?qtdPaginaAtual:1

            let paginaUltimoLink = linkUltimaPagina.split("&")[1]
            let qtdPaginas = parseInt(paginaUltimoLink.split("pagina=")[1])
            this.paginaFinalDespesa = qtdPaginas?qtdPaginas:1;
            
            let todasDespesas = despesas["data"]["dados"]

            //ADICIONANDO TODAS AS DESPESAS
            for( let i = 1; i < qtdPaginas; i++){
                if(linkProximaPagina){
                   // console.log("linkProximaPagina:"+linkProximaPagina);
                    const response = await Axios.get(linkProximaPagina,config)
                   // console.log("RESPONSE ANTES FOREACH");
                  //  console.log(response);
                    response.data.dados.forEach(despesa => {todasDespesas.push(despesa)})
                }
            }
            // CALCULANDO VALOR TOTAL
            this.valorDespesaTotal = 0
                todasDespesas.forEach(element => {
                    this.valorDespesaTotal = this.valorDespesaTotal + element.valorDocumento
            })
            this.despesas = todasDespesas
            this.loadingDespesas = false
        },
        async procurarOcupacoes(){
            const ocupacoes = await axiosInstance.get("deputados/"+this.deputado.id+"/ocupacoes",config)
            return ocupacoes
        },
        procurarRedesSociais(){
            if(this.deputado.redeSocial){
                this.deputado.redeSocial.forEach(element => {
                    if(element.includes('twitter')){
                        this.redesSociais.twitter = element;
                    }
                        if(element.includes('facebook')){
                        this.redesSociais.facebook = element;
                    }
                        if(element.includes('youtube')){
                        this.redesSociais.youtube = element;
                    }
                        if(element.includes('instagram')){
                        this.redesSociais.instagram = element;
                    }
                        if(element.includes('linkedin')){
                        this.redesSociais.linkedin = element;
                    }
                })
            }
        },
        informacoesGabinete(gabinete){
                let sala = gabinete.sala?gabinete.sala :'' 
                let predio = gabinete.predio?' - Anexo ' + gabinete.predio :''
                let andar = gabinete.andar?' - '+gabinete.andar+'º Andar':''

                let resultado = sala + predio + andar
                if(!resultado){
                    resultado = "Não informado"
                }
                return resultado
        },
        informacoesPartido(deputado){
                let siglaPartido = deputado.ultimoStatus.siglaPartido?deputado.ultimoStatus.siglaPartido:'' 
                let siglaUf =  deputado.ultimoStatus.siglaUf?' - ' + deputado.ultimoStatus.siglaUf:''
                let resultado = siglaPartido + siglaUf
                if(!resultado){
                    resultado = "Não informado"
                }
                return resultado
        },
        informacoesNaturalidade(deputado){
            let municipio = deputado.municipioNascimento?deputado.municipioNascimento:'' 
            let uf = deputado.ufNascimento?' - '+ deputado.ufNascimento:''
            let resultado = municipio + uf
            if(!resultado){
                resultado = "Não informado"
            }
            return resultado;
        },
        informacoesProfissoesAnteriores(profissaoAnterior){
            let entidade = profissaoAnterior.entidade ? profissaoAnterior.entidade:'' 
            let entidadeUF = profissaoAnterior.entidadeUF ?' - ' + profissaoAnterior.entidadeUF:'' 
            let entidadePais = profissaoAnterior.entidadePais ? ', ' + profissaoAnterior.entidadePais:''
            let resultado = entidade + entidadeUF + entidadePais

            if(!resultado){
                resultado = "Não informado"
            }
            return resultado
        },
        verificarCoracao(){
            let deputadosFavoritos = this.$q.localStorage.getItem('ID_deputadosFavoritos');
            deputadosFavoritos.forEach(element =>{
                if(element == this.deputado.id){
                    this.favorito = true;
                }  
            }) 
        },
        atualizarDeputadoFavoritos(){
            console.log("ATUALIZAR DEPUTADOS FAVORITOS");
            let deputadosFavoritosID = this.$q.localStorage.getItem('ID_deputadosFavoritos');
            let deputados = this.$q.localStorage.getItem('deputadosFavoritos');
            let posicao = null;

            deputadosFavoritosID.forEach( (element,index) => {
                if(element == this.deputado.id){
                    posicao = index
                }
            })
           console.log("POSICAO:"+posicao);
            if(posicao >= 0 && posicao != null){ //Exclui favoritos
                console.log("POSICAO IF SPLICE");
                deputadosFavoritosID.splice(posicao,1)
                deputados.splice(posicao,1)
                this.$q.localStorage.set('ID_deputadosFavoritos',deputadosFavoritosID)
                this.$q.localStorage.set('deputadosFavoritos',deputados)
                this.favorito = false
            }
            if(posicao == null){ //Adiciona favoritos
                deputadosFavoritosID.push(this.deputado.id)
                deputados.push(this.deputado.ultimoStatus?this.deputado.ultimoStatus:this.deputado)
                this.$q.localStorage.set('ID_deputadosFavoritos',deputadosFavoritosID)
                this.$q.localStorage.set('deputadosFavoritos',deputados)
                this.favorito = true
                 this.salvarDeputadoBanco()
            }
            
        },
        salvarDeputadoBanco(){
           /* let userId = '615a3c8368a2c4f22b83bb0d'
            const res =  Axios.get("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/inserir/deputado",
            {params:{userId:userId, deputado: this.deputado}}).then(data =>{
                console.log(data);
            })*/
        }
  },
  watch:{

  },
  beforeMount(){
        //console.log(this.$route.params);
        if(this.$route.params){
            this.deputado = this.$route.params.deputado
            this.verificarCoracao()
            this.procurarRedesSociais()
        }
  },
  mounted(){
    this.resolve()
  }
}
</script>
<style >

</style>