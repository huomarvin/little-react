function render(vdom, container) {
  momentEle(vdom, container);
}

function momentEle(vdom, container) {
  if (vdom !== false) {
    if (typeof vdom.type === 'function') {
      // TODO: 处理函数式组件和类组件
    } else {
      momentNativeEle(vdom, container);
    }
  }
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
