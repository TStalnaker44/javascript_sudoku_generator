var board = [];
var solved = false;
var stopAnimation = false;
generateBoard();

function generateBoard(){
    board = [];
    frames = [];
    for (var x = 0; x < 9; x++){
        board.push([0,0,0,0,0,0,0,0,0])
    }
    createBoard();
    setBoardHTML();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function solveBoard(){
    solve(true);
    solved = true;
    stopAnimation = true;
    setBoardHTML();
}

function getAnimationSpeed(){
    var buttons = document.getElementsByName('speed');
    for (var i = 0, length = buttons.length; i < length; i++) {
        if (buttons[i].checked) {
            return buttons[i].value;
        }
    }
}

async function animateSolution(){
    document.getElementById("animate").disabled = true; 
    if (stopAnimation){stopAnimation=false;}
    if (!solved){
        solve(true);  
        solved = true;
    }
    var animationSpeed = getAnimationSpeed();
    for (let f = 0; f < frames.length; f++){
        if (f%animationSpeed==0 || f == frames.length-1){
            document.getElementById("sudoku").innerHTML = frames[f];
            await sleep(100);
        }
        if (stopAnimation){
            break;
        }
    }
    document.getElementById("animate").disabled = false; 
}

function getBoardHTML(){
    var msg = "<colgroup><col><col><col></colgroup>";
    msg += msg + msg;

    for (var i = 0; i < 3; i++){
        msg += "<tbody>";
        for (var j = 0; j < 3; j++){
            msg += "<tr>";
            for (var k = 0; k < 9; k++){
                var row = i*3 + j;
                var column = k;
                var tile = board[row][column];
                if (tile == 0){tile=" ";}
                msg += "<td>" + tile + "</td>";
            }
            msg += "</tr>";
        }
        msg += "</tbody>";
    }
    return msg;
}

function setBoardHTML(){
    document.getElementById("sudoku").innerHTML = getBoardHTML();
}

function createBoard(){
    solve();
    removeTiles();
}

function removeTiles(){
    var tileNum = 81;
    var emptyNum = Math.floor(tileNum * 0.63);
    var spaces = [];

    // Determine which tiles to make empty
    while (spaces.length < emptyNum){
        var tile = Math.floor(Math.random() * 81);
        if (!spaces.includes(tile)){

            // Add the tile to the spaces array
            spaces.push(tile);

            // Remove values from tile
            var row = Math.floor(tile / 9);
            var column = Math.floor(tile % 9);
            board[row][column] = 0;

        }
    } 
}

function shuffle(array){
    for (let i = 0; i < array.length; i++){
        var j = Math.floor(Math.random()*(i));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function solve(animate=false){
    for (var row = 0; row < 9; row++){
        for (var column = 0; column < 9; column++){
            if (board[row][column] == 0){
                var values = [];
                for (var v = 1; v < 10; v++){
                    values.push(v);
                }
                shuffle(values);
                for (var v = 0; v < 9; v++){
                    var e = values[v];
                    if (validPlacement(e, row, column)){
                        board[row][column] = e;
                        if (animate){
                            frames.push(getBoardHTML())
                        }
                        solve(animate);
                        if (!isSolved()){
                            board[row][column] = 0;
                        }
                    }
                }
                return 0;
            }
        }
    }  
}

function getColumn(column){
    var temp = [];
    for (var r = 0; r < 9; r++){
        temp.push(board[r][column]);
    }
    return temp;
}

function getZone(r, c){
    var q_r = Math.floor(r / 3) * 3;
    var q_c = Math.floor(c / 3) * 3;
    var zone = [];
    for (var x = 0; x < 3; x++){
        var row = board.slice(q_r, q_r+3)[x];
        for (var y = 0; y < 3; y++){
            var entry = row.slice(q_c,q_c+3)[y];
            zone.push(entry);
        }
    }
    return zone;
}

function validPlacement(e, row, column){
    var inRow = board[row].includes(e);
    var inColumn = getColumn(column).includes(e);
    var inZone = getZone(row, column).includes(e);
    return !inRow && !inColumn && !inZone; 
}

function isSolved(){
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (board[i][j] == 0){
                return false;
            } 
        }
    }
    return true;
}