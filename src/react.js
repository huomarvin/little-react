import { diff } from './utils';

// 返回虚拟dom
function createElement(type, props, ...children) {
  const eleChildren = children
    .filter((child) => typeof child !== 'boolean' && child !== null) // 处理{true}{false}{null}三种情况
    .reduce((acc, child) => {
      if (child instanceof Object) {
        // 处理子节点是元素的情况
        acc.push(child);
      } else {
        // 处理子节点是文本的情况
        acc.push(createElement('text', { textContent: child }));
      }
      return acc;
    }, []);
  return {
    type,
    props: { ...props, children: eleChildren },
    children: eleChildren,
    $$typeof: Symbol('react.element'),
  };
}

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  updateProps(props) {
    this.props = props;
  }

  setState(state) {
    this.state = { ...this.state, ...state };
    this.componentWillReceiveProps(this.props);
    if (this.shouldComponentUpdate(this.props)) {
      const nvdom = this.render();
      const oldDom = this.getDOM();
      const container = oldDom.parentNode;
      console.log('debugger');
      diff(nvdom, container, oldDom);
    }
  }

  setDOM(dom) {
    this._dom = dom;
  }

  getDOM() {
    return this._dom;
  }

  // 生命周期函数
  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state;
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, preState) {}

  componentWillUnmount() {}
}

export default { createElement, Component };
