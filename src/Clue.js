import React from 'react';

class Clue extends React.Component {
    render() {
        const clue = this.props.clue;
        
        return (
            //Se modifica el color del clue s este satisface
            <div className={this.props.pistaCompleta ==1?"clue clueCompletoLinea":"clue"} >
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