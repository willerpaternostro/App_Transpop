<template>
  <div  :style="'background-color:#20dc87;height:'+$q.screen.height+'px'"> 
    <div class="row justify-center" style="padding:16px">
      <q-img class="col-xs-12 col-sm-6" src="~assets/logo_login.png" />
    </div>
    <q-form
      style="margin-top:16px"
      @submit="validacaoFormulario"
    >
    <div class="row justify-center">
      <div class="col-xs-11 col-sm-6" >
        <q-input
                outlined
                v-model="email"
                label="Email"
                name="email"
                bg-color="white"
                :error="check_erro_email"
                :error-message="msg_erro_email"
                @input="check_erro_email = false"
          />
      </div>
    </div>


    <div class="row justify-center">
      <div class="col-xs-11 col-sm-6" >
        <q-input
              outlined
              v-model="senha"
              bg-color="white"
              label="Senha"
              :type="senhaVisivel?'text':'password'"
              :error="check_erro_senha"
              :error-message="msg_erro_senha"
              @input="check_erro_senha = false"
          >
            <template v-slot:append>
                <q-icon @click="senhaVisivel = !senhaVisivel" :name="senhaVisivel?'far fa-eye':'far fa-eye-slash'" />
            </template>
          </q-input>
      </div>
      
    </div>
    

    <div class="row justify-center">
      <div class="col-xs-10 col-sm-6" >
        <q-btn 
          type="submit" 
          class="full-width"  
          label="Entrar"
          color="primary" 
          text-color="white"  
          rounded  
          :loading="loadingBotaoLogin"
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
  
    <br>
  <div class="row justify-center">
    <div class="col-xs-10 col-sm-6" >
      <q-btn 
          @click="loginFacebook"
          class="full-width"
          icon="fab fa-facebook"
          no-caps
          size="14px" 
          label="Entrar com Facebook"
          text-color="white"
          style="background-color:#0572E6"
          rounded
      />
    </div>
  </div><br>
  <div class="row justify-center">
    <div class="col-xs-10 col-sm-6" >
      <q-btn 
          @click="$router.push({name:'Cadastro'})"
          class="full-width"
          no-caps
          size="14px" 
          
          text-color="primary"
          outline
          rounded
      >
      <q-icon style="padding-right:16px" color="white" name="fas fa-smile" />
      <span> CADASTRE-SE AQUI </span>
      </q-btn>
    </div>
  </div> <br>
  <div class="row justify-center">
    <q-btn @click="$router.push({name:'EsqueciSenha'})" class="text-primary" label="Esqueceu a senha?" flat />
  </div>
</div>
</template>
<script>
import { Axios } from 'boot/axios'
export default {
  data () {
    return {
      email:"",
      msg_erro_email:"",
      check_erro_email:false,
      senha:"",
      msg_erro_senha:"",
      check_erro_senha:false,
      senhaVisivel:false,

      loadingBotaoLogin:false
    }
  },
  methods:{
    atualizarUsuario(dados){
      return this.$store.commit('globais/atualizarUsuarioLogado',dados)
    },
    validacaoFormulario(){
      this.check_erro_email=false;
      this.check_erro_senha=false;
      this.loadingBotaoLogin = true
      //this.$q.loading.show({message:"Aguarde um momento ..."})
      if(!this.email){
        this.check_erro_email = true;
        this.msg_erro_email = "Campo obrigatório"
        this.loadingBotaoLogin = false
        return
      }else{
          if(this.email.length < 5 || !this.email.includes("@") || !this.email.includes(".")){
             this.loadingBotaoLogin = false
            this.check_erro_email = true;
            this.msg_erro_email = "E-mail inválido"
            return
          }
      }
      if(!this.senha){
        this.check_erro_senha = true;
        this.msg_erro_senha = "Campo obrigatório"
         this.loadingBotaoLogin = false
        return
      }else{         
        if(this.senha.length < 6 || this.senha.length > 12 ){
           this.loadingBotaoLogin = false
          this.check_erro_senha = true;
          this.msg_erro_senha = "A senha deve possuir entre 6 e 12 caracteres"
          return
        }
      }
      if(!this.check_erro_email && !this.check_erro_senha){
        this.loginUsuario()
      }
    },
    async loginUsuario(){ // Falta verificar senha
     let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
               // "Origin": "http://localhost:8080", Funcionava só com isso, mas parece que está Ok
            }
        };
        const dados = {
            senha : this.senha,
            email:this.email
        }
      const usuario = await Axios.post("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/login",dados,axiosConfig).
      then((res) => {
        if(res.data.usuarioExiste){      
          this.loadingBotaoLogin = false
          this.atualizarUsuario(res.data.data)     
          this.$q.localStorage.set("permissao-tela-home",true)
          this.$router.push({name:"Home"});
          return;
        }else{
          this.loadingBotaoLogin = false
          this.$q.notify({message:"Login inválido ",color:"red"})
        }
      }).catch((erro) => {
          this.loadingBotaoLogin = false
          this.$q.notify({message:"Login inválido", color:'red'})
          console.log(erro)
        })
    },
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
        this.$q.loading.hide()
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
            fcm:''
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
  mounted(){
  }
}
</script>
<style scoped>
  
</style>