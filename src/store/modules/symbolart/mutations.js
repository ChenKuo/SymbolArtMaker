import { Layer, Group } from '@/js/SymbolArt'
import Vue from 'vue'

const mutations = {
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
    addLayer(state, parent, index) {
        let part = Layer('Layer ' + state.layers.length)
        remember([addParts(state, parent, index, part)])
    },
    addGroup(state, parent, index) {
        let part = Group('New Group')
        remember([addParts(state, parent, index, part)])
    },
    deletePart(state, parent, index) {
        remember([removeParts(state, parent, index, 1)])
        Vue.delete(state.selected, state.parts[parent].children[index])
    },
    movePart(state, parent, index, parentNew, indexNew) {
        remember([moveParts(state, parent, index, parentNew, indexNew)])
    },
    select(state, id) {
        state.selected = {}
        state.selected[id] = true
    },
    //editType is 0b000 to 0b111 flags for shape, color, vertex edits
    editPart(state, { id, edits, editType }) {
        remember([editPart(state, id, edits)])
        state.requestRenderUpdate[id] |= editType
    },
    // edit the part without saving to undo stack
    // must commit finishEdit as last edit
    continuousEdit(state, { id, edits, editType }) {
        //keep a copy of part before edit
        if (!state.beforeEdit[id]) {
            state.beforeEdit[id] = Object.assign({}, state.parts[id], edits)
        }
        Object.assign(state.parts[id], edits)
        state.requestRenderUpdate[id] |= editType
    },
    // edits must contain all properties changed during continuousEdit
    finishEdit(state, { id, edits, editType }) {
        if (state.beforeEdit[id]) {
            state.parts[id] = state.beforeEdit[id]
            remember([editPart(state, id, edits)])
            state.requestRenderUpdate[id] |= editType
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
            let undoer = undoer.pop()
            redoers.push(undoer())
        }
        state.redoStack.push(redoers)
    },
    redo(state) {
        let redoers = state.redoStack.pop()
        let undoers = []
        for (let i = 0; i < redoers.length; i++) {
            let redoer = redoer.pop()
            undoers.push(redoer())
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
    state.parts[parent].children.splice(index, 0, ids)
    return state => removeParts(state, parent, index, parts.length)
}
// removing consecutive parts from same parent
const removeParts = (state, parent, index, count) => {
    let ids = state.parts[parent].children.splice(index, count)
    for (let i = 0; i < ids.length; i++) Vue.delete(state.parts, ids[i])
    return state => addParts(state, parent, index, ...ids)
}
// moving consecutive parts from one parent(or index) to another
const moveParts = (state, parentOld, indexOld, parentNew, indexNew, count) => {
    let ids = state.parts[parentOld].children.splice(indexOld, count)
    state.parts[parentNew].children.splice(indexNew, 0, ids)
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
