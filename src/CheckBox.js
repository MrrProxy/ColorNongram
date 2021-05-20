import React from 'react';

class CheckBox extends React.Component {
    render() {
        return (
            <form>
                <div className="form-check">
                        <label className="check-label-e">
                            <input
                                type="checkbox"
                                value={0}
                                className="form-check-input"
                                checked={this.props.value === '0'}
                                onChange={this.props.onChange()}
                            />
                            Easy
                        </label>
                </div>

                <div className="form-check">
                        <label className="check-label-n">
                            <input
                                type="checkbox"
                                value={1}
                                className="form-check-input"
                                checked={this.props.value === '1'}
                                onChange={this.props.onChange()}
                            />
                            Normal
                        </label>
                </div>

                    <div className="form-check">
                        <label className="check-label-h">
                            <input
                                type="checkbox"
                                value={2}
                                className="form-check-input"
                                checked={this.props.value === '2'}
                                onChange={this.props.onChange()}
                            />
                            Hard
                        </label>
                </div>
            </form>
        )
    }
}

export default CheckBox