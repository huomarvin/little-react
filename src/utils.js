// diff 比对~
export function diff(nvdom, container, oldDom) {
  if (!oldDom) {
    momentEle(nvdom, container);
    return;
  }
  const oldvdom = oldDom && oldDom._vdom;
  const oldComponent = oldvdom.component;
  // 如果节点类型不同，直接执行替换动作
  if (nvdom.type !== oldvdom.type && typeof nvdom.type !== 'function') {
    const newDom = createDOMEle(nvdom);
    oldDom.parentNode.replaceChild(newDom, oldDom);
  } else if (typeof nvdom.type === 'function') {
    diffComponent(nvdom, oldComponent, oldDom, container);
  } else if (oldDom && nvdom.type === oldvdom.type) {
    // 处理纯文本节点变化
    if (nvdom.type === 'text') {
      updateTextNode(nvdom, oldvdom, oldDom);
    } else {
      // 处理元素节点变化
      updateNodeElement(nvdom, oldvdom, oldDom);
    }
  }
  //   console.log('nvdom.children', nvdom.children);
  // 深度优先遍历
  nvdom.children.forEach((child, i) => {
    diff(child, oldDom, oldDom.childNodes[i]);
  });
  //   // 如果老节点的数量小新节点的数量，则删掉老节点
  if (nvdom.children.length && nvdom.children.length < oldvdom.children.length) {
    for (let i = oldvdom.children.length - 1; i > nvdom.children.length - 1; i--) {
      unMountNode(oldDom.childNodes[i]);
    }
  }
}

function diffComponent(nvdom, oldComponent, oldDom, container) {
  if (isSameComponent(nvdom, oldComponent)) {
    updateComponent(nvdom, oldComponent, oldDom, container);
  } else {
    // 不是相同的组件，则执行挂载的流程
    momentEle(nvdom, container, oldDom);
  }
}

function updateComponent(vdom, oldComponent, oldDom, container) {
  console.log('debugger2');
  oldcomponent.componentWillReceiveProps(vdom.props);
  if (oldComponent.shouldComponentUpdate(vdom.props)) {
    const oldProps = oldComponent.props;
    oldComponent.componentWillUpdate(vdom.props);
    oldComponent.updateProps(vdom.props);
    const nvdom = oldComponent.render();
    console.log('dd', nvdom);
    nvdom.component = oldComponent;
    diff(nvdom, container, oldDom);
    oldComponent.componentDidUpdate(oldProps);
  }
}

// 挂载元素
function momentEle(vdom, container, oldDom) {
  if (isFunction(vdom)) {
    // 处理函数式组件和类组件
    momentComponent(vdom, container, oldDom);
  } else {
    // 处理原生组件
    momentNativeEle(vdom, container, oldDom);
  }
}
// 挂载组件元素
export function momentComponent(vdom, container, oldDom) {
  let nvdom;
  // class 组件
  if (isFunctionComponent(vdom)) {
    nvdom = buildFuncComponeont(vdom);
  } else {
    nvdom = buildClassComponent(vdom);
  }

  momentEle(nvdom, container, oldDom);
  const { component } = nvdom;

  if (component) {
    console.log('debugger', component);
    component.componentDidMount && component.componentDidMount();
  }
}

function isFunction(vdom) {
  return typeof vdom.type === 'function';
}

function buildFuncComponeont(vdom) {
  return vdom.type(vdom.props || {});
}

function buildClassComponent(vdom) {
  const component = new vdom.type(vdom.props || {});
  component.componentWillReceiveProps(vdom.props);
  const nvdom = component.render();
  nvdom.component = component;
  return nvdom;
}

// 挂载真实元素
function momentNativeEle(vdom, container, oldDom) {
  const dom = createDOMEle(vdom);
  if (!oldDom) {
    container.appendChild(dom);
  } else {
    container.insertBefore(dom, oldDom);
    unMountNode(oldDom);
  }

  if (vdom.component) {
    vdom.component.setDOM(dom);
  }
}
// 虚拟dom转换成真实dom
function createDOMEle(vdom) {
  // 如果是文本节点，则没有子节点
  let ele;
  if (vdom.type === 'text') {
    ele = document.createTextNode(vdom.props.textContent);
  } else {
    ele = document.createElement(vdom.type);
    addAttributes(ele, vdom);
    vdom.children.forEach((vcdom) => {
      momentEle(vcdom, ele);
    });
  }
  ele._vdom = vdom;
  return ele;
}

// 设置节点属性
function addAttributes(ele, vdom) {
  const { props } = vdom;
  Object.keys(vdom.props)
    .filter((key) => key !== 'children')
    .forEach((key) => {
      const propValue = props[key];
      if (isEventListener(key)) {
        ele.addEventListener(getEventName(key), propValue);
      }
      if (key === 'className') {
        ele.setAttribute('class', propValue);
      }
      ele.setAttribute(key, propValue);
    });
}

// 更新文本节点
function updateTextNode(nvdom, oldvdom, oldDom) {
  if (nvdom.props.textContent !== oldvdom.props.textContent) {
    oldDom.textContent = nvdom.props.textContent;
    // 更新vdom
    oldDom._vdom = nvdom;
  }
}

// 更新元素节点
function updateNodeElement(nvdom, oldvdom, oldDom) {
  const newProps = nvdom.props;
  const oldProps = oldvdom.props;
  const newKeys = Object.keys(newProps); // .filter((x) => x !== 'children');
  const oldKeys = Object.keys(oldProps); // .filter((x) => x !== 'children');

  // 处理新vdom有的
  newKeys.forEach((key) => {
    if (newProps[key] !== oldProps[key]) {
      if (isEventListener(key)) {
        const eventName = getEventName(key);
        oldProps[key] && oldDom.removeEventListener(eventName, oldProps[key]);
        oldDom.addEventListener(eventName, newProps[key]);
      } else if (key === 'className') {
        oldDom.setAttribute('class', newProps[key]);
      } else if (key !== 'children') {
        oldDom.setAttribute(key, newProps[key]);
      }
    }
  });
  // 删掉新vdom没有的
  oldKeys
    .filter((key) => !newKeys.includes[key])
    .forEach((key) => {
      if (isEventListener(key)) {
      } else {
        oldDom.removeAttribute(key);
      }
    });
}

function unMountNode(dom) {
  const vdom = dom._vdom;
  // 不是class组件或者函数组件，则直接删掉元素
  if (vdom.type === 'text') {
    dom.remove();
  } else if (vdom.type === 'function') {
    // TODO: 处理函数式组件与class组件的卸载 涉及到生命周期相关
  } else {
    // 删掉事件监听，清理内存
    Object.keys(vdom.props)
      .filter(isEventListener)
      .forEach((key) => {
        dom.removeEventListener(getEventName(key));
      });
  }
  const childNodes = dom.childNodes || [];
  // 递归删除子节点及相关事件监听
  childNodes.forEach((childNode) => unMountNode(childNode));
}

function isEventListener(key) {
  return key && key.startsWith('on');
}

function getEventName(key) {
  return key.slice(2).toLowerCase();
}

function isFunctionComponent(vdom) {
  const { type } = vdom;
  return typeof type === 'function' && !(type.prototype && type.prototype.render);
}

function isSameComponent(vdom, oldComponent) {
  return oldComponent && vdom.type === oldComponent.constructor;
}
