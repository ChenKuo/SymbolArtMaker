import { SymbolArt, Layer, Group } from './SymbolArtParts'
import convert from 'xml-js'

const loadSaml = (file, callback) => {
    const reader = new FileReader()
    reader.onload = e => callback(samlToSA(e.target.result))
    reader.readAsText(file)
}
// parse saml text, return an object containing all parts of the symbol art
//i.e.: {0:{...SymbolArt}, 1:{...Group}, 2:{...Layer}, ...}
const samlToSA = saml => {
    let options = {
        ignoreDeclaration: true,
        ignoreInstruction: true,
        ignoreComment: true,
        ignoreCdada: true,
        ignoreDoctype: true,
        ignoreText: true,
        nativeTypeAtteibutes: false,
        alwaysArray: true,
    }
    let sa = convert.xml2js(saml, options).elements[0]
    let parts = {
        0: SymbolArt(sa.attributes.name, sa.attributes.visible === 'true', []),
    }
    let lastId = recursiveAdd(parts, 0, sa.elements)
    return { parts, lastId }
}

//recursively (depth-first) add parts[id]'s children to parts
// this function modify parts and the items in it
// return id of last added part
const recursiveAdd = (parts, id, elements) => {
    let part = parts[id]
    let children = elements
    for (let i = 0; i < children.length; i++) {
        let child = children[i]
        let attr = child.attributes
        if (child.name === 'layer') {
            let layer = makeLayer(attr)
            let childId = ++id
            part.children.push(childId)
            parts[childId] = layer
        } else if (child.name === 'g') {
            let group = makeGroup(attr)
            let childId = ++id
            part.children.push(childId)
            parts[childId] = group
            id = recursiveAdd(parts, childId, child.elements)
        }
    }
    return id
}

const makeLayer = attr => {
    const visible = attr.visible === 'true'
    const type = convertType(attr.type)
    const [r, g, b] = [1, 3, 5].map(i =>
        parseInt(attr.color.substring(i, i + 2), 16)
    )
    const a = attr.alpha * 255
    const { name, ltx, lty, lbx, lby, rtx, rty, rbx, rby } = attr
    return Layer(
        name,
        visible,
        type,
        r,
        g,
        b,
        a,
        ltx,
        lty,
        lbx,
        lby,
        rtx,
        rty,
        rbx,
        rby
    )
}

const makeGroup = attr => {
    return Group(attr.name, attr.visible, [])
}

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

export { loadSaml, samlToSA }
export default loadSaml

/// an example of how a json parsed from saml look ///
/*
let example = {
    type: 'element',
    name: 'sa',
    attributes: {
        name: '名称未設定',
        visible: 'true',
        version: '4',
        author: '0',
        width: '192',
        height: '96',
        sound: '0',
    },
    elements: [
        {
            type: 'element',
            name: 'layer',
            attributes: {
                name: 'layer1',
                visible: 'true',
                type: '240',
                color: '#fcfcfc',
                alpha: '1',
                ltx: '-16',
                lty: '-16',
                lbx: '-16',
                lby: '16',
                rtx: '16',
                rty: '-16',
                rbx: '16',
                rby: '16',
            },
        },
        {
            type: 'element',
            name: 'layer',
            attributes: {
                name: 'layer2',
                visible: 'true',
                type: '240',
                color: '#fcfcfc',
                alpha: '1',
                ltx: '-16',
                lty: '-16',
                lbx: '-16',
                lby: '16',
                rtx: '16',
                rty: '-16',
                rbx: '16',
                rby: '16',
            },
        },
        {
            type: 'element',
            name: 'g',
            attributes: { name: 'grooop', visible: 'true' },
            elements: [
                {
                    type: 'element',
                    name: 'layer',
                    attributes: {
                        name: 'lllaaay',
                        visible: 'true',
                        type: '240',
                        color: '#fcfcfc',
                        alpha: '1',
                        ltx: '-82',
                        lty: '-29',
                        lbx: '-82',
                        lby: '3',
                        rtx: '-50',
                        rty: '-29',
                        rbx: '-50',
                        rby: '3',
                    },
                },
                {
                    type: 'element',
                    name: 'layer',
                    attributes: {
                        name: 'yeeer',
                        visible: 'true',
                        type: '240',
                        color: '#fcfcfc',
                        alpha: '1',
                        ltx: '-42',
                        lty: '-41',
                        lbx: '-42',
                        lby: '-9',
                        rtx: '-10',
                        rty: '-41',
                        rbx: '-10',
                        rby: '-9',
                    },
                },
                {
                    type: 'element',
                    name: 'g',
                    attributes: { name: 'groupa', visible: 'true' },
                    elements: [
                        {
                            type: 'element',
                            name: 'g',
                            attributes: {
                                name: 'groupb',
                                visible: 'true',
                            },
                        },
                    ],
                },
            ],
        },
    ],
}
*/
