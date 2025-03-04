const second_attributes_map: Map<string, string> = new Map<string, string>()
export function apply_diffs(element1: HTMLElement, new_element: HTMLElement) {
  if (element1 === new_element) return
  if (element1.tagName !== new_element.tagName) {
    element1.replaceWith(new_element)
    return
  }
  const first_attributes = element1.attributes
  const second_attributes = new_element.attributes

  for (let i = 0; i < second_attributes.length; i++) {
    second_attributes_map.set(
      second_attributes[i].name,
      second_attributes[i].value,
    )
  }

  for (let i = first_attributes.length - 1; i >= 0; i--) {
    const attr_name = first_attributes[i].name
    if (!second_attributes_map.has(attr_name)) {
      element1.removeAttribute(attr_name)
    }
  }

  for (let i = 0; i < second_attributes.length; i++) {
    const attr_name = second_attributes[i].name
    if (element1.getAttribute(attr_name) !== second_attributes[i].value) {
      element1.setAttribute(attr_name, second_attributes[i].value)
    }
  }

  const first_children = [...element1.childNodes]
  const second_children = [...new_element.childNodes]

  for (
    let i = 0;
    i < second_children.length || i < first_children.length;
    i++
  ) {
    if (!second_children[i]) {
      element1.removeChild(first_children[i])
    } else if (!first_children[i]) {
      element1.appendChild(second_children[i].cloneNode(true))
    } else if (
      first_children[i].nodeType === Node.TEXT_NODE &&
      second_children[i].nodeType === Node.TEXT_NODE
    ) {
      if (first_children[i].textContent !== second_children[i].textContent) {
        first_children[i].textContent = second_children[i].textContent
      }
    } else if (first_children[i].nodeName !== second_children[i].nodeName) {
      element1.replaceChild(
        second_children[i].cloneNode(true),
        first_children[i],
      )
    } else {
      apply_diffs(
        first_children[i] as HTMLElement,
        second_children[i] as HTMLElement,
      )
    }
  }
}
