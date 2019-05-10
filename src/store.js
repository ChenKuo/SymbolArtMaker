import Vue from 'vue'
import Vuex from 'vuex'
import union from 'lodash/union'

Vue.use(Vuex)

// this function generate a unique id
const ID = (() => {
    let id = 0
    return () => id++
})()

const newLayer = (
    name = 'unnamed layer',
    visibility = true,
    type = 0,
    r = 0,
    g = 0,
    b = 0,
    a = 255,
    ltx = -16,
    lty = -16,
    lbx = -16,
    lby = 16,
    rtx = 16,
    rty = -16,
    rbx = 16,
    rby = 16
) => ({
    visibility: Boolean(visibility),
    type: Number(type),
    r: Number(r),
    g: Number(g),
    b: Number(b),
    a: Number(a),
    ltx: Number(ltx),
    lty: Number(lty),
    lbx: Number(lbx),
    lby: Number(lby),
    rtx: Number(rtx),
    rty: Number(rty),
    rbx: Number(rbx),
    rby: Number(rby),
    name: String(name),
    selected: false,
    index: null,
})

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
    requestUpdateVertLayers: [],
    requestUpdateTypeLayers: [],
    numberOfLayers: 0,
    shapeList: null,
}

const mutations = {
    loadSymbolArt(state, sa) {
        let parts = {}
        let treedata = []
        for (let i = sa.layer.length - 1; i >= 0; i--) {
            let l = sa.layer[i]._attributes
            let r = parseInt(l.color.substr(1, 2), 16)
            let g = parseInt(l.color.substr(3, 2), 16)
            let b = parseInt(l.color.substr(5, 2), 16)
            let a = Math.floor(l.alpha * 255)
            let type = convertType(l.type)
            l = { ...l, r, g, b, a, type }
            l = newLayer(
                l.name,
                l.visibility,
                type,
                r,
                g,
                b,
                a,
                l.ltx,
                l.lty,
                l.lbx,
                l.lby,
                l.rtx,
                l.rty,
                l.rbx,
                l.rby
            )
            let id = ID()
            parts[id] = l
            treedata.push({ id })
        }
        state.numberOfLayers = sa.layer.length
        state.parts = parts
        state.treeData = treedata
        let list = []
        list.length = state.numberOfLayers
        const updateList = (id, index) => {
            list[index] = id
            state.parts[id].index = index
        }
        DFT(0, state.treeData, updateList)
        state.requestRebuildList = list
        state.selected = []
    },
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
        state.requestRebuildList = list
    },
    select(state, id) {
        for (let i = 0; i < state.selected.length; i++) {
            state.parts[state.selected[i]].selected = false
        }
        state.selected = [id]
        state.parts[id].selected = true
    },
    editLayerType(state, { id, type }) {
        let layer = state.parts[id]
        layer.type = type
        // eslint-disable-next-line prettier/prettier
        state.requestUpdateTypeLayers = union(state.requestUpdateTypeLayers, [id])
    },
    editLayerColor(state, { id, color }) {
        let layer = state.parts[id]
        Object.assign(layer, color)
        // eslint-disable-next-line prettier/prettier
        state.requestUpdateColorLayers = union(state.requestUpdateColorLayers, [id])
    },
    editLayerVertices(state, { id, vertices }) {
        let layer = state.parts[id]
        Object.assign(layer, vertices)
        // eslint-disable-next-line prettier/prettier
        state.requestUpdateVertLayers = union(state.requestUpdateVertLayers, [id])
    },
    clearRebuildListRequest(state) {
        state.requestRebuildList = null
    },
    clearUpdateColorRequest(state) {
        state.requestUpdateColorLayers = []
    },
    clearUpdateVertRequest(state) {
        state.requestUpdateVertLayers = []
    },
    clearUpdateTypeRequest(state) {
        state.requestUpdateTypeLayers = []
    },
    setShapeList(state, { shapeList }) {
        state.shapeList = shapeList
    },
}

const getters = {}

const actions = {}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
})

const convertType = t => {
    t = +t + 1
    if (241 <= t && t <= 292) return t - 241
    if (321 <= t && t <= 359) return t - 321 + 52
    if (401 <= t && t <= 439) return t - 401 + 91
    if (481 <= t && t <= 517) return t - 481 + 130
    if (561 <= t && t <= 581) return t - 561 + 167
    if (641 <= t && t <= 697) return t - 641 + 188
    if (1 <= t && t <= 80) return t - 1 + 245
    if (721 <= t && t <= 754) return t - 721 + 512
    return 0
}
