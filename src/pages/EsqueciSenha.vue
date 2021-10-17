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
                    bg-color="white"
                    v-model="email"
                    label="Email"
                    name="email"
                    :error="check_erro_email"
                    :error-message="msg_erro_email"
                    @input="check_erro_email = false"
                />

                <div style="padding-top:16px" class="row justify-center">
                    <div class="col-6">
                        <q-btn @click="$router.push({name:'Login'})" style="min-width:150px" text-color="white" label="Voltar" outline  rounded/>
                    </div>
                    <div class="col-6">
                        <q-btn style="min-width:150px" text-color="white" label="Enviar senha" no-caps type="submit" color="primary"  rounded/>
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
    
     email:"",
     msg_erro_email:"",
     check_erro_email:false,
    }
  },
  methods:{
    validacaoFormulario(){
        this.check_erro_email = false;

        if(!this.email){
            this.check_erro_email = true;
            this.msg_erro_email = "Campo obrigatório"
            this.$q.loading.hide()
            return
        }else{
            if(this.email.length < 5 || !this.email.includes("@") || !this.email.includes(".")){
                this.$q.loading.hide()
                this.check_erro_email = true;
                this.msg_erro_email = "E-mail inválido"
                return
            }
        }
        if(!this.check_erro_email ){
            this.verificarUsuario()
        }
    },

    async verificarUsuario(){
        const usuario = await Axios.get("https://us-central1-transpop-9b36c.cloudfunctions.net/app/api/usuarios/procurar/usuario/" + this.email).
        then((res) => {
            console.log(res);

            if(res.data.usuarioExiste){      
                this.$q.loading.hide()     
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
            this.$q.loading.hide()
            this.$q.notify({message:"Erro", color:'red'})
            console.log(erro)
        })
    },
    
  },
  mounted(){
     
  }
}
</script>