/* 
algorithm from wikipedia 
https://en.wikipedia.org/wiki/HSL_and_HSV#Color_conversion_formulae
 */

const rgb2hsl = (r, g, b) => {
    let min = Math.min(r, g, b)
    let max = Math.max(r, g, b)
    let h = 0
    let s = 0
    let l = 0.5 * (max + min)
    if (max !== min) {
        let dif = max - min
        switch (max) {
            case r:
                h = 60 * (0 + (g - b) / dif)
                break
            case g:
                h = 60 * (2 + (b - r) / dif)
                break
            case b:
                h = 60 * (4 + (r - b) / dif)
                break
        }
        s = (max - l) / Math.min(l, 1 - l)
    }
    return { h, s, l }
}

const hsl2rgb = (h, s, l) => {
    let a = s * Math.min(l, 1 - l)
    const f = (n, k = (h / 30 + n) % 12) =>
        l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return { r: f(0), g: f(8), b: f(4) }
}

export default { rgb2hsl, hsl2rgb }
