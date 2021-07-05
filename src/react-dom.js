import { diff } from './utils';

function render(vdom, container, oldDom = container.firstChild) {
  diff(vdom, container, oldDom);
}

export default { render };
