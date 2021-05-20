import React from 'react';
import CloseIcon from '@material-ui/icons/Close'

class Square extends React.Component {
    render() {
        return (
            <button className={this.props.value === '#'? "paintedsquare" : "square"} onClick={this.props.onClick}>
                <CloseIcon className={this.props.value === 'X'? "squarecross" : "invisiblecross"}></CloseIcon>
                {this.props.value === '_'? null : this.props.value}
            </button>
        );
    }
}

export default Square;