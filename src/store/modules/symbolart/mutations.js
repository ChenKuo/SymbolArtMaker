import { SymbolArt, Layer, Group } from '@/js/SymbolArt.js'

// this function create a function that generate
//consectutaive integers for unique id
const IDGenerator = (i = 0) => () => i++
const ID = IDGenerator(1) //for id of parts


const mutations = {
    // here sa is already processed into parts
    setSymbolArt(state, sa) {
        state.parts = sa
        state.selected = {}
        state.requestUpdateColorLayers = {}
        state.requestUpdateVertLayers = {}
        state.equestUpdateTypeLayers = {}
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
    setGroupChildren(state, { id, children }) {},
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

export default mutations