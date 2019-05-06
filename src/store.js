import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// this function generate a unique id
const ID = (() => {
    let id = 0
    return () => id++
})()

const newLayer = () => {
    return {
        visibility: true,
        type: 0,
        r: 255,
        g: 255,
        b: 255,
        a: 255,
        ltx: -16,
        lty: -16,
        lbx: -16,
        lby: 16,
        rtx: 16,
        rty: -16,
        rbx: 16,
        rby: 16,
    }
}

//state of a symbol art
const state = {
    layers: {}, //all layers
    layerlist: [], //all layers' id in order
    treedata: [], //tree structure of layers and groups
    selected: [], //selected layers and groups
    nodes: {},
}

const mutations = {
    addLayer(state) {
        let id = ID()
        let layer = newLayer()
        Vue.set(state.layers, id, layer)
        state.layerlist.splice(0, 0, id)
        state.treedata.splice(0, 0, id)
        Vue.set(state.nodes, id, { name: 'Layer ' + id, selected: false })
    },
    select(state, id) {
        for (let i = 0; i < state.selected.length; i++) {
            state.nodes[state.selected[i]].selected = false
        }
        state.selected = [id]
        state.nodes[id].selected = true
    },
    editLayerColor(state, { id, color }) {
        let layer = state.layers[id]
        layer.r = color.r
        layer.g = color.g
        layer.b = color.b
        layer.a = color.a
    }
}

const getters = {}

const actions = {}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
})
