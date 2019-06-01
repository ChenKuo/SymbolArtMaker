import mutations from './mutations.js'
import actions from './actions.js'
import { SymbolArt } from '@/js/SymbolArtParts.js'

//state of a symbol art
const state = {
    parts: { 0: SymbolArt() }, //all layers and groups in the symbol art, parts[0] is the symbol art itself
    lastId: 0, //increment lastId every time a part is added to make unique id
    selected: {}, //selected layers and groups
    beforeEdit: {},
    requestRenderUpdate: {},
    shapeList: null, //maybe move this to another module
    //save change for undo redo
    undoStack: [],
    redoStack: [],
}

const getters = {
    // selected parts id as array
    selected(state) {
        return Object.keys(state.selected)
    },
    // return the selected layer
    selectedLayerId(state) {
        const selected = Object.keys(state.selected)
        if (selected.length === 1) {
            const id = selected[0]
            const part = state.parts[id]
            if (!part.children) {
                return id
            }
        }
        return null
    },
    // array of layers id in order
    _info(state) {
        let parts = state.parts
        let layers = []
        let partsInfo = {}
        let layerIndexOf = {}
        //recursive depth-first traversal of parts
        const DFT = (index, children, parentId) => {
            for (let i = 0; i < children.length; i++) {
                let id = children[i]
                let child = parts[id]
                partsInfo[id] = { parentId, index: i}
                if (child.children) {
                    index = DFT(index, child.children, id)
                } else {
                    layers[index] = id
                    layerIndexOf[id] = index
                    index++
                }
            }
            return index
        }
        DFT(0, parts[0].children, 0)
        return { layers, layerIndexOf, partsInfo }
    },
    layers(state, getters) {
        return getters._info.layers
    },
    // the opposite of layers, get index by id
    layerIndexOf(state, getters) {
        return getters._info.layerIndexOf
    },
    partInfo: (state, getters) => id => {
        return getters._info.partsInfo[id]
    },
}

export default {
    state,
    getters,
    mutations,
    actions,
}
