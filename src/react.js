// 返回虚拟dom
function createElement(type, props, ...children) {
  const eleChildren = children.reduce((acc, cur) => {
    if (cur instanceof Object) {
      // 处理子节点是元素的情况
      acc.push(cur);
    } else {
      // 处理子节点是文本的情况
      acc.push(createElement('text', { textContent: cur }));
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

export default { createElement };
