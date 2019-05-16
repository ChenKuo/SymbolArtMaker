import { SymbolArt, Layer, Group } from '@/js/SymbolArtParts'
import Vue from 'vue'

const mutations = {
    newSymbolArt(state) {
        state.parts = { 0: SymbolArt() }
        state.lastId = 0
        state.selected = {}
        state.requestUpdateColorLayers = {}
        state.requestUpdateVertLayers = {}
        state.equestUpdateTypeLayers = {}
        state.undoStack = []
        state.redoStack = []
    },
    // here sa is already processed into parts
    // TODO: make buffer for switching between multiple symbolarts
    // instead of replacing existing symbolart
    setSymbolArt(state, sa) {
        state.parts = sa.parts
        state.lastId = sa.lastId
        state.selected = {}
        state.requestUpdateColorLayers = {}
        state.requestUpdateVertLayers = {}
        state.equestUpdateTypeLayers = {}
        //start history from a fresh state
        state.undoStack = []
        state.redoStack = []
    },
    // add a new layer under a parent at index(within the parent)
    addLayer(state, { parent, index }) {
        let part = Layer('Layer ' + state.lastId)
        remember(state, [addParts(state, parent, index, part)])
    },
    addGroup(state, { parent, index }) {
        let part = Group('New Group')
        remember(state, [addParts(state, parent, index, part)])
    },
    deletePart(state, { parent, index }) {
        remember(state, [removeParts(state, parent, index, 1)])
        Vue.delete(state.selected, state.parts[parent].children[index])
    },
    movePart(state, { parentOld, indexOld, parentNew, indexNew }) {
        remember(state, [
            moveParts(state, parentOld, indexOld, parentNew, indexNew, 1),
        ])
    },
    select(state, id) {
        state.selected = {}
        state.selected[id] = true
    },
    //editType is 0b000 to 0b111 flags for shape, color, vertex edits
    editPart(state, { id, edits, editType }) {
        remember(state, [editPart(state, id, edits)])
        Vue.set(
            state.requestRenderUpdate,
            id,
            state.requestRenderUpdate[id] | editType
        )
    },
    // edit the part without saving to undo stack
    // must commit finishEdit as last edit
    continuousEdit(state, { id, edits, editType }) {
        //keep a copy of part before edit
        if (!state.beforeEdit) {
            state.beforeEdit[id] = Object.assign({}, state.parts[id], edits)
        }

        Object.assign(state.parts[id], edits)
        Vue.set(
            state.requestRenderUpdate,
            id,
            state.requestRenderUpdate[id] | editType
        )
    },
    // edits must contain all properties changed during continuousEdit
    finishEdit(state, { id, edits, editType }) {
        if (state.beforeEdit[id]) {
            state.parts[id] = state.beforeEdit[id]
            remember(state, [editPart(state, id, edits)])
            Vue.set(
                state.requestRenderUpdate,
                id,
                state.requestRenderUpdate[id] | editType
            )
            delete state.beforeEdit[id]
        }
    },
    clearRenderUpdateRequest(state) {
        state.requestRenderUpdate = {}
    },
    setShapeList(state, { shapeList }) {
        state.shapeList = shapeList
    },
    undo(state) {
        let undoers = state.undoStack.pop()
        let redoers = []
        for (let i = 0; i < undoers.length; i++) {
            let undoer = undoers.pop()
            redoers.push(undoer(state))
        }
        state.redoStack.push(redoers)
    },
    redo(state) {
        let redoers = state.redoStack.pop()
        let undoers = []
        for (let i = 0; i < redoers.length; i++) {
            let redoer = redoers.pop()
            undoers.push(redoer(state))
        }
        state.redoStack.push(redoers)
    },
}

const remember = (state, undoers) => {
    state.undoStack.push(undoers)
    state.redoStack = []
}

/* these functions perform changes to the state 
and return a function for undoing the change */

// adding consecutive parts to same parent
const addParts = (state, parent, index, ...parts) => {
    let ids = []
    for (let i = 0; i < parts.length; i++) {
        let id = ++state.lastId
        Vue.set(state.parts, id, parts[i])
        ids.push(id)
    }
    state.parts[parent].children.splice(index, 0, ...ids)
    return state => removeParts(state, parent, index, parts.length)
}
// removing consecutive parts from same parent
const removeParts = (state, parent, index, count) => {
    let ids = state.parts[parent].children.splice(index, count)
    let parts = ids.map(id => state.parts[id])
    for (let i = 0; i < ids.length; i++) Vue.delete(state.parts, ids[i])
    return state => addParts(state, parent, index, ...parts)
}
// moving consecutive parts from one parent(or index) to another
const moveParts = (state, parentOld, indexOld, parentNew, indexNew, count) => {
    let ids = state.parts[parentOld].children.splice(indexOld, count)
    state.parts[parentNew].children.splice(indexNew, 0, ...ids)
    return state =>
        moveParts(state, parentNew, indexNew, parentOld, indexOld, count)
}
// edit some properties of a part
const editPart = (state, id, edits) => {
    let part = state.parts[id]
    for (let prop in edits) {
        let temp = part[prop]
        part[prop] = edits[prop]
        edits[prop] = temp
    }
    return state => editPart(state, id, edits)
}

export default mutations
