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