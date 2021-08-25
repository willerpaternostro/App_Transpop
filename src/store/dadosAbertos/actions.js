import { axiosInstance } from 'boot/axios'
import {Axios} from 'boot/axios'
const config = { headers: { 'Content-Type': 'application/json' } };
import { LocalStorage } from 'quasar';


export async function requisitarVotacoes({commit},consulta){
  await axiosInstance.get("votacoes/",config).then((response) =>{
  console.log(response)
  commit('alterarDeputados',response.data.dados) 
}).catch((erro)=>{
  console.log(erro)
})
}
export async function requisitarDeputados({commit},consulta){
  await axiosInstance.get("deputados/"+consulta,config).then((response) =>{
    console.log(response);
    commit('alterarDeputados',response.data.dados);
    LocalStorage.set('ultimaPesquisaDeputados',response.data.dados);
    if(response.data.links){
      console.log("EXISTE LINKS");
      let urlNext = false
      response.data.links.forEach(element => {
        console.log(element.rel);
        if(element.rel == 'next' ){
          urlNext = element.href;
        }
      })
      if(urlNext){
        LocalStorage.set('nextDeputados',urlNext)
        commit('alterarBotaoCarregarMais',true)
      }
    }
  }).catch((erro)=>{
    console.log(erro)
  })
}
export async function informacaoDeputado({commit},deputadoEscolhido){
  await axiosInstance.get("deputados/"+deputadoEscolhido.id,config).then((response) =>{
    console.log("ENTROU INFORMACAO DEPUTADO");
    console.log(response)
    this.$router.push({name:'Deputado',params:{deputado:response.data.dados}})
  }).catch((erro)=>{
    console.log(erro)
  })
}
export async function requisitarProposicoes({commit},consulta){
  /*  
    await axiosInstance.get("proposicoes"+consulta,config).then((response) =>{
    console.log(response)
    
    let resultado = response.data.dados
    commit('alterarProposicoes',resultado)

    if(Array.isArray(resultado)){
      if(resultado.length > 0){
        resultado.forEach(element => {
          if(element.uri){ 
            Axios.get(element.uri,config).then((response) =>{
              console.log(response);
              commit('alterarProposicoesDetalhadas',response.data.dados)
            }).catch((erro)=>{
              console.log(erro)
            })
          }
        })
        }
      }
    }).catch((erro)=>{
      console.log(erro)
    })
  */
}





