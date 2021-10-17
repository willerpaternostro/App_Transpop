<template>
    <div :style="'background-color:#20dc87;min-height:'+$q.screen.height +'px;'"> 
        <div class="row justify-center"  style="padding:16px">
            <q-img class="col-xs-12 col-sm-6" src="~assets/logo_login.png" />
        </div>
        <div class="row justify-center"> 
            <q-form
                style="margin-top:16px"
                @submit="validacaoFormulario"
                method="POST"
                class="col-xs-11 col-sm-6" 
            >
                <q-input
                    outlined
                    v-model="nome"
                    bg-color="white"
                    label="Nome"
                    :error="check_erro_nome"
                    :error-message="msg_erro_nome"
                    @input="check_erro_nome = false"
                />

                <q-input
                    outlined
                    bg-color="white"
                    v-model="email"
                    label="Email"
                    name="email"
                    :error="check_erro_email"
                    :error-message="msg_erro_email"
                    @input="check_erro_email = false"
                />

                <q-input
                    outlined
                    v-model="senha"
                    label="Senha"
                    bg-color="white"
                    :type="senhaVisivel?'text':'password'"
                    :error="check_erro_senha"
                    :error-message="msg_erro_senha"
                    @input="check_erro_senha = false"
                >
                    <template v-slot:append>
                        <q-icon @click="senhaVisivel = !senhaVisivel" :name="senhaVisivel?'far fa-eye':'far fa-eye-slash'" />
                    </template>
                </q-input>

                <q-toggle class="text-white"  color="primary" keep-color v-model="aceitaTermos" label="Eu aceito a licença de termos" />
            
                <div style="padding-top:16px" class="row justify-center">
                    <div class="col-6">
                        <q-btn @click="$router.push({name:'Login'})" style="min-width:150px" text-color="white" label="Voltar" outline  rounded/>
                    </div>
                    <div class="col-6">
                        <q-btn 
                            style="min-width:150px" 
                            text-color="white" 
                            label="Cadastrar" 
                            type="submit" 
                            color="primary"  
                            rounded
                            :loading="loadingBotaoCadastrar"
                        >
                            <template v-slot:loading>
                                <span style="padding-right:8px">Aguarde </span> 
                                <q-spinner-dots
                                color="white"
                                size="14px"
                                />

                            </template>
                        </q-btn>
                    </div>
                </div>
            </q-form>
        </div>
    </div>
</template>
<script>
import { Axios } from 'boot/axios'
export default {
  data () {
    return {
     nome:"",
     msg_erro_nome:"",
     check_erro_nome:false,
     email:"",
     msg_erro_email:"",
     check_erro_email:false,
     senha:"",
     msg_erro_senha:"",
     check_erro_senha:false,
     senhaVisivel:false,

     aceitaTermos:false,
     check_erro_aceitaTermos:false,

     loadingBotaoCadastrar:false
    }
  },
  methods:{
    validacaoFormulario(){
        this.loadingBotaoCadastrar = true
        this.check_erro_nome = false;
        this.check_erro_email = false;
        this.check_erro_senha = false;
        this.check_erro_aceitaTermos = false;

        if(!this.nome){
            this.check_erro_nome = true;
            this.msg_erro_nome = "Campo obrigatório"
            this.loadingBotaoCadastrar = false
            return
        }
        if(!this.email){
            this.check_erro_email = true;
            this.msg_erro_email = "Campo obrigatório"
            this.loadingBotaoCadastrar = false
            return
        }else{
            
            if(this.email.length < 5 || !this.email.includes("@") || !this.email.includes(".")){
                this.loadingBotaoCadastrar = false
                this.check_erro_email = true;
                this.msg_erro_email = "E-mail inválido"
                return
            }
        }
        if(!this.senha){
            this.check_erro_senha = true;
            this.msg_erro_senha = "Campo obrigatório"
            this.loadingBotaoCadastrar = false
            return
        }else{         
            if(this.senha.length < 6 || this.senha.length > 12 ){
                this.loadingBotaoCadastrar = false
                this.check_erro_senha = true;
                this.msg_erro_senha = "A senha deve possuir entre 6 e 12 caracteres"
                return
            }
        }
        if(!this.aceitaTermos){
            this.loadingBotaoCadastrar = false
            this.$q.notify({message:'Precisa aceitar os termos de uso'})
            this.check_erro_aceitaTermos = true;
            return
        }
        if(!this.check_erro_nome && !this.check_erro_email && !this.check_erro_senha && !this.check_erro_aceitaTermos){
            this.verificarUsuario()
        }
    },

    async verificarUsuario(){
        const usuario = await Axios.get("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/procurar/usuario/" + this.email).
        then((res) => {
            console.log(res);

            if(res.data.usuarioExiste){      
                this.loadingBotaoCadastrar = false   
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
                    uuid:this.$q.localStorage.getItem("_capuid"),
                    fcm:""
                }
                this.cadastrarUsuario(dados)

            }
        }).catch((erro) => {
            this.loadingBotaoCadastrar = false
            this.$q.notify({message:"Erro", color:'red'})
            console.log(erro)
        })
    },
    async cadastrarUsuario(dados){
        const usuario = await Axios.post("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/cadastrar",dados).then((res) => {
            console.log(dados);
            this.loadingBotaoCadastrar = false
            this.$q.localStorage.set('passou-tela-cadastro',true)
            this.$q.localStorage.set("permissao-tela-home",true)
            this.$router.push({name:"Home"});
        }).catch((erro) => {
            this.loadingBotaoCadastrar = false
            this.$q.notify({message:"Erro", color:'red'})
            console.log(erro)
        })
    }
  },
  mounted(){

  }
}
</script>