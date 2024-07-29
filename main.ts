function setVisitedTile (sprite: Sprite) {
    tiles.setTileAt(sprite.tilemapLocation(), sprites.dungeon.darkGroundCenter)
    if (sprite.tilemapLocation().column - lastSpritePosition.column > 0) {
        tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row), sprites.dungeon.darkGroundCenter)
    } else if (sprite.tilemapLocation().column - lastSpritePosition.column < 0) {
        tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row), sprites.dungeon.darkGroundCenter)
    } else if (sprite.tilemapLocation().row - lastSpritePosition.row < 0) {
        tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 1), sprites.dungeon.darkGroundCenter)
    } else if (sprite.tilemapLocation().row - lastSpritePosition.row > 0) {
        tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 1), sprites.dungeon.darkGroundCenter)
    }
}
function changeMaze () {
    testRootValidPos(root)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile`, function (sprite, location) {
    game.gameOver(true)
})
function createInitalMaze () {
    vector = []
    complete = false
    placeHolder = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . 7 7 7 7 . . . . . . 
        . . . . . . 7 7 7 7 . . . . . . 
        . . . . . . 7 7 7 7 . . . . . . 
        . . . . . . 7 7 7 7 . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Player)
    scene.cameraFollowSprite(placeHolder)
    tiles.placeOnTile(placeHolder, tiles.getTileLocation(1, 1))
    while (complete == false) {
        vector.push(Math.floor(placeHolder.tilemapLocation().column / 2) + 16 * Math.floor(placeHolder.tilemapLocation().row / 2))
        lastSpritePosition = placeHolder.tilemapLocation()
        AllPositions.push(lastSpritePosition)
        NextPosition = chooseDirection(placeHolder)
        if (NextPosition.row == 0 && NextPosition.column == 0) {
            complete = traceBack(placeHolder)
        } else {
            tiles.placeOnTile(placeHolder, NextPosition)
            setVisitedTile(placeHolder)
            vector.unshift(Math.floor(placeHolder.tilemapLocation().column / 2) + 16 * Math.floor(placeHolder.tilemapLocation().row / 2))
            vectorPaths.push(vector)
        }
        vector = []
    }
}
function setWinLocation () {
    found = false
    while (found == false) {
        winLocation = randint(1, 31)
        if (Math.percentChance(50)) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(winLocation, 61), sprites.dungeon.darkGroundCenter)) {
                tiles.setTileAt(tiles.getTileLocation(winLocation, 62), assets.tile`myTile`)
                tiles.setWallAt(tiles.getTileLocation(winLocation, 62), false)
                found = true
            }
        } else {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(61, winLocation), sprites.dungeon.darkGroundCenter)) {
                tiles.setTileAt(tiles.getTileLocation(62, winLocation), assets.tile`myTile`)
                tiles.setWallAt(tiles.getTileLocation(62, winLocation), false)
                found = true
            }
        }
    }
}
function chooseDirection (sprite: Sprite) {
    NextPosition = tiles.getTileLocation(0, 0)
    DirectionsTried = []
    found = true
    while (DirectionsTried.length < 4 && (NextPosition.row == 0 && NextPosition.column == 0)) {
        found = true
        while (found == true) {
            found = false
            DirectionNumber = randint(0, 3)
            for (let value of DirectionsTried) {
                if (value == DirectionNumber) {
                    found = true
                }
            }
        }
        DirectionsTried.push(DirectionNumber)
        if (DirectionNumber == 0) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 2), sprites.dungeon.floorLight0)) {
                NextPosition = tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 2)
            }
        } else if (DirectionNumber == 1) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(sprite.tilemapLocation().column + 2, sprite.tilemapLocation().row), sprites.dungeon.floorLight0)) {
                NextPosition = tiles.getTileLocation(sprite.tilemapLocation().column + 2, sprite.tilemapLocation().row)
            }
        } else if (DirectionNumber == 2) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 2), sprites.dungeon.floorLight0)) {
                NextPosition = tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 2)
            }
        } else {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(sprite.tilemapLocation().column - 2, sprite.tilemapLocation().row), sprites.dungeon.floorLight0)) {
                NextPosition = tiles.getTileLocation(sprite.tilemapLocation().column - 2, sprite.tilemapLocation().row)
            }
        }
    }
    return NextPosition
}
function testRootValidPos (sprite: Sprite) {
    vector = []
    valid = false
    newWallNeeded = true
    while (valid == false) {
        DirectionNumber = randint(0, 3)
        if (DirectionNumber == 0) {
            if (sprite.tilemapLocation().row - 2 < 0) {
                valid = false
            } else {
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                tiles.placeOnTile(sprite, tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 2))
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                vectorPaths.push(vector)
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 1), sprites.dungeon.darkGroundCenter)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 1), false)
                valid = true
            }
        } else if (DirectionNumber == 1) {
            if (sprite.tilemapLocation().column + 2 > 32) {
                valid = false
            } else {
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                tiles.placeOnTile(sprite, tiles.getTileLocation(sprite.tilemapLocation().column + 2, sprite.tilemapLocation().row))
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                vectorPaths.push(vector)
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row), sprites.dungeon.darkGroundCenter)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row), false)
                valid = true
            }
        } else if (DirectionNumber == 2) {
            if (sprite.tilemapLocation().row + 2 > 32) {
                valid = false
            } else {
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                tiles.placeOnTile(sprite, tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 2))
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                vectorPaths.push(vector)
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 1), sprites.dungeon.darkGroundCenter)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 1), false)
                valid = true
            }
        } else {
            if (sprite.tilemapLocation().column - 2 < 0) {
                valid = false
            } else {
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                tiles.placeOnTile(sprite, tiles.getTileLocation(sprite.tilemapLocation().column - 2, sprite.tilemapLocation().row))
                vector.push(Math.floor(sprite.tilemapLocation().column / 2) + 16 * Math.floor(sprite.tilemapLocation().row / 2))
                vectorPaths.push(vector)
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row), sprites.dungeon.darkGroundCenter)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row), false)
                valid = true
            }
        }
    }
    for (let index = 0; index <= vectorPaths.length - 1; index++) {
        if (vectorPaths[index][1] == vector[0] && vectorPaths[index][0] == vector[1]) {
            newWallNeeded = false
            vectorPaths.removeAt(index)
        } else if (vector[1] == vectorPaths[index][0]) {
            if (vectorPaths[index][0] - vectorPaths[index][1] == 1) {
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row), sprites.dungeon.floorLight0)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column - 1, sprite.tilemapLocation().row), true)
            } else if (vectorPaths[index][0] - vectorPaths[index][1] == -1) {
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row), sprites.dungeon.floorLight0)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column + 1, sprite.tilemapLocation().row), true)
            } else if (vectorPaths[index][0] - vectorPaths[index][1] == -16) {
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 1), sprites.dungeon.floorLight0)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row + 1), true)
            } else if (vectorPaths[index][0] - vectorPaths[index][1] == 16) {
                tiles.setTileAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 1), sprites.dungeon.floorLight0)
                tiles.setWallAt(tiles.getTileLocation(sprite.tilemapLocation().column, sprite.tilemapLocation().row - 1), true)
            } else {
                game.splash("shit")
            }
            vectorPaths.removeAt(index)
        }
    }
}
function traceBack (sprite: Sprite) {
    while (AllPositions.length > 0 && (NextPosition.row == 0 && NextPosition.column == 0)) {
        tiles.placeOnTile(placeHolder, AllPositions.pop())
        NextPosition = chooseDirection(placeHolder)
    }
    lastSpritePosition = placeHolder.tilemapLocation()
    if (AllPositions.length == 0 && (NextPosition.row == 0 && NextPosition.column == 0)) {
        return true
    } else {
        return false
    }
}
let newWallNeeded = false
let valid = false
let DirectionNumber = 0
let DirectionsTried: number[] = []
let winLocation = 0
let found = false
let complete = false
let vector: number[] = []
let lastSpritePosition: tiles.Location = null
let root: Sprite = null
let placeHolder: Sprite = null
let NextPosition: tiles.Location = null
let AllPositions: tiles.Location[] = []
let vectorPaths: number[][] = []
tiles.setCurrentTilemap(tilemap`level2`)
let startChanges = false
vectorPaths = []
AllPositions = []
NextPosition = tiles.getTileLocation(0, 0)
createInitalMaze()
controller.moveSprite(placeHolder)
tiles.placeOnTile(placeHolder, tiles.getTileLocation(1, 1))
for (let value of tiles.getTilesByType(sprites.dungeon.floorLight0)) {
    tiles.setWallAt(value, true)
}
setWinLocation()
game.setGameOverScoringType(game.ScoringType.LowScore)
root = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Player)
tiles.placeOnTile(root, tiles.getTileLocation(1, 1))
for (let index = 0; index < 2000; index++) {
    changeMaze()
}
info.setScore(0)
startChanges = true
game.onUpdateInterval(1000, function () {
    info.changeScoreBy(1)
})
game.onUpdateInterval(100, function () {
    if (startChanges == true) {
        changeMaze()
    }
})
