import ReactDOM from './reactdom';

export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode);

    if(container && ret && ret.parentNode !== container) {
        container.appendChild(ret);
    }

    return ret;
}

export function diffNode(dom, outnode) {
    if(!outnode) return;

    if(typeof outnode === 'number') outnode = String(outnode);
    let newNode;
    if(typeof outnode === 'string') {
        // if(dom && dom.nodeType === 3) {
        //     if(dom.textContent !== outnode) {
        //         dom.parentNode.replaceChild(outnode, dom);
        //     }
        // } else {
            newNode = document.createTextNode(outnode);
            dom && dom.parentNode && dom.parentNode.replaceChild(newNode, dom);
        //}
        return newNode;
    }

    if(typeof outnode.tag === 'function') {
        return diffComponent(dom, outnode)
    }

    //1.两种类型不一样
    //2.dom不存在
    let out_node = dom;
    //1.把原来节点的children塞到新节点的下面
    //2.把原来的节点用新的节点替换掉
    if(!dom) {
        out_node = document.createElement(outnode.tag);
    } else if(!isSameNodeType(dom, outnode)) {
        out_node = document.createElement(outnode.tag);
        // [...dom.childnodes].map(out_node.appendChild);
        // dom.parentNode && dom.parentNode.replaceChild(out_node, dom);
        out_node && dom.parentNode && dom.parentNode.replaceChild(out_node, dom);
    }
    
    diffChildren(out_node, outnode);
    diffAttributes(out_node, outnode);
    return out_node;
}

export function diffComponent(dom, outnode) {
    let c = dom && dom._component;

    if(c && c.constructor === outnode.tag) {
        ReactDOM.setComponentProps(c, vnode.attrs);
        dom = c.base;
    } else {
        if(c) {
            ReactDOM.unmountComponent(c);
        }
        let component = ReactDOM.createComponent(outnode.tag, outnode.attrs);
        setComponentProps(component, outnode.attrs);
        dom = component.base;
    }

    return dom;
}

export function diffAttributes(dom, outnode) {
    const old = {};
    const attrs = outnode.attrs;

    for(let i = 0; i< dom.attributes.length;i++) {
        const attr = dom.attributes[i];
        old[attr.name] = attr.value;
    }

    for(let name in old) {
        if(!(name in attrs)) {
            ReactDOM.setAttribute(dom, name, undefined);
        }
    }

    for(let name in attrs) {
        if(old[name] !== attrs[name]) {
            ReactDOM.setAttribute(dom, name, attrs[name]);
        }
    }
}

export function diffChildren(dom, outnode) {
    const _domChildren = dom.childNodes;
    const domChildren = [];
    const keyed = {};
    if(_domChildren) {
        for(let i = 0;i < _domChildren.length;i++) {
            if(_domChildren[i] && _domChildren[i].key) {
                keyed[_domChildren[i].key] = _domChildren[i];
            } else {
                domChildren.push(_domChildren[i]);
            }
        }
    }

    if(outnode && outnode.children.length > 0) {
        for(let i = 0; i < outnode.children.length;i++) {
            let currentChild;
            if(outnode.children[i] && outnode.children[i].key) {
                if(keyed[outnode.children[i].key]) {
                    currentChild = keyed[outnode.children[i].key];
                }
            } else {
                for(let j = 0;j<domChildren.length;j++) {
                    if(isSameNodeType(domChildren[i], outnode.children[i])) {
                        currentChild = domChildren[i];
                        if(j === domChildren.length-1) j--;
                        break;
                    }
                }
            }

            currentChild = diffNode(currentChild, outnode.children[i]);

            const f = _domChildren[i];
            if(currentChild && currentChild !== f ) {
               if(!f) {
                    dom.appendChild(currentChild);
               } else if(currentChild.nextSibling === f) {
                    ReactDOM.removeNode(f);
               } else {
                    dom.insertBefore(currentChild, f);
               }
            }
        } 
    }
}


function isSameNodeType(dom, outnode) {
    if(typeof outnode === 'string' || typeof outnode === 'number') {
        return dom.nodeType === 3;
    }

    if(typeof outnode.tag === 'string') {
        return dom.nodeName.toLowerCase() === outnode.tag.toLowerCase();
    }

    return dom && dom._component.constructor === outnode.tag;
}