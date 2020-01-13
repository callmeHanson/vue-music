export function hasClass(el, className) {
  el.classList.contains(className)
}

export function addClass(el, className) {
  el.classList.add(className)
}

export function getData(el, name) {
  const prefix = 'data-'
  name = prefix + name
  return el.getAttribute(name)
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformName = {
    webkit: 'webkitTransform',
    Moz: 'mozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformName) {
    if (elementStyle[transformName[key]] !== undefined) return key
  }

  return false
})()

export function prefixStyle(style) {
  if (!vendor) return false

  if (vendor === 'standard') return style

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}