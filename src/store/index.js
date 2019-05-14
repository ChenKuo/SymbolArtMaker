import Vue from 'vue'
import Vuex from 'vuex'
import symbolart from './modules/symbolart'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        symbolart,
    },
    strict: debug,
})
