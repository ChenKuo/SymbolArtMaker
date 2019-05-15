import Vue from 'vue'
import Vuex from 'vuex'
import { SymbolArt, Layer, Group } from '@/js/SymbolArt.js'
import union from 'lodash/union'
import cloneDeep from 'lodash/cloneDeep'
import clone from 'lodash/clone'

Vue.use(Vuex)

// this function create a function that generate
//consectutaive integers for unique id
const IDGenerator = (i = 0) => () => i++
const ID = IDGenerator(1) //for id of parts

//state of a symbol art
const state = {
    parts: { 0: SymbolArt() }, //all parts of a symbolart
    //treeData: [], //tree structure of layers and groups
    selected: {}, //selected layers and groups
    layers: [],
    requestUpdateColorLayers: [],
    requestUpdateVertLayers: [],
    requestUpdateTypeLayers: [],
    shapeList: null,
    //save change for undo redo
    undoStack: [],
    redoStack: [],
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

const createLayerList = state => {
    let list = []
    const updateList = (id, index) => {
        list[index] = id
        state.parts[id].index = index
    }
    DFT(0, state.treeData, updateList)
    return list
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
            l = Layer(
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
            treedata.push(id)
        }
        state.parts = parts
        state.treeData = treedata
        state.layers = createLayerList(state)
        state.selected = {}
        state.undoStack = []
        state.redoStack = []
    },
    addLayer(state) {
        let id = ID()
        let l = Layer('Layer ' + state.layers.length)
        let changed = { partsAdded: {}, treeData: null }
        changed.partsAdded[id] = l
        // TODO: OPTIMIZE: clone only the changed part
        changed.treeData = cloneDeep(state.treeData)
        state.undoStack.push(changed)
        state.redoStack = []
        Vue.set(state.parts, id, l)
        state.treeData.splice(0, 0, id)
        state.layers = createLayerList(state)
    },
    addGroup(state) {
        let id = ID()
        let g = Group('New Group')
        //save the current state before change
        let changed = { partsAdded: {}, treeData: cloneDeep(state.treeData) }
        changed.partsAdded[id] = g
        state.undoStack.push(changed)
        state.redoStack = []
        Vue.set(state.parts, id, g)
        state.treeData.splice(0, 0, id)
        //state.layers = createLayerList(state)
    },

    deleteLayer(state, id) {
        let index = state.parts[id].index
        let changed = { partsRemoved: {}, treeData: null }
        changed.partsRemoved[id] = state.parts[id]
        changed.treeData = cloneDeep(state.treeData)
        state.undoStack.push(changed)
        state.redoStack = []
        state.treeData.splice(index, 1)
        state.layers = createLayerList(state)
        Vue.delete(state.parts, id)
        Vue.delete(state.selected, id)
    },
    select(state, id) {
        state.selected = {}
        state.selected[id] = true
    },
    editLayerType(state, { id, type }) {
        let layer = state.parts[id]
        let changed = { shapeEdit: {} }
        changed.shapeEdit[id] = layer.type
        state.undoStack.push(changed)
        state.redoStack = []
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
    rememberColor(state, ids) {
        let change = { colorEdit: null }
        for (let i = 0; i < ids.length; i++) {
            let l = state.parts[ids[i]]
            change.colorEdit[ids[i]] = { r: l.r, g: l.g, b: l.b, a: l.a }
        }
        state.undoStack.push(change)
        state.redoStack = []
    },
    rememberVertices(state, ids) {
        let change = { vertexEdit: null }
        for (let i = 0; i < ids.length; i++) {
            let l = state.parts[ids[i]]
            change.vertexEdit[ids[i]] = {
                lbx: l.lbx,
                lby: l.lby,
                ltx: l.ltx,
                lty: l.lty,
                rbx: l.rbx,
                rby: l.rby,
                rtx: l.rtx,
                rty: l.rty,
            }
        }
        state.undoStack.push(change)
        state.redoStack = []
    },
    remember(state, ids) {
        let change = {
            edited: ids.reduce((edited, id) => {
                edited[id] = clone(state.parts[id])
                return edited
            }, {}),
        }
        state.undoStack.push(change)
        state.redoStack = []
    },
    undo(state) {
        if (state.undoStack.length == 0) {
            console.log('no more undo')
            return
        }
        let change = state.undoStack.pop()
        if (change.partsAdded) {
            // remove the parts
            for (let id in change.partsAdded) {
                Vue.delete(state.parts, id)
                Vue.delete(state.selected, id)
            }
        }
        if (change.partsRemoved) {
            // add parts back in
            for (let id in change.partsRemoved) {
                Vue.set(state.parts, id, change.partsRemoved[id])
            }
        }
        if (change.shapeEdit) {
            //swap the edit
            for (let id in change.shapeEdit) {
                let t = state.parts[id].type
                state.parts[id].type = change.shapeEdit[id]
                change.shapeEdit[id] = t
                state.requestUpdateTypeLayers = union(
                    state.requestUpdateTypeLayers,
                    [id]
                )
            }
        }
        if (change.edited) {
            //swap the edited layers
            for (let id in change.edited) {
                let p = state.parts[id]
                state.parts[id] = change.edited[id]
                change.edited[id] = p
            }
        }

        if (change.treeData) {
            let tree = state.treeData
            state.treeData = change.treeData
            change.treeData = tree
            state.layers = createLayerList(state)
        }

        state.redoStack.push(change)
    },
    redo(state) {
        if (state.redoStack.length === 0) {
            console.log('no more redo')
            return
        }
        let change = state.redoStack.pop()

        if (change.partsAdded) {
            // re-add the parts
            for (let id in change.partsAdded) {
                Vue.set(state.parts, id, change.partsAdded[id])
            }
        }
        if (change.partsRemoved) {
            // re-remove the parts
            for (let id in change.partsRemoved) {
                Vue.delete(state.parts, id)
                Vue.delete(state.selected, id)
            }
        }
        if (change.shapeEdit) {
            //swap the edit
            for (let id in change.shapeEdit) {
                let t = state.parts[id].type
                state.parts[id].type = change.shapeEdit[id]
                change.shapeEdit[id] = t
                state.requestUpdateTypeLayers = union(
                    state.requestUpdateTypeLayers,
                    [id]
                )
            }
        }
        if (change.edited) {
            //swap the edited layers
            for (let id in change.edited) {
                let p = state.parts[id]
                state.parts[id] = change.edited[id]
                change.edited[id] = p
            }
        }
        if (change.treeData) {
            let tree = state.treeData
            state.treeData = change.treeData
            change.treeData = tree
            state.layers = createLayerList(state)
        }
        state.undoStack.push(change)
    },
}

const getters = {
    selected(state) {
        return Object.keys(state.selected)
    },
}

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
