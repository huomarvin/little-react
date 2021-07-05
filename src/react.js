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

export default { createElement };
