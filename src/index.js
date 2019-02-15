import ReactDOM from './reactdom';
import React from './react';

//test1
const element = <div>Hello<span>World!</span></div>;

console.log(element);

//test2
function addOne() {
    alert('hhhh')
}
function tick() {
    const element = (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
      </div>
    );
    // highlight-next-line
    ReactDOM.render(element, document.getElementById('container'));
}
  
setInterval(tick, 1000);


