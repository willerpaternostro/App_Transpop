<template>
    <q-page >
        <div class="row">
            <q-input 
                class="col-12" 
                bg-color="yellow-1" 
                @input="filtrarCategoria"
                filled 
                color="primary" 
                bottom-slots 
                v-model="pesquisarCategoria" 
                label="Pesquisar categoria" 
            >
                <template v-slot:prepend>
                    <q-icon  color="amber" name="fas fa-search" />
                </template>
            </q-input>
        </div>
       
        <div class="row justify-center"  v-show="itemsFiltro.length == 0">
            <div 
                @click="redirecionar(categoria)"
                v-for="(categoria,index) in items" :key="index"
                class="col-xs-6 col-sm-4  row justify-center items-end  text-white" 
                style="padding:4px"
            >
                <div style="border:2px solid #28B977;height:140px;border-radius:10px;" class="col-12 row">
                    <q-icon class="col-12 " color="positive" :name="categoria.icone"  style="font-size: 50px; " />
                    <span style="line-height: normal;padding:0px 2px 10px 2px ; " :class="categoria.nome.length > 17?'text-subtitle1 text-positive text-center text-weight-bold ':'text-h6 col-12 text-center text-positive'">{{categoria.nome}}</span>
                </div>
            </div>
        </div>
         <div class="row justify-center"  v-show="pesquisarCategoria && itemsFiltro.length > 0">
            <div 
                @click="redirecionar(categoria)"
                v-for="(categoria,index) in itemsFiltro" :key="index+'filtro'"
                class="col-xs-6 col-sm-4  row justify-center items-end  text-white" 
                style="padding:4px"
            >
                <div style="border:2px solid green;height:140px;border-radius:10px;" class="col-12 row">
                    <q-icon class="col-12 " color="positive" :name="categoria.icone"  style="font-size: 50px; " />
                    <span style="line-height: normal;padding:0px 2px 10px 2px ; " :class="categoria.nome.length > 17?'text-subtitle1 text-positive text-center text-weight-bold ':'text-h6 col-12 text-center text-positive'">{{categoria.nome}}</span>
                </div>
            </div>
        </div>

        
    </q-page>
</template>
<script>
const CATEGORIAS = [ //https://dadosabertos.camara.leg.br/api/v2//referencias/proposicoes/codTema
    {icone:'fas fa-hand-holding-usd', nome:'Economia', cod:40},
    {icone:'fas fa-book', nome:'Educação', cod:46},
    {icone:'fas fa-first-aid', nome:'Saúde', cod:56},
    {icone:'fas fa-hotel', nome:'Turismo', cod:60},
     {icone:'fas fa-broadcast-tower', nome:'Comunicações', cod:37},

    {icone:'fas fa-balance-scale', nome:'Direito e Justiça', cod:76},
    {icone:'fas fa-running', nome:'Esporte e Lazer', cod:39},
    {icone:'fas fa-user-shield', nome:'Defesa e Segurança', cod:57},
    {icone:'fas fa-campground', nome:'Estrutura Fundiária', cod:51},
    {icone:'fas fa-building', nome:'Administração Pública', cod:34},
    {icone:'fas fa-gavel', nome:'Direito Constitucional', cod:68},
    {icone:'fas fa-briefcase', nome:'Trabalho e Emprego', cod:58},

    {icone:'fas fa-archway', nome:'Arte, Cultura e Religião', cod:35},
    {icone:'fas fa-truck', nome:'Viação, Transporte e Mobilidade', cod:61},
    {icone:'fas fa-users', nome:'Ciências Sociais e Humanas', cod:86},
    {icone:'fas fa-search-dollar', nome:'Finanças Públicas e Orçamento', cod:70},
    {icone:'fas fa-dove', nome:'Direitos Humanos e Minorias', cod:44},
    {icone:'fas fa-microscope', nome:'Ciência, Tecnologia e Inovação', cod:62},
    {icone:'fas fa-industry', nome:'Indústria, Comércio e Serviços', cod:66},
    {icone:'fas fa-gavel', nome:'Direito Civil e Processual Civil', cod:42},
    {icone:'fas fa-hand-holding', nome:'Previdência e Assistência Social', cod:52},
    {icone:'fas fa-gavel', nome:'Direito e Defesa do Consumidor', cod:67},
    {icone:'fas fa-glass-cheers', nome:'Homenagens e Datas Comemorativas', cod:72},
    {icone:'fas fa-landmark', nome:'Política, Partidos e Eleições', cod:74},
    {icone:'fas fa-gavel', nome:'Direito Penal e Processual Penal', cod:43},
    {icone:'fas fa-vials', nome:'Ciências Exatas e da Terra', cod:85},
    {icone:'fas fa-city', nome:'Cidades e Desenvolvimento Urbano', cod:41},
    {icone:'fas fa-landmark', nome:'Processo Legislativo e Atuação Parlamentar', cod:53},
    {icone:'far fa-lightbulb', nome:'Energia, Recursos Hídricos e Minerais', cod:54},
    {icone:'fas fa-tractor', nome:'Agricultura, Pecuária, Pesca e Extrativismo', cod:64},
    {icone:'fas fa-globe-americas', nome:'Relações Internacionais e Comércio Exterior', cod:55},
    {icone:'fas fa-seedling', nome:'Meio Ambiente e Desenvolvimento Sustentável', cod:48},
     
]
export default {
  data () {
    return {
     items:CATEGORIAS,
     itemsFiltro:[],
     parametros:"",
     pesquisarCategoria:''
    }
  },
  methods:{
    redirecionar(categoria){
        if(this.parametros.proximaPagina === "ListaProposicoes"){
            let filtroA = this.parametros.acaoTomada
            let filtroB = categoria.cod
            let consulta = "?siglaTipo="+filtroA+"&codTema="+filtroB+"&tramitacaoSenado=false"
            this.$router.push({name:this.$route.params.proximaPagina, params:{filtros:{filtroA:filtroA, filtroB:filtroB},consulta:consulta}})
        } 
    },
    filtrarCategoria(){
        if(!this.pesquisarCategoria){
            console.log('Nada');
            this.itemsFiltro = []
            return
        }
        var elementosFiltrados =  this.items.filter(elemento => { 
            if(elemento.nome.toUpperCase().includes(this.pesquisarCategoria.toUpperCase()))
             return elemento
            else
             return false
        })
        this.itemsFiltro = elementosFiltrados
        
    }
  },
  watch:{

  },
  mounted(){
      if(this.$route.params){
          //    console.log(this.$route.params);
          this.parametros = this.$route.params
      }
  }
   
}
</script>
<style >

</style>