function render(vdom, container) {
  momentEle(vdom, container);
}

function momentEle(vdom, container) {
  if (typeof vdom.type === 'function') {
    // TODO: 处理函数式组件和类组件
  } else {
    momentNativeEle(vdom, container);
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
  vdom.children.forEach((vcdom) => {
    momentEle(vcdom, ele);
  });
  return ele;
}

export default { render };
