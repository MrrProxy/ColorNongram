import React from 'react';
import PengineClient from './PengineClient';
import Board from './Board';
import SwitchButton from './SwitchButton';
import {Switch} from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckBox from './CheckBox';
import imgInicio from './Assets/img/imagenInicio.png';

class Game extends React.Component {

  pengine;
  constructor(props) {
    super(props);
    this.state = {
      grid: null,
      solvedGrid: null,
      solvedEasy: null,
      solvedNormal: null,
      solvedHard: null,
      rowClues: null,
      colClues: null,
      filaSat: null,
      colSat: null,
      loading: false,
      waiting: false,
      status: 2,
      markMode: '#',
      dificult: '0'
    };
    this.handleClick = this.handleClick.bind(this);
    this.handlePengineCreate = this.handlePengineCreate.bind(this);
    this.handleSolve = this.handleSolve.bind(this);
    this.handleMark = this.handleMark.bind(this);
    this.handleDificult = this.handleDificult.bind(this);
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
          filaSat: [].constructor(response['PistasFilas'].length).fill(0),
          colSat: [].constructor(response['PistasColumnas'].length).fill(0)
        });
      }
      this.handleSolve();
    });
  }

  handleSolve(){
    const options = ['Hard', 'Normal', ''];
    var queryS, queryJ, squaresS, pistasF, pistasC;
    
    for(var i = 0; i < 3; i++){
      this.setState({
        loading : true
      })
      const dif = options[i];
      queryS = 'init' + dif + '(PistasFilas, PistasColumnas, Grilla)'
      this.pengine.query(queryS, (success, response) => {
        if (success) {
          squaresS = JSON.stringify(response['Grilla']).replaceAll('"_"', "_");
          pistasF = JSON.stringify(response['PistasFilas']);
          pistasC = JSON.stringify(response['PistasColumnas']);
        }
      
        queryJ = 'grid_solve(' + squaresS + ', ' + pistasF + ', ' + pistasC + ', SolvedGrid)';
        this.pengine.query(queryJ, (success, response) => {
          if (success) {
            this.setState({
              loading : false,
              solvedEasy : (dif === '')? response['SolvedGrid'] : this.state.solvedEasy,
              solvedGrid : (dif === '')? response['SolvedGrid'] : this.state.solvedGrid,
              solvedNormal : (dif === 'Normal')? response['SolvedGrid'] : this.state.solvedNormal,
              solvedHard : (dif === 'Hard')? response['SolvedGrid'] : this.state.solvedHard,
              
            })
          }
        });
      });
    }
  }

  handleClick(i, j) {
    // No action on click if we are waiting.
    if (this.state.waiting) {
      return;
    }

    // Build Prolog query to make the move, which will look as follows:
    // put("#",[0,1],[], [],[["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]], GrillaRes, FilaSat, ColSat)
    const squaresS = JSON.stringify(this.state.grid).replaceAll('"_"', "_"); // Remove quotes for variables.
    const pistasF = JSON.stringify(this.state.rowClues);
    const pistasC = JSON.stringify(this.state.colClues);
    const markS = JSON.stringify(this.state.markMode);

    const queryS = 'put(' + markS + ', [' + i + ',' + j + ']'
      + ',' + pistasF + ',' + pistasC + ',' + squaresS + ', GrillaRes, FilaSat, ColSat)';

    this.setState({
      waiting: true
    });
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        const filAux = this.state.filaSat;
        const colAux = this.state.colSat;
        var statusAux = this.state.status;
        filAux[i] = response['FilaSat'];
        colAux[j] = response['ColSat'];
        statusAux = (filAux.includes(0) || colAux.includes(0)) ? 0 : 1;
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


  handleMark() {
    var markMode = this.state.markMode.slice();
    markMode = (markMode === '#') ? 'X' : '#';
    this.setState({ markMode: markMode })
  }

  handleDificult(event) {

    if (this.state.waiting) {
      return;
    }

    const dificult = event.target.value;
    this.setState({ dificult: dificult })

    var queryS;
    if (dificult === '0') {
      queryS = 'init(PistasFilas, PistasColumnas, Grilla)';
      this.setState({
        solvedGrid : this.state.solvedEasy
      })
    }
    else {
      if (dificult === '1') {
        queryS = 'initNormal(PistasFilas, PistasColumnas, Grilla)';
        this.setState({
          solvedGrid : this.state.solvedNormal
        })
      }
      else {
        queryS = 'initHard(PistasFilas, PistasColumnas, Grilla)';
        this.setState({
          solvedGrid : this.state.solvedHard
        })
      }
    }

    this.setState({waiting : true})

    this.pengine.query(queryS, (success, response) => {
      if (success) {
        this.setState({
          grid: response['Grilla'],
          rowClues: response['PistasFilas'],
          colClues: response['PistasColumnas'],
          filaSat: [].constructor(response['PistasFilas'].length).fill(0),
          colSat: [].constructor(response['PistasColumnas'].length).fill(0)
        });
      }
    })
    
    this.setState({waiting : false})

  }

  

  render() {  
    if (this.state.grid === null) {
      return null;
    }

    if (this.state.status === 2) {
      return (
        <div className="initial-container">

          <div className="tituloInicio">Nonogram Game</div>
          
          <img className="imagenInicio" src={imgInicio}></img>

          <button className="boton_Inicio" type="button"
            onClick={() => {this.setState({ status: 0 })}}
          >
          START</button>
        </div>
      )
    }
    
    if (this.state.status === 1) {
      return (
        <div className="final-container">

          <div className="youwin">You win!</div>

          <button className="restart"
            onClick={() => {this.handlePengineCreate(); this.setState({ status: 2, dificult: '0'})}}
          >
            RESTART</button>

        </div>
      )
    }

    if(this.state.loading){
      return (
        <div className="load-container">
          <div className="loading">
            LOADING
            <div className="barra">
            <LinearProgress></LinearProgress>
          </div>
          </div>
          
        </div>
      )
    }
    else{
      return (
        <div className="game">
  
          <div className="gameSettings">
  
            <div className="mode">
              <label className="label">Mark mode: </label>
              <div>
                <SwitchButton
                  value={this.state.markMode}
                  onClick={() => this.handleMark()}
                />
              </div>
            </div>
  
            <div className="dif">
              <label className="label">Select difficulty: </label>
              <CheckBox
                value={this.state.dificult}
                onChange={() => this.handleDificult}
              />
            </div>
  
            <div className="solve">
              <Switch
                onClick={() => {this.setState({status: ((this.state.status === 3)? 0 : 3)})}}
              />
            </div>
            <div className="solve1">
              <button className="btnsolve"
               onClick={() => {this.setState({status: ((this.state.status === 3)? 0 : 3)})}}
              >Solve</button>
            </div>
          </div>
  
          
          <Board
            grid= {(this.state.status === 0)? this.state.grid : this.state.solvedGrid}
            rowClues={this.state.rowClues}
            colClues={this.state.colClues}
            onClick={(this.state.status === 0)? (i, j) => this.handleClick(i, j) : (i, j) => {}}
            filaSat={this.state.filaSat}
            colSat={this.state.colSat}
          />
  
        </div>
      );
    }
  }
}

export default Game;
