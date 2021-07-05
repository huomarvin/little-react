function render(vdom, container) {
  momentEle(vdom, container);
}

function momentEle(vdom, container) {
  if (typeof vdom.type === 'function') {
    // 处理函数式组件和类组件
    momentComponent(vdom, container);
  } else {
    // 处理原生组件
    momentNativeEle(vdom, container);
  }
}

function momentComponent(vdom, container) {
  let nvdom;
  // class 组件
  if (vdom.type.prototype.render) {
    nvdom = new vdom.type(vdom.props).render();
  } else {
    nvdom = vdom.type(vdom.props);
  }
  momentEle(nvdom, container);
}

function momentNativeEle(vdom, container) {
  const dom = createDOMEle(vdom);
  container.appendChild(dom);
}

function createDOMEle(vdom) {
  // 如果是文本节点，则没有子节点
  if (vdom.type === 'text') {
    return document.createTextNode(vdom.props.textContent);
  }
  const ele = document.createElement(vdom.type);
  const { props } = vdom;
  Object.keys(vdom.props)
    .filter((key) => key !== 'children')
    .forEach((key) => {
      const propValue = props[key];
      if (key.startsWith('on')) {
        ele.addEventListener(key.slice(2).toLowerCase(), propValue);
      }
      if (key === 'className') {
        ele.setAttribute('class', propValue);
      }
      ele.setAttribute(key, propValue);
    });
  vdom.children.forEach((vcdom) => {
    momentEle(vcdom, ele);
  });
  return ele;
}

export default { render };
