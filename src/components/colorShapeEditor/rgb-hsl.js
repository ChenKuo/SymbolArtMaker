/* 
algorithm from wikipedia 
https://en.wikipedia.org/wiki/HSL_and_HSV#Color_conversion_formulae
 */
//rgb in [0,1]
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

function HSLToRGB(hsl) {
    const { h, s, l } = hsl
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0
    if (0 <= h && h < 60) {
        r = c
        g = x
        b = 0
    } else if (60 <= h && h < 120) {
        r = x
        g = c
        b = 0
    } else if (120 <= h && h < 180) {
        r = 0
        g = c
        b = x
    } else if (180 <= h && h < 240) {
        r = 0
        g = x
        b = c
    } else if (240 <= h && h < 300) {
        r = x
        g = 0
        b = c
    } else if (300 <= h && h < 360) {
        r = c
        g = 0
        b = x
    }
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return { r, g, b }
}

function RGBToHSL(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255
    g /= 255
    b /= 255

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0
    // Calculate hue
    // No difference
    if (delta == 0) h = 0
    // Red is max
    else if (cmax == r) h = ((g - b) / delta) % 6
    // Green is max
    else if (cmax == g) h = (b - r) / delta + 2
    // Blue is max
    else h = (r - g) / delta + 4

    h = Math.round(h * 60)

    // Make negative hues positive behind 360°
    if (h < 0) h += 360

    // Calculate lightness
    l = (cmax + cmin) / 2

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

    return { h, s, l }
}
export { rgb2hsl, hsl2rgb, HSLToRGB, RGBToHSL }
