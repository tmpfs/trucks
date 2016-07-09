const templates = {
  "x-icon": function render(elem) {},
  "x-button": function render(elem) {}
};

function template(elem) {
  return templates[elem.tagName.toLowerCase()].call(elem, elem);
}

skate.define('x-icon', {});

skate.define('x-button', {});
