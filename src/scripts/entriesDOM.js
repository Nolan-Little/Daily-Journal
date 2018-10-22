// construct and append elements given the tag name, textNode and value to print, and element to append
let constructElement = (element, textNode, value, appendTo) => {
  let tag = document.createElement(element);
  let text = document.createTextNode(`${textNode} ${value}`)
  tag.appendChild(text);
  appendTo.appendChild(tag);
}

const constructor = {
  
}