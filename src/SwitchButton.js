import React from 'react';
import {Switch} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CloseIcon from '@material-ui/icons/Close'


class SwitchButton extends React.Component {
    render() {
        return (
            <div className="switchcontainer">
                <div className="option1">
                <CheckBoxOutlineBlankIcon className="box"></CheckBoxOutlineBlankIcon>  
                </div>  
                <Switch className="switchbutton" color="default" onClick={this.props.onClick}>
                    {this.props.value}
                </Switch>
                <div className="option2">
                <CloseIcon className="cross"></CloseIcon>
                </div>
            </div>
        );
    }
}

export default SwitchButton;