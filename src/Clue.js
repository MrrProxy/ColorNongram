import React from 'react';

class Clue extends React.Component {
    render() {
        const clue = this.props.clue;
        let status= this.props.status;
        if (this.props.pistaCompleta ===1){
            status++;
        }
        return (
            //Se modifica el color del clue s este satisface
            
            <div className={this.props.pistaCompleta ===1?"clue clueCompletoLinea":"clue"} >
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