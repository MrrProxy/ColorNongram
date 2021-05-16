import React from 'react';

class Circle extends React.Component {
    render() {
        return (
            <button className={"circle"} onClick={this.props.onClick}>
                {this.props.value}
            </button>
            
        );
    }
}

export default Circle;