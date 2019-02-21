import React from './react'
import ReactDOM from './reactdom'

class Counter extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            num: 1
        }
    }

    onClick() {
        this.setState( { num: this.state.num + 1 } );
    }

    render() {
        return (
            <div>
                <h1>count: { this.state.num }</h1>
                <button onClick={ () => this.onClick()}>add</button>
            </div>
        );
    }
}

ReactDOM.render(
    <Counter />,
    document.getElementById('container')
);


