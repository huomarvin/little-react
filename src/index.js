import React from './react';
import ReactDOM from './react-dom';

// import React from 'react';
// import ReactDOM from 'react-dom';

const vdom = (
  <div className="container">
    <h1>Hello World</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1
      {' '}
      <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 === 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 === 2 && <div>2</div>}
    {true}
    {null}
    <span>这是一段内容</span>
    <button onClick={() => alert('你好')}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
    <input type="checkbox" value="13" checked="checked" />
  </div>
);

console.log('vdom', vdom);

ReactDOM.render(vdom, document.getElementById('root'));
