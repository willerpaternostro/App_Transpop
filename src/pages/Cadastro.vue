<template>
    <div :style="'min-height:'+$q.screen.height +'px;'">
     
        <q-form
            @submit="verificarUsuario"
            method="POST"
            class="q-gutter-md"
        >
            <q-input
                outlined
                v-model="nome"
                label="Nome"
                lazy-rules
            />

            <q-input
                outlined
                v-model="email"
                label="Email"
                name="email"
            />

            <q-input
                outlined
                v-model="senha"
                label="Senha"
            />
            <q-toggle v-model="aceitaTermos" label="Eu aceito a licença de termos" />

            <div class="row justify-end">
                <q-btn label="Cadastrar" type="submit" color="primary"/>
            </div>
        </q-form>
    </div>
</template>
<script>
import { Axios } from 'boot/axios'
export default {
  data () {
    return {
     nome:"",
     email:"",
     senha:"",
     aceitaTermos:false
    }
  },
  methods:{
    async verificarUsuario(){
        const usuario = await Axios.get("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/procurar/usuario/" + this.email).
        then((res) => {
            console.log(res);
          
            if(res.data.usuarioExiste){           
                this.$q.notify({message:this.email+" já possui cadastro",color:"red"})
                return;
            }else{
                const dados = {
                    facebookId:null,
                    nome:this.nome,
                    email:this.email,
                    senha:this.senha,
                    tipo:"EMAIL",
                    token:"",
                    expires:"",
                    uuid:this.$q.localStorage.getItem("_capuid")
                }
                this.cadastrarUsuario(dados)

            }
        }).catch((erro) => {
            this.$q.notify({message:"Erro", color:'red'})
            console.log(erro)
        })
    },
    async cadastrarUsuario(dados){
        const usuario = await Axios.post("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/cadastrar",dados).then((res) => {
            console.log(dados);
            this.$q.localStorage.set('TelaEscolhaCadastro',true)
            this.$router.push({name:"Home"});
        }).catch((erro) => {
            this.$q.notify({message:"Erro", color:'red'})
            console.log(erro)
        })
    }
  },
  mounted(){
      console.log("Cadastro");
  }
}
</script>