import { Component } from './react';

function setAttribute(dom, attrName, attrValue) {
    if(attrName === 'className') attrName = 'class';

    if(/on\w+/.test(attrName)) {
        attrName = attrName.toLowerCase();
        dom[attrName] = attrValue;
        dom.addEventListener(attrName, attrValue);
    } else if(attrName === 'style') {
        if(!attrValue || typeof attrValue === 'string') {
            dom.style.cssText = attrValue || '';
        } else if(attrValue && typeof attrValue === 'object') {
            for(let name in attrValue) {
                dom.style[name] = typeof attrValue[name] === 'number' ? attrValue[name] + 'px' : attrValue[name];
            }
        }
    } else {
        if(attrName in dom) {
            dom[attrName] = attrValue;
        } else {
            dom.setAttribute(attrName, attrValue);
        }
    }
}
function createComponent(nodeType, nodeProps) {
    let inst;
    if(nodeType.prototype && nodeType.prototype.render) {
      inst = new nodeType(nodeProps);
    } else {
      inst = new Component(nodeProps);
      inst.constructor = nodeType;
      inst.render = function() {
        return this.constructor(nodeProps);
      }
    }

    return inst;
}

function setComponentProps(component, nodeProps) {
    if(!component.base) {
      if(component.componentWillMount) component.componentWillMount();
    } else if(component.componentWillReceiveProps) {
      component.componentWillReceiveProps(nodeProps); 
    }

    component.props = nodeProps;
    renderComponent(component);
}

export function renderComponent(component) {
    let base;
    const renderer = component.render();
    if(component.base && component.componentWillUpdate) {
      component.componentWillUpdate();
    }
    base = _render(renderer);

    if(component.base) {
      if(component.componentDidUpdate) component.componentDidUpdate();
    } else if(component.componentDidMount) {
      component.componentDidMount();
    }

    if(component.base && component.base.parentNode) {
      component.base.parentNode.replaceChild(base, component.base);
    }

    component.base = base;

    base._component = component;
}

function _render(vnode) {
    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';
  
    if ( typeof vnode === 'number' ) vnode = String( vnode );

    if(typeof vnode === 'string') {
        const textNode = document.createTextNode(vnode);
        return textNode;
    }

    if(typeof vnode.tag === 'function') {
      const component = createComponent(vnode.tag, vnode.attrs);
      setComponentProps(component, vnode.attrs);
      return component.base;
    }

    const dom = document.createElement(vnode.tag);
    
    if(vnode.attrs) {
        let attrs = vnode.attrs;
        Object.keys(attrs).forEach((attr) => {
            setAttribute(dom, attr, attrs[attr]);
        });
    }

    if(vnode.children) {
        let children = vnode.children;
        children.forEach((child) => {
            ReactDOM.render(child, dom);
        });
    }

    return dom;
}

const ReactDOM = {
    render: (vnode, container) => {
        /*
        这句话很重要，如果没有的话，会在container里一直放内容，直到放完
        */
        //container.innerHTML = '';
        return container.appendChild(_render(vnode));
    }
}

export default ReactDOM;