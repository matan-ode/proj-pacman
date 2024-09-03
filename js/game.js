'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '*'
const CHERRY = '🍒'

var foodTotal
var emptyCells
var cherryShow
var emptyLoc

const gGame = {
    score: 0,
    isOn: false
}
var gBoard

function onInit() {
    // console.log('hello')
    emptyCells = undefined
    emptyLoc = setInterval(findEmptyLocations, 250)
    cherryShow = setInterval(showCherry, 15000)

    gGame.score = 0
    updateScore()
    removeModal()


    gBoard = buildBoard()
    foodTotal = countFood()
    createPacman(gBoard)
    createGhosts(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }

    board[1][1] = SUPER_FOOD
    board[size - 2][1] = SUPER_FOOD
    board[1][size - 2] = SUPER_FOOD
    board[size - 2][size - 2] = SUPER_FOOD

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


function updateScore(diff) {
    // update model 
    if (diff) {
        gGame.score += diff
    } else {
        gGame.score = 0
    }
    // and dom
    document.querySelector('span.score').innerText = gGame.score

    // console.log(gGame.score)


}

function victory() {
    console.log('victory')
    clearInterval(gIntervalGhosts)
    gGame.isOn = false
    var elTxt = document.querySelector('.end-game-txt')
    elTxt.innerText = 'Victorious'

    clearInterval(emptyLoc)
    clearInterval(cherryShow)
    showModal()
}

function gameOver() {
    var endGameSound = new Audio('sounds/pop2.wav')
    endGameSound.play()
    console.log('Game Over')
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, '☠')
    gGame.isOn = false
    var elTxt = document.querySelector('.end-game-txt')
    elTxt.innerText = 'Game Over'
    clearInterval(emptyLoc)
    clearInterval(cherryShow)
    showModal()
}

function removeModal() {
    var elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
}

function showModal() {
    var elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')
}

function countFood() {
    var count = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === FOOD) count++
        }
    }
    return (count - 1)
}

function findEmptyLocations() {
    const size = 10
    var cells = []
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (gBoard[i][j] === EMPTY) {
                var emptyCell = {
                    i: i,
                    j: j
                }
                cells.push(emptyCell)
            }
        }
    }
    emptyCells = cells
    // console.log(emptyCells);
    if (isNoFoodLeft()) {

        victory()
    }

}

function showCherry() {
    if (emptyCells === undefined || emptyCells === 0) return
    var locationIdx = getRandomIntInclusive(0, emptyCells.length)

    var emptyCell = emptyCells[locationIdx]
    // console.log(emptyCell);
    //MODEL:
    gBoard[emptyCell.i][emptyCell.j] = CHERRY

    //DOM:
    renderCell(emptyCell, CHERRY)

}

function isNoFoodLeft() {
    const size = 10
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (gBoard[i][j] === FOOD) return false
        }
    }
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].currCellContent === FOOD) return false
    }

    return true
}