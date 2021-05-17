import React from 'react';
import Game from './Game';

class PantallaInicio extends React.Component {
    render() {
        return (
                <div className="boton_Inicio">
                    <button
                    onClick={() => Game.setState({status : 1})}
                    >
                    </button>
                </div>
        );

    }
}

export default PantallaInicio;