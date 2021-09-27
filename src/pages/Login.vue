<template>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
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
      />

      <q-toggle v-model="aceitaTermos" label="Eu aceito a licença de termos" />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
</template>
<script>
export default {
  data () {
    return {
     nome:"",
     email:"",
     senha:"",
     aceitaTermos:false
    }
  },
  mounted(){
      console.log("LOGIN");
  }
}
</script>