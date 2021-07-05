import React from './react';
import ReactDOM from './react-dom';

// import React from 'react';
// import ReactDOM from 'react-dom';

// function User(funcProps) {
//   return (
//     <div>
//       Hello
//       {' '}
//       {funcProps.firstName}
//       ,
//       {' '}
//       {funcProps.lastName}
//     </div>
//   );
// }

// class Role extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return <div>{this.props.name}</div>;
//   }
// }

// const vdom = (
//   <div className="container">
//     <h1>Hello World</h1>
//     <h2 data-test="test">(编码必杀技)</h2>
//     <div>
//       嵌套1
//       {' '}
//       <div>嵌套 1.1</div>
//     </div>
//     <h3>(观察: 这个将会被改变)</h3>
//     {2 === 1 && <div>如果2和1相等渲染当前内容</div>}
//     {2 === 2 && <div>2</div>}
//     {true}
//     {null}
//     <span>这是一段内容</span>
//     <button onClick={() => alert('你好')}>点击我</button>
//     <h3>这个将会被删除</h3>
//     2, 3
//     <input type="text" value="13" />
//     <input type="checkbox" value="13" checked="checked" />
//   </div>
// );

// const vdom2 = (
//   <div>
//     <User firstName="Marvin" lastName="Huo" />
//     <Role name="资深王者荣耀玩家" />
//   </div>
// );

// const vdom3 = (
//   <div>
//     <User firstName="DY" lastName="Wang" />
//     <h1>资深小菜鸡</h1>
//     <Role name="菜鸟玩家" />
//   </div>
// );

// console.log('vdom', vdom2);

const vdom4 = (
  <div>
    <div className="blue" />
    <button onClick={() => alert(123)}>弹出信息</button>
    Marvin
    <div>不同节点测试div</div>
    Huo Huo
  </div>
);
// const vdom5 = <h1>456</h1>;
const vdom5 = (
  <div>
    <div className="red" />
    <button onClick={() => alert(456)}>弹出信息</button>
    Huo
    <p>不同节点测试p</p>
  </div>
);

ReactDOM.render(vdom4, document.getElementById('root'));

setTimeout(() => ReactDOM.render(vdom5, document.getElementById('root')), 1000);
