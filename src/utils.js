// diff 比对~
export function diff(nvdom, container, oldDom) {
  if (!oldDom) {
    momentEle(nvdom, container);
    return;
  }
  const oldvdom = oldDom && oldDom._vdom;
  // 如果节点类型不同，直接执行替换动作
  if (nvdom.type !== oldvdom.type) {
    const newDom = createDOMEle(nvdom);
    oldDom.parentNode.replaceChild(newDom, oldDom);
  } else if (typeof nvdom.type === 'function') {
    // TODO: 处理函数式组件和类组件
    //   diffCoponeont()
  } else if (oldDom && nvdom.type === oldvdom.type) {
    if (nvdom.type === 'text') {
      updateTextNode(nvdom, oldvdom, oldDom);
    } else {
      updateNodeElement(nvdom, oldvdom, oldDom);
    }
  }
}

// 挂载元素
export function momentEle(vdom, container) {
  if (typeof vdom.type === 'function') {
    // 处理函数式组件和类组件
    momentComponent(vdom, container);
  } else {
    // 处理原生组件
    momentNativeEle(vdom, container);
  }
}
// 挂载组件元素
export function momentComponent(vdom, container) {
  let nvdom;
  // class 组件
  if (vdom.type.prototype.render) {
    const component = new vdom.type(vdom.props);
    nvdom = component.render();
  } else {
    nvdom = vdom.type(vdom.props);
  }
  momentEle(nvdom, container);
}
// 挂载真实元素
function momentNativeEle(vdom, container) {
  const dom = createDOMEle(vdom);
  dom._vdom = vdom;
  container.appendChild(dom);
}
// 虚拟dom转换成真实dom
export function createDOMEle(vdom) {
  // 如果是文本节点，则没有子节点
  let ele;
  if (vdom.type === 'text') {
    ele = document.createTextNode(vdom.props.textContent);
  } else {
    ele = document.createElement(vdom.type);
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
    vdom.children.forEach((vcdom) => {
      momentEle(vcdom, ele);
    });
  }
  return ele;
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
  const newKeys = Object.keys(newProps).filter((x) => x !== 'children');
  const oldKeys = Object.keys(oldProps).filter((x) => x !== 'children');

  // 处理新vdom有的
  newKeys.forEach((key) => {
    if (newProps[key] !== oldProps[key]) {
      if (isEventListener(key)) {
        const eventName = getEventName(key);
        oldDom.removeEventListener(eventName, oldProps[key]);
        oldDom.addEventListener(eventName, newProps[key]);
      } else if (key === 'className') {
        oldDom.setAttribute('class', newProps[key]);
      } else {
        oldDom.setAttribute(key, newProps[key]);
      }
    }
  });
  // 删掉新vdom没有的
  oldKeys
    .filter((key) => !newKeys.includes[key])
    .forEach((key) => {
      oldDom.removeAttribute(key);
    });
  // 如果老节点的数量小新节点的数量，则删掉老节点
  if (nvdom.children.length < oldvdom.children.length) {
    for (let i = oldvdom.children.length - 1; i > nvdom.children.length - 1; i--) {
      unMountNode(oldDom.childNodes[i]);
    }
  }
  nvdom.children.forEach((child, i) => {
    diff(child, oldDom, oldDom.childNodes[i]);
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
    vdom.props.filter(isEventListener).forEach((key) => {
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
