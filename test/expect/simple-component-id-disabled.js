const templates = {
  "simple-component": function render(elem) {
    skate.vdom.element("p", () => {
      skate.vdom.text("Simple component.");
    });
  }
};

function template(elem) {
  return templates[elem.tagName.toLowerCase()].call(elem, elem);
}

skate.define('{{id}}', {
  render: template
});
