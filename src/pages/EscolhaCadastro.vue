<template>
    <div class="row justify-center  flex flex-center" :style="' width:100%; max-width: 100%;min-height:'+$q.screen.height+'px'">
        <div class="col-xs-12 col-sm-11 col-md-6">
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
        </div>
    </div>
</template>

<script>
import { axiosInstance, Axios } from 'boot/axios'
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
        const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
        if (result.accessToken) {
            this.verificarUsuarioFacebook(result)
        }
    },
    async verificarUsuarioFacebook(dados){
        const usuario = await Axios.get("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/procurar/usuarioFacebook/" + dados.accessToken.userId).
        then((res) => {
            console.log(res.data);
            if(res.data){
                console.log(res.data);
                this.$q.localStorage.set('TelaEscolhaCadastro',true)
                this.$router.push({name:"Home"});
            }else{
                this.cadastrarUsuarioFacebook(dados)
                console.log(res.data);
                console.log("cadastrar usuario");
            }
        }).catch((erro) => {
            this.$q.notify({message:"Erro", color:'danger'})
            console.log(erro)
        })
    },
    async cadastrarUsuarioFacebook(result){
        console.log("Função cadastrarUsuarioFacebook");
        const dados = {
            facebookId : result.accessToken.userId,
            tipo : "FACEBOOK",
            token : result.accessToken.token,
            expires : result.accessToken.expires,
            uuid:this.$q.localStorage.getItem("_capuid")
        }
        const usuario = await Axios.post("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/cadastrar",dados).then((res) => {
            this.$q.localStorage.set('TelaEscolhaCadastro',true)
            this.$router.push({name:"Home"});
        }).catch((erro) => {
            this.$q.notify({message:"Erro", color:'danger'})
            console.log(erro)
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