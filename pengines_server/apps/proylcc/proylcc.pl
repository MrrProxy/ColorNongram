:- module(proylcc,
	[  
		put/8, grid_solve/4
	]).

:-use_module(library(lists)).
 

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% replace(?X, +XIndex, +Y, +Xs, -XsY)
%
% XsY es el resultado de reemplazar la ocurrencia de X en la posición XIndex de Xs por Y.

replace(X, 0, Y, [X|Xs], [Y|Xs]).

replace(X, XIndex, Y, [Xi|Xs], [Xi|XsY]):-
    XIndex > 0,
    XIndexS is XIndex - 1,
    replace(X, XIndexS, Y, Xs, XsY).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% put(+Contenido, +Pos, +PistasFilas, +PistasColumnas, +Grilla, -NewGrilla, -FilaSat, -ColSat).
% FilaSat indica si la fila completo las Pistas y ColSat indica si la columna completo las Pistas 


put(Contenido, [RowN, ColN], PistasFilas, PistasColumnas, Grilla, NewGrilla, FilaSat, ColSat):-
	% NewGrilla es el resultado de reemplazar la fila Row en la posición RowN de Grilla
	% (RowN-ésima fila de Grilla), por una fila nueva NewRow.
	
	replace(Row, RowN, NewRow, Grilla, NewGrilla),

	% NewRow es el resultado de reemplazar la celda Cell en la posición ColN de Row por _,
	% siempre y cuando Cell coincida con Contenido (Cell se instancia en la llamada al replace/5).
	% En caso contrario (;)
	% NewRow es el resultado de reemplazar lo que se que haya (_Cell) en la posición ColN de Row por Conenido.	 
	
	(replace(Cell, ColN, _ , Row, NewRow), Cell == Contenido ; replace(_Cell, ColN, Contenido, Row, NewRow) ),
	
	getElement(PistasFilas,RowN,PistasFila),
	(FilaSat is 1 ,completo(PistasFila,NewRow);FilaSat is 0),

	% se obtiene la columna en forma de lista
	hacerColumna(NewGrilla,ColN,Col),
	
	getElement(PistasColumnas,ColN,PistasColumna),
	(ColSat is 1, completo(PistasColumna,Col); ColSat is 0).
%

% hacerColumna(+Xs,+ColN,-Col) 

hacerColumna([],_ColN,[]).
hacerColumna([FilaActual|Filas],ColN,[Y|Ys]):-getElement(FilaActual,ColN,Y),hacerColumna(Filas,ColN,Ys).

getElement([X|_Xs],0,X).
getElement([_X|Xs],N,E):- N1 is N-1, getElement(Xs,N1,E).

%completo(+Lista de Pistas, +Linea) verifica si completo correctamente la condicion 
completo([],[]).
completo([N|Xs],[X|Ys]):-not(var(X)), X="#", N1 is N -1, completoCondincion(N1,Ys,Zs),completo(Xs,Zs).
completo(Xs,[X|Ys]):-(var(X);X="X"),completo(Xs,Ys).

completoCondincion(0,[],[]).
completoCondincion(0,[X|Xs],Xs):-var(X) ; X="X".
completoCondincion(N,[X|Xs],Res):- not(var(X)), X="#", N1 is N-1, completoCondincion(N1, Xs,Res).

%--------------------------- Funcionalidad Proyecto 2 --------------------------------------------------------

grid_solve(Grid, RowClues, ColClues, SolvedGrid):-
    length(ColClues, NumOfColumns),
    generarColumnas(Grid, (NumOfColumns - 1), Columns),
    reverse(Columns, RColumns),
    grid_filter(Grid, RowClues, RColumns, ColClues, SolvedGrid).


row_solution([],[]).
row_solution(Row, [ClueHead|ClueTail]) :-
    generate_possible_X(Row, PossibleRow),
    generate_part(PossibleRow, PaintedRow, ClueHead, "#"),
    (ClueTail \= [], generate_part(PaintedRow, SolutionRow, 1, "X");
     ClueTail = [], generate_possible_X(PaintedRow, SolutionRow)),
    row_solution(SolutionRow, ClueTail).

generate_possible_X(Row, Row).
generate_possible_X(["X"|Row], RowTail) :-
    generate_possible_X(Row, RowTail).

generate_part(Row, Row, 0, _Mark).
generate_part([Mark|Row], RowTail, N, Mark) :-
    N1 is N - 1,
    generate_part(Row, RowTail, N1, Mark).



grid_filter([], [], [], [], []).
grid_filter([Row|RowTail], [RowClues|RowCluesTail], [Column|ColumnTail],
           [ColClues|ColCluesTail], [Solutions|SolutionsTail]):-
    row_solution(Row, RowClues),
    row_solution(Column, ColClues),
    Solutions = Row,
    grid_filter(RowTail, RowCluesTail, ColumnTail, ColCluesTail, SolutionsTail).

generarColumnas(_Filas, -1, []).
generarColumnas(Filas, NumCols, [Columna|Columnas]):-
    hacerColumna(Filas, NumCols, Columna),
    NumColsAux is NumCols - 1,
    generarColumnas(Filas, NumColsAux, Columnas).
