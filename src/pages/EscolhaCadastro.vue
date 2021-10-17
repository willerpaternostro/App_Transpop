<template>
    <div :style="'background-color:#20dc87; width:100%; max-width: 100%;min-height:'+$q.screen.height+'px'">
        <div class="row justify-center">
        <div class="col-xs-11 col-sm-6" >
            <q-img src="~assets/logo_login.png" />
        </div>
        </div>
   
        <div class="row justify-center">
            <div class="col-xs-10 col-sm-6" >
                <q-btn 
                    @click="loginFacebook"
                    class="full-width"
                    icon="fab fa-facebook"
                    no-caps
                    size="19px" 
                    label="Entrar com facebook"
                    text-color="white"
                    style="background-color:#0572E6"
                />
            </div>
        </div><br>
        <div class="row justify-center">
            <div class="col-xs-10 col-sm-6" >
                <q-btn 
                    @click="$router.push({name:'Cadastro'})"
                    class="full-width"
                    text-color="white"
                    color="green"
                    no-caps
                    size="19px" 
                    label="Cadastre-se aqui"
                />
            </div>
        </div><br>

        <div class="row justify-center">
            <div class="col-xs-12 col-sm-6" >
                <q-btn 
                    @click="$router.push({name:'Cadastro'})"
                    class="full-width"
                    text-color="white"
                    no-caps
                    size="19px" 
                    label="Já possui cadastro? Clique aqui"
                    flat
                />
            </div>
        </div><br>
       
    </div>
</template>

<script>
import { Axios } from 'boot/axios'
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
// Offset on screen
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
export default {
  data () {
    return {
     
    }
  },
  methods:{
    async loginFacebook(){
        this.$q.loading.show({message:"Aguarde um momento ..."})
        const ctx = this
        setTimeout(() => {
            ctx.$q.loading.hide()
        }, 30000);
        const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
        console.log(JSON.stringify(result.accessToken))
        if (result.accessToken) {
            this.verificarUsuarioFacebook(result)
            return
        }
        this.$q.notify({
            message:"Não foi possível realizar o login"
        })
    },
    async verificarUsuarioFacebook(dados){
        const usuario = await Axios.get("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/procurar/usuarioFacebook/" + dados.accessToken.userId).
        then((res) => {
            console.log(JSON.stringify(res.data));
            if(res.data.usuarioExiste){
                this.$q.loading.hide()
                this.$q.localStorage.set('passou-tela-cadastro',true)
                 this.$q.localStorage.set("permissao-tela-home",true)
                this.$router.push({name:"Home"});
            }else{
                this.cadastrarUsuarioFacebook(dados)
            }
        }).catch((erro) => {
            this.$q.loading.hide()
            this.$q.notify({message:"Erro", color:'danger'})
            console.log(erro)
        })
    },
    async cadastrarUsuarioFacebook(result){
        console.log("Função cadastrarUsuarioFacebook");
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                "Origin": "http://localhost",
            }
        };
        const dados = {
            facebookId : result.accessToken.userId,
            tipo : "FACEBOOK",
            token : result.accessToken.token,
            expires : result.accessToken.expires,
            uuid:this.$q.localStorage.getItem("_capuid"),
            fcm:""
        }
 
        const cadastrarUsuario = await Axios.post("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/cadastrar",dados,axiosConfig).then((res) => {
            console.log(JSON.stringify(res.data))
             this.$q.loading.hide()
            if(res.data.sucesso){
                this.$q.localStorage.set('passou-tela-cadastro',true)
                 this.$q.localStorage.set("permissao-tela-home",true)
                this.$router.push({name:"Home"});
            }
        }).catch((erro) => {
             this.$q.loading.hide()
            this.$q.notify({message:"Erro", color:'danger'})
            console.log(JSON.stringify(erro))
            })
    }
  },
    beforeMount(){

    },
    mounted(){
        console.log(this.$q.screen.height);
    }
}
</script>
<style>

</style>