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
        let id = ++state.lastId
        remember(state, [addPart(state, parent, index, id, part)])
    },
    addGroup(state, { parent, index }) {
        let part = Group('New Group')
        let id = ++state.lastId
        remember(state, [addPart(state, parent, index, id, part)])
    },
    deletePart(state, { parent, index }) {
        remember(state, [removePart(state, parent, index)])
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
        remember(state, [editPart(state, id, edits, editType)])
    },
    // edit the part without saving to undo stack
    // must commit finishEdit as last edit
    continuousEdit(state, { id, edits, editType }) {
        //keep a copy of part before edit
        if (!state.beforeEdit[id]) {
            state.beforeEdit[id] = Object.assign({}, state.parts[id])
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
            Object.assign(state.parts[id], state.beforeEdit[id])
            remember(state, [editPart(state, id, edits, editType)])
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
        state.undoStack.push(undoers)
    },
}

const remember = (state, undoers) => {
    state.undoStack.push(undoers)
    state.redoStack = []
}

/* these functions perform changes to the state 
and return a function for undoing the change */

const addPart = (state, parent, index, id, part) => {
    Vue.set(state.parts, id, part)
    state.parts[parent].children.splice(index, 0, id)
    return state => removePart(state, parent, index)
}

const removePart = (state, parent, index) => {
    let [id] = state.parts[parent].children.splice(index, 1)
    let part = state.parts[id]
    Vue.delete(state.parts, id)
    return state => addPart(state, parent, index, id, part)
}
// moving consecutive parts from one parent(or index) to another
const moveParts = (state, parentOld, indexOld, parentNew, indexNew, count) => {
    let ids = state.parts[parentOld].children.splice(indexOld, count)
    state.parts[parentNew].children.splice(indexNew, 0, ...ids)
    return state =>
        moveParts(state, parentNew, indexNew, parentOld, indexOld, count)
}
// edit some properties of a part
const editPart = (state, id, edits, editType) => {
    let part = state.parts[id]
    for (let prop in edits) {
        let temp = part[prop]
        part[prop] = Math.round(edits[prop])
        edits[prop] = temp
    }
    Vue.set(
        state.requestRenderUpdate,
        id,
        state.requestRenderUpdate[id] | editType
    )
    return state => editPart(state, id, edits, editType)
}

export default mutations
