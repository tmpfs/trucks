const templates = {
  "simple-component": function render(elem) {
    skate.vdom.element("p", () => {
      skate.vdom.text("Simple component.");
    });
  }
};
function template(elem) {
  return templates[elem.tagName](elem);
}
skate.define('simple-component', {
  render: template
});
