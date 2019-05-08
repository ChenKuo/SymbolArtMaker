import Vue from 'vue'
import Vuex from 'vuex'
import union from 'lodash/union'

Vue.use(Vuex)

// this function generate a unique id
const ID = (() => {
    let id = 0
    return () => id++
})()

const newLayer = (name = 'unnamed layer') => {
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
        name: name,
        selected: false,
        index: null,
    }
}

//depth-first traversal with callback(node,index) on leaf nodes
const DFT = (index, children, callback) => {
    for (let i = 0; i < children.length; i++) {
        let child = children[i]
        if (child.children) {
            index = DFT(child.children, callback)
        } else {
            callback(child.id, index)
            index++
        }
    }
    return index
}


//state of a symbol art
const state = {
    parts: {}, //all layers
    treeData: [], //tree structure of layers and groups
    selected: [], //selected layers and groups
    requestRebuildList: null,
    requestUpdateColorLayers: [],
    requestUpdateVerticesLayers: [],
    requestUpdateTypeLayers: [],
    numberOfLayers: 0,
    symbolImages: null,
}

const mutations = {
    addLayer(state) {
        let id = ID()
        let l = newLayer('Layer ' + id)
        Vue.set(state.parts, id, l)
        state.treeData.splice(0, 0, { id })
        state.numberOfLayers++
        let list = []
        list.length = state.numberOfLayers
        const updateList = (id, index) => {
            list[index] = id
            state.parts[id].index = index
        }
        DFT(0, state.treeData, updateList)
        state.requestRebuildList = true
    },
    select(state, id) {
        for (let i = 0; i < state.selected.length; i++) {
            state.parts[state.selected[i]].selected = false
        }
        state.selected = [id]
        state.parts[id].selected = true
    },
    editLayerColor(state, { id, color }) {
        let layer = state.parts[id]
        layer.r = color.r
        layer.g = color.g
        layer.b = color.b
        layer.a = color.a
        // eslint-disable-next-line prettier/prettier
        state.requestUpdateColorLayers = union(state.requestUpdateColorLayers, [id])
    },
    //editLayerVertices(state, { id, color }) {},
    clearRebuildListRequest(state) {
        state.requestRebuildList = false
    },
    clearUpdateColorRequest(state){
        state.requestUpdateColorLayers = []
    },
    clearUpdateVerticesRequest(state){
        state.requestUpdateVerticesLayers = []
    },
    clearUpdateTypeRequest(state){
        state.requestUpdateTypeLayers = []
    },
    setSymbolImages(state, { imageList }) {
        state.symbolImages = imageList
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
