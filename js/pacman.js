'use strict'


var PACMAN = '<img class="pacman" style="transform: rotate(0)" src="img/pacman.png" alt="">'
var gPacman

function createPacman(board) {
    // DONE: initialize gPacman...
    var PACMAN = '<img class="pacman" style="transform: rotate(0)" src="img/pacman.png" alt="">'
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    faceDirection(ev.code)

    // DONE: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev.code)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]
    // DONE: return if cannot move
    if (nextCell === WALL) return
    // DONE: hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            for (var k = 0; k < gGhosts.length; k++) {
                if (gGhosts[k].location.i === nextLocation.i &&
                    gGhosts[k].location.j === nextLocation.j) {
                    var eatenGhost = gGhosts.splice(k, 1)[0]
                    gEatenGhosts.push(eatenGhost)

                }
            }
        }
        else {
            gameOver()
            return
        }
    }

    if (nextCell === FOOD) updateScore(1)
    if (nextCell === CHERRY) {
        updateScore(10)
        var cherryCollectSound = new Audio('sounds/pop.mp3')
        cherryCollectSound.play()
    }


    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper === true) return
        gPacman.isSuper = true
        var collectSuperFoodSound = new Audio('sounds/collect.mp3')
        collectSuperFoodSound.play()
        setTimeout(() => { gPacman.isSuper = false }, 5000)

        for (var i = 0; i < gGhosts.length; i++) {
            var temp = gGhosts[i].color
            gGhosts[i].color = 'blue'
            gGhosts[i].superColor = temp
            returnGhost()
            returnGhostColor(gGhosts[i])
        }
    }

    // DONE: moving from current location:
    // DONE: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // DONE: update the DOM
    renderCell(gPacman.location, EMPTY)

    // DONE: Move the pacman to new location:
    // DONE: update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    // DONE: update the DOM
    renderCell(nextLocation, PACMAN)
}

function returnGhost() {

    setTimeout(() => {
        for (var i = 0; i < gEatenGhosts.length; i++) {
            gGhosts.push(gEatenGhosts.splice(i, 1)[0])
            // console.log(gGhosts);
        }
    }, 5000)


}

function returnGhostColor(ghost) {

    setTimeout(() => { ghost.color = ghost.superColor }, 5000)
}

function getNextLocation(eventKeyboard) {

    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // TODO: figure out nextLocation
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.i--
            break;
        case 'ArrowRight':
            nextLocation.j++
            break;
        case 'ArrowDown':
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.j--
            break;
    }

    return nextLocation
}

function faceDirection(eventKeyboard) {
    var direction
    var elPacman = document.querySelector('.pacman')

    switch (eventKeyboard) {
        case 'ArrowUp':
            direction = 'rotate(-0.25turn)'
            PACMAN = `<img class="pacman" style="transform: ${direction}" src="img/pacman.png" alt="">`
            break;
        case 'ArrowRight':
            direction = 'rotate(0)'
            PACMAN = `<img class="pacman" style="transform: ${direction}" src="img/pacman.png" alt="">`
            break;
        case 'ArrowDown':
            direction = 'rotate(90deg)'
            PACMAN = `<img class="pacman" style="transform: ${direction}" src="img/pacman.png" alt="">`
            break;
        case 'ArrowLeft':
            // direction = 'rotate(3.142rad)'
            // PACMAN = `<img class="pacman" style="transform: ${direction}" src="img/pacman.png" alt="">`
            PACMAN = `<img class="pacman" src="img/pacmanLeft.png" alt="">`
            break;
    }

}