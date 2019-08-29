import { loadSaml, samlToSA } from '@/js/SymbolArtLoader'

const actions = {
    loadSamlFile({ commit }, file) {
        loadSaml(file, sa => commit('setSymbolArt', sa))
    },
    loadReferenceImage({ commit }, file) {
        const reader = new FileReader()
        reader.onload = () => commit('setReferenceImage', reader.result)
        reader.readAsDataURL(file)
    },
    fetchSaml({ commit }, url) {
        const xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                const sa = samlToSA(this.responseText)
                commit('setSymbolArt', sa)
            }
        }
        xhttp.open('GET', url, true)
        xhttp.send()
    }
}

export default actions
