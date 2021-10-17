import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://dadosabertos.camara.leg.br/api/v2/',
    timeout: 60000,
  })

  const Axios = axios.create({
    timeout: 90000
  })

Vue.prototype.$axios = axiosInstance
export { axiosInstance, Axios }