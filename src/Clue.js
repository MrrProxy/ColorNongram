import React from 'react';

class Clue extends React.Component {
    render() {
        const clue = this.props.clue;
        console.log(this.props.satisface);
        return (
            <div className={this.props.satisface ==1?"clue clueCompletoLinea":"clue"} >
                {clue.map((num, i) =>
                    <div key={i}>
                        {num}
                    </div>
                )}
            </div>
        );
    }
}

export default Clue;