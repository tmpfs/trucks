skate.define('x-svg-icon', {
  props: {
    icon: {
      attribute: true,
      render: (elem, data) => {
        return data.newValue !== data.oldValue;
      }
    },
    'icon-size': {
      attribute: true,
      render: (elem, data) => {
        return data.newValue !== data.oldValue;
      }
    }
  }
});
