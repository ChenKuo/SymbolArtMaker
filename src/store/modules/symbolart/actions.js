import loadSaml from '@/js/SymbolArtLoader'

const actions = {
    loadSamlFile({ commit }, file) {
        loadSaml(file, sa => commit('setSymbolArt', sa))
    },
}

export default actions
