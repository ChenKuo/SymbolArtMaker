import { loadSaml } from '@/js/SymbolArtLoader'

const actions = {
    loadSamlFile({ commit }, file) {
        loadSaml(file, sa => commit('setSymbolArt', sa))
    },
    loadReferenceImage({ commit }, file) {
        const reader = new FileReader()
        reader.onload = () => commit('setReferenceImage', reader.result)
        reader.readAsDataURL(file)
    }
}

export default actions
