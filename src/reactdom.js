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

function render(vnode, container) {
    if(typeof vnode === 'string' || typeof vnode === 'number') {
        const textNode = document.createTextNode(vnode);
        return container.appendChild(textNode);
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
            render(child, dom);
        });

    }

    container.appendChild(dom);
}

const ReactDOM = {
    render: (vnode, container) => {
        /*
        这句话很重要，如果没有的话，会在container里一直放内容，直到放完
        */
        container.innerHTML = '';
        return render(vnode, container);
    }
}

export default ReactDOM;