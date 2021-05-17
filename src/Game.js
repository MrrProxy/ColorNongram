import React from 'react';
import PengineClient from './PengineClient';
import Board from './Board';
import SwitchButton from './SwitchButton';
import CheckBox from './CheckBox';

class Game extends React.Component {

  pengine;
  constructor(props) {
    super(props);
    this.state = {
      grid: null,
      rowClues: null,
      colClues: null,
      filaSat: null,
      colSat: null,
      waiting: false,
      status: 0,
      marcado: '#',
      dificult: '0'
    };
    this.handleClick = this.handleClick.bind(this);
    this.handlePengineCreate = this.handlePengineCreate.bind(this);
    this.handleMark = this.handleMark.bind(this);
    this.pengine = new PengineClient(this.handlePengineCreate);
  }

  handlePengineCreate() {
    const queryS = 'init(PistasFilas, PistasColumnas, Grilla)';
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        this.setState({
          grid: response['Grilla'],
          rowClues: response['PistasFilas'],
          colClues: response['PistasColumnas'],
          filaSat: [].constructor(response['PistasFilas'].length),
          colSat: [].constructor(response['PistasColumnas'].length)
        });
      }
    });
  }
  handleClick(i, j) {
    // No action on click if we are waiting.
    if (this.state.waiting) {
      return;
    }

    // Build Prolog query to make the move, which will look as follows:
    // put("#",[0,1],[], [],[["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]], GrillaRes, FilaSat, ColSat)
    const squaresS = JSON.stringify(this.state.grid).replaceAll('"_"', "_"); // Remove quotes for variables.
    const pistasF =JSON.stringify(this.state.rowClues);
    const pistasC =JSON.stringify(this.state.colClues);
    const marcadoS =JSON.stringify(this.state.marcado);

    const queryS = 'put(' + marcadoS + ', [' + i + ',' + j + ']' 
    + ','+ pistasF+','+pistasC+',' + squaresS + ', GrillaRes, FilaSat, ColSat)';

    this.setState({
      waiting: true
    });
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        const filAux=this.state.filaSat;
        const colAux=this.state.colSat;
        var statusAux=this.state.status;
        filAux[i]=response['FilaSat'];
        colAux[j]=response['ColSat'];
        statusAux= (filAux.includes(0) || colAux.includes(0))? 0 : 1;
        this.setState({
          grid: response['GrillaRes'],
          filaSat: filAux,
          colSat: colAux,
          waiting: false,
          status: statusAux
        })
      } else {
        this.setState({
          waiting: false
          
        });
        alert("falla");
      }
    });
  }

  
  handleMark(){
    var marcado = this.state.marcado.slice();
    marcado = (marcado === '#') ? 'X' : '#';
    this.setState({marcado : marcado})
  }

  handleDificult = (event) => {
    const dificult = event.target.value;
    this.setState({dificult : dificult})

    var queryS;
    if(dificult === '0'){
      queryS = 'init(PistasFilas, PistasColumnas, Grilla)';
    }
    else{
      if(dificult === '1'){
        queryS = 'initNormal(PistasFilas, PistasColumnas, Grilla)';
      }
      else{
        queryS = 'initHard(PistasFilas, PistasColumnas, Grilla)';
      }
    }
    
    this.pengine.query(queryS, (success, response) => {
      if (success) {
      this.setState({
        grid: response['Grilla'],
        rowClues: response['PistasFilas'],
        colClues: response['PistasColumnas'],
        filaSat: [].constructor(response['PistasFilas'].length),
        colSat: [].constructor(response['PistasColumnas'].length)
      });
    }
  })
  }


  

  render() {
    if (this.state.grid === null) {
      return null;
    }
    if(this.state.status=== 1){
      return (
        <div className="victory">
          {"You Win"}
        </div>
      )
    }

    return (
      <div className="game">
        <div className="gameSettings">
          <div className="mode">
          <label className="label">Mark mode: </label>
          <div>
          <SwitchButton
              value={this.state.marcado}
              onClick={() => this.handleMark()}
            />
          </div>
          </div>
          
          <div className="dif">
            <label className="label">Select dificult: </label>
            <CheckBox
              value={this.state.dificult}
              onChange={() => this.handleDificult}
            />
          </div>  
        </div>
        <Board
          grid={this.state.grid}
          rowClues={this.state.rowClues}
          colClues={this.state.colClues}
          onClick={(i, j) => this.handleClick(i,j)}
          filaSat={this.state.filaSat}
          colSat={this.state.colSat}
        />
        
      </div>
    );
  }

  
}

export default Game;
