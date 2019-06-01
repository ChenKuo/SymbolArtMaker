const searchFile = callback => {
    const x = document.createElement('INPUT')
    x.setAttribute('type', 'file')
    x.click()
    x.onchange = () => callback(x.files[0])
}

export { searchFile }
