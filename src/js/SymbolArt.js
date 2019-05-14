const SymbolArt = (
    name = 'Untitled Symbol Art',
    visibility = 'true',
    children = []
    /*ignore other properties for now*/
) => ({ name, visibility, children })

const Layer = (
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
    index: null,
})

const Group = (
    name = 'unnammed group',
    visibility = true,
    collapsed = false,
    children = []
) => ({ name, visibility, collapsed, children })

export default {SymbolArt, Layer, Group}