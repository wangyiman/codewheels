import ReactDOM from './reactdom';
import {renderComponent} from './reactdom';

function createElement(tag, attrs, ...children) {
    return {
        tag,
        attrs,
        children
    }
}

export class Component {
  constructor(props = {}) {
      this.state = {};
      this.props = props;
  }

  setState(stateChange) {
      Object.assign(this.state, stateChange);
      renderComponent(this);
  }
}

const React = {
    Component,
    createElement
}

export default React;