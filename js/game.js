function drawShip() {
    context.drawImage(blueGlowImg, ship.x - 63, ship.y - 20, 130, 130)
    context.drawImage(shipImg, ship.x - 75, ship.y - 75, 150, 150)

    /*
        context.beginPath()
        context.fillStyle = 'rgb(255,100,50,0.5)'
        context.arc(ship.x - 50, ship.y + 55, 15, 0, Math.PI / 180 * 360)
        context.closePath()
        context.fill()
    
        context.fillStyle = 'rgb(100,100,100,0.5)'
        context.fillRect(ship.x, ship.y + 55, 35, 35)
    */
}



function moveShip() {
    if (checkDistance(mousePos, ship) < 150) {
        ship.x += (mousePos.x - ship.x) / (ship.speed / 2)
        ship.y += (mousePos.y - ship.y) / (ship.speed / 2)
    }

    else {
        ship.x += (mousePos.x - ship.x) / ship.speed
        ship.y += (mousePos.y - ship.y) / ship.speed
    }

}

function fire() {
    ship.stamina -= bullet.stamCost
    activeBullets.push({
        speed: bullet.speed,
        size: bullet.size,
        dmg: bullet.dmg,
        x: ship.x,
        y: ship.y - 70
    })
    gunCD = setTimeout(() => {
        gunCD = 0
    }, bullet.rof)

    blasterSound.play()
}

function drawBullets() {
    for (let i = 0; i < activeBullets.length; i++) {
        context.drawImage(bulletB, activeBullets[i].x - 75, activeBullets[i].y - 75, 150, 150)
        activeBullets[i].y -= activeBullets[i].speed
        if (activeBullets[i].y < -100)
            activeBullets.splice(i, 1)
    }
}

function drawEnemyBullets(i) {
    for (let j = 0; j < activeEnemyBullets.length; j++) {
        context.save();
        context.translate(activeEnemyBullets[j].x, activeEnemyBullets[j].y);
        context.rotate(Math.PI * activeEnemyBullets[j].rotation);
        context.drawImage(bulletR, -75, -75, 150, 150)
        context.restore();

        if (activeEnemyBullets[j].y > 1100 || activeEnemyBullets[j].x > 1100 || activeEnemyBullets[j].x < -100)
            activeEnemyBullets.splice(j, 1)
    }
}

function generateStars() {
    activeStars.push({
        speed: star.speed,
        size: (Math.random() * star.size) + star.size,
        x: Math.random() * 1000,
        y: -100
    })
}

function drawStars() {
    for (let i = 0; i < activeStars.length; i++) {
        context.drawImage(starImg, activeStars[i].x, activeStars[i].y, activeStars[i].size, activeStars[i].size)
        activeStars[i].y += activeStars[i].speed
        if (activeStars[i].y > 1100)
            activeStars.splice(i, 1)
    }
}

function generateRocks() {
    let tmp = Math.random() * (rock.size / 2) + rock.size / 2 //added rock.size / 2 to make the smallest rock size half of the biggest
    let rotationSpeed = 0
    while (rotationSpeed > -0.5 && rotationSpeed < 0.5)
        rotationSpeed = ((Math.random() * 4) - 2) / 2

    activeRocks.push({
        speed: rock.speed,
        size: tmp,
        hp: tmp * rock.hpMultiplier,
        maxHP: tmp * rock.hpMultiplier,
        x: Math.random() * 1000,
        y: -50,
        rotation: (Math.random() * 360),
        rotationSpeed: rotationSpeed,
        xSpeed: ((Math.random() * 30) - 15) / 20
    })
}

function drawRocks() {
    for (i = 0; i < activeRocks.length; i++)
        if (activeRocks[i].y > 1050)
            activeRocks.splice(i, 1)
    for (let i = 0; i < activeRocks.length; i++) {
        activeRocks[i].x += activeRocks[i].xSpeed
        activeRocks[i].rotation += activeRocks[i].rotationSpeed
        context.save()
        context.translate(activeRocks[i].x, activeRocks[i].y)
        context.rotate(Math.PI / 180 * - activeRocks[i].rotation)
        context.drawImage(rockImg, -activeRocks[i].size * 1.6, -activeRocks[i].size * 1.6, activeRocks[i].size * 3.2, activeRocks[i].size * 3.2)
        context.restore()
        /* context.beginPath();
          context.arc(activeRocks[i].x, activeRocks[i].y, activeRocks[i].size / 2 + 5, 0, Math.PI / 180 * 360);
                 context.closePath();
                 context.fillStyle = 'rgba(248, 248, 248,0.5)';
                 context.fill(); 
         */
        // context.fillRect(activeRocks[i].x, activeRocks[i].y, activeRocks[i].size / 2, activeRocks[i].size / 2)
        activeRocks[i].y += activeRocks[i].speed
    }
}

function rockBulletColl() {
    for (let i = 0; i < activeRocks.length; i++)
        for (let j = 0; j < activeBullets.length; j++)
            if (activeRocks[i] && activeBullets[j])
                if (checkDistance(activeRocks[i], activeBullets[j]) < (activeRocks[i].size / 2 + activeBullets[j].size)) {
                    activeRocks[i].hp -= activeBullets[j].dmg
                    if (activeRocks[i].hp <= 0)
                        explodeRock(i)
                    explodeBullet(j)
                }
}

function enemyShipBulletColl() {
    for (let i = 0; i < activeShips.length; i++)
        for (let j = 0; j < activeBullets.length; j++) {
            if (activeShips[i] && activeBullets[j])
                if (checkDistance(activeShips[i], activeBullets[j]) < (activeShips[i].size / 2 + activeBullets[j].size)) {
                    activeShips[i].hp -= activeBullets[j].dmg
                    if (activeShips[i].hp <= 0)
                        explodeEnemyShip(i)
                    explodeBullet(j)
                }
        }

}

function explodeBullet(i) {
    let explosion = { ...bulletExplosionTemplate }
    explosion.x = activeBullets[i].x
    explosion.y = activeBullets[i].y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.size = activeBullets[i].size

    activeBullets.splice(i, 1)

    activeBulletExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeBulletExplosions.splice(i, 1)
        }
    }, 30)

    explosion2Sound.play()
}

function explodeEnemyBullet(i) {
    let explosion = { ...bulletExplosionTemplate }
    explosion.x = activeEnemyBullets[i].x
    explosion.y = activeEnemyBullets[i].y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.size = activeEnemyBullets[i].size

    activeEnemyBullets.splice(i, 1)

    activeEnemyBulletsExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeEnemyBulletsExplosions.splice(i, 1)
        }
    }, 30)

    explosion2Sound.play()
}

function explodeRock(i) {
    score += activeRocks[i].maxHP
    let explosion = { ...rockExplosionTemplate }
    explosion.x = activeRocks[i].x
    explosion.y = activeRocks[i].y
    explosion.img = new Image()
    explosion.img.src = "img/AsteroidExplode.png"
    explosion.rotation = activeRocks[i].rotation
    explosion.size = activeRocks[i].size

    activeRocks.splice(i, 1)

    activeRockExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeRockExplosions.splice(i, 1)
        }
    }, 40)

    explosion1Sound.play()
}

function explodeEnemyShip(i) {
    score += activeShips[i].maxHP * 2 //double score for killing a ship
    let explosion = { ...shipExplosionTemplate }
    explosion.x = activeShips[i].x
    explosion.y = activeShips[i].y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.rotation = activeShips[i].rotation
    explosion.size = activeShips[i].size - activeShips[i].size / 3

    activeShips.splice(i, 1)

    activeShipExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeShipExplosions.splice(i, 1)
        }
    }, 40);

    explosion3Sound.play()
}

function checkDistance(obj1, obj2) {
    if (obj1 && obj2)
        return (Math.sqrt(Math.abs((obj1.x - obj2.x) * (obj1.x - obj2.x) + ((obj1.y - obj2.y) * (obj1.y - obj2.y)))))
}


function shipColl(obj, type, i) {
    let bool = true
    let flag = false
    if (obj) {
        for (let y = 0; y < 40; y++)
            if (checkDistance(obj, { x: ship.x, y: ship.y - 70 + y }) < 5 + obj.size / 2)
                flag = true
        for (let y = 0; y < 40; y++)
            if (checkDistance(obj, { x: ship.x, y: ship.y - 20 + y }) < 20 + obj.size / 2)
                flag = true
        if (checkDistance(obj, { x: ship.x, y: ship.y + 40 }) < 40 + obj.size / 2)
            flag = true
        if (checkDistance(obj, { x: ship.x + 50, y: ship.y + 55 }) < 15 + obj.size / 2 || checkDistance(obj, { x: ship.x - 50, y: ship.y + 55 }) < 15 + obj.size / 2)
            flag = true
        else if (checkDistance(obj, { x: ship.x + 68, y: ship.y + 55 }) < 10 + obj.size / 2 || checkDistance(obj, { x: ship.x - 68, y: ship.y + 55 }) < 10 + obj.size / 2)
            flag = true
        else if (checkDistance(obj, { x: ship.x + 68, y: ship.y + 40 }) < 10 + obj.size / 2 || checkDistance(obj, { x: ship.x - 68, y: ship.y + 40 }) < 10 + obj.size / 2)
            flag = true
    }


    if (flag && type == "rock") {
        ship.hp -= activeRocks[i].hp * rockDmgMultiplier
        explodeRock(i)
    }

    if (flag && type == "bullet") {
        ship.hp -= activeEnemyBullets[i].dmg
        explodeEnemyBullet(i)
    }

    if (flag && type == "ship") {
        ship.hp -= activeShips[i].hp
        explodeEnemyShip(i)
        bool = false
    }

    if (flag && type == "healthPack")
        pickupHealthPack(obj, i)

    if (ship.hp <= 0 && !ship.isDead)
        return "break"

    return bool
}

function animateJetSprite() {
    fireSprite.currentframe++
    context.drawImage(fireSprite.img, fireSprite.currentframe * fireSprite.width, 0, fireSprite.width, fireSprite.height, ship.x - 13, ship.y + 55, fireSprite.width, fireSprite.height)
    if (fireSprite.currentframe >= fireSprite.totalframes) {
        fireSprite.currentframe = 0
    }
}


function drawRockExplosion(explosion) {
    context.save()
    context.translate(explosion.x, explosion.y)
    context.rotate(Math.PI / 180 * - explosion.rotation)
    //context.drawImage(explosion.img, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2,)
    context.drawImage(explosion.img, explosion.currentframe * explosion.width, 0, explosion.width, explosion.height, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2)
    context.restore()
}

function drawBulletExplosion(explosion, flag) {
    explosion.y -= explosion.currentframe * 1 * flag
    context.save()
    context.translate(explosion.x, explosion.y)
    context.drawImage(explosion.img, explosion.currentframe * explosion.width, 0, explosion.width, explosion.height, -explosion.size * 1.6, -explosion.size * 1.6, explosion.size * 3.2, explosion.size * 3.2)
    context.restore()
}

function drawShipExplosion(explosion) {
    explosion.y += (explosion.currentframe * 1) / 3
    context.save()
    context.translate(explosion.x, explosion.y)
    context.drawImage(explosion.img, explosion.currentframe * explosion.width, 0, explosion.width, explosion.height, -explosion.size, -explosion.size, explosion.size * 2, explosion.size * 2)
    context.restore()
}

function drawHP() {
    context.drawImage(hpTable, 50, 950, 900, 30)
    context.fillStyle = 'rgba(65, 214, 45, 0.6)'
    if (ship.hp / ship.maxHP < 0.3) {
        context.fillStyle = 'rgba(214, 56, 45, 0.6)'
        canvas.style.filter = "grayscale(0.4)"
    }
    else
        canvas.style.filter = ""
    context.fillRect(70, 955, ship.hp == Math.abs(ship.hp) ? (ship.hp / ship.maxHP) * 860 : 0, 20)
}

function drawMiniHP() {
    for (i = 0; i < activeRocks.length; i++) {
        context.drawImage(miniHpBar, activeRocks[i].x - activeRocks[i].size * 1.5 / 2, activeRocks[i].y - activeRocks[i].size, activeRocks[i].size * 1.5, 10)
        context.drawImage(miniHpBarBar, activeRocks[i].x - activeRocks[i].size * 1.5 / 2, activeRocks[i].y - activeRocks[i].size, (activeRocks[i].size * 1.5) * (activeRocks[i].hp / activeRocks[i].maxHP), 10)
    }
    for (let i = 0; i < activeShips.length; i++) {
        context.drawImage(miniHpBar, activeShips[i].x - activeShips[i].size / 2, activeShips[i].y - activeShips[i].size / 1.5, activeShips[i].size, 10)
        context.drawImage(miniHpBarBar, activeShips[i].x - activeShips[i].size / 2, activeShips[i].y - activeShips[i].size / 1.5, (activeShips[i].size) * (activeShips[i].hp / activeShips[i].maxHP), 10)
    }
}

function spawnEnemyShip() {
    let originalX = Math.random() * 700 + 150
    activeShips.push({
        size: enemyShips[0].size,
        originalX: originalX,
        x: originalX,
        y: -enemyShips[0].size,
        xSpeed: enemyShips[0].xSpeed,
        ySpeed: enemyShips[0].ySpeed,
        hp: enemyShips[0].hp,
        maxHP: enemyShips[0].hp,
        bullet: enemyBullets[0],
        activeBullets: [],
        fireCD: 0
    })
}

function drawEnemyShips() {
    for (let i = 0; i < activeShips.length; i++)
        if (activeShips[i].y > 1000 + enemyShips[0].size)
            activeShips.splice(i, 1)
    for (let i = 0; i < activeShips.length; i++) {
        context.save()
        context.translate(activeShips[i].x, activeShips[i].y)
        let rotation = Math.atan((activeShips[i].y - ship.y) / (activeShips[i].x - ship.x))
        if ((activeShips[i].x - ship.x) == Math.abs((activeShips[i].x - ship.x)))
            rotation += Math.PI / 2
        else rotation -= Math.PI / 2

        if ((rotation / Math.PI) * 180 > 40)
            rotation = Math.PI / 180 * 40

        else if ((rotation / Math.PI) * 180 < -40)
            rotation = Math.PI / 180 * -40

        context.rotate(rotation)
        context.drawImage(redGlowImg, - activeShips[i].size / 1.6, - activeShips[i].size / 1.4, activeShips[i].size * 1.3, activeShips[i].size * 1.3)
        context.drawImage(enemyShipImg, - activeShips[i].size / 2, - activeShips[i].size / 2, activeShips[i].size, activeShips[i].size)
        context.restore()

        activeShips[i].y += activeShips[i].ySpeed
        if (Math.abs(activeShips[i].x - activeShips[i].originalX) > 100)
            activeShips[i].xSpeed = -activeShips[i].xSpeed
        activeShips[i].x += (Math.abs(activeShips[i].x - activeShips[i].originalX)) > 90 ? activeShips[i].xSpeed / 2 : activeShips[i].xSpeed

        /*
        context.beginPath();
        context.arc(activeShips[i].x, activeShips[i].y, activeShips[i].size / 2, 0, Math.PI / 180 * 360);
        context.fillStyle = 'rgba(214, 56, 45, 0.3)';
        context.fill();
        context.closePath();*/
    }
}

function enemyShipFire(enemyShip) {
    let speedX = (ship.x - enemyShip.x) * 7 / (Math.abs(enemyShip.y - ship.y))
    if (speedX > 5) speedX = 5
    else if (speedX < -5) speedX = -5

    activeEnemyBullets.push({
        speed: enemyShip.bullet.speed,
        size: enemyShip.bullet.size,
        dmg: enemyShip.bullet.dmg,
        x: enemyShip.x + speedX * 5,
        y: enemyShip.y + 30,
        speedX: speedX,
        rotation: -Math.sin(speedX / 20)
    })
    enemyShip.fireCD = setTimeout(() => {
        if (enemyShip)
            enemyShip.fireCD = 0
    }, enemyShip.bullet.rof)

    enemyBlasterSound.play()
}

function spawnHealthPack() {
    activeHealthPacks.push({
        hp: ship.maxHP / 3,
        x: Math.random() * 950 + 25,
        y: -50,
        size: 50
    })
}

function drawHealthPacks() {
    for (let i = 0; i < activeHealthPacks.length; i++) {
        context.drawImage(whiteGlowImg, activeHealthPacks[i].x - activeHealthPacks[i].size - 5, activeHealthPacks[i].y - activeHealthPacks[i].size, activeHealthPacks[i].size * 2.2, activeHealthPacks[i].size * 2.2)
        context.drawImage(healthPackImg, activeHealthPacks[i].x - activeHealthPacks[i].size / 2, activeHealthPacks[i].y - activeHealthPacks[i].size / 2, activeHealthPacks[i].size, activeHealthPacks[i].size)

        activeHealthPacks[i].y += 1
    }
}

function pickupHealthPack(pack, i) {
    if (ship.hp != ship.maxHP) {
        if (ship.hp + pack.hp > ship.maxHP)
            ship.hp = ship.maxHP
        else
            ship.hp += pack.hp

        activeHealthPacks.splice(i, 1)
        healSound.play()
    }

}

function drawStamina() {
    context.drawImage(hpTable, 50, 900, 900, 30)
    context.fillStyle = 'rgba(28, 207, 252, 0.6)'

    if (ship.stamina / ship.maxStamina < 0.3)
        context.fillStyle = 'rgba(18, 125, 151, 0.6)'

    context.fillRect(70, 905, ship.stamina == Math.abs(ship.stamina) ? (ship.stamina / ship.maxStamina) * 860 : 0, 20)
}

function animateDeath() {
    ship.isDead = true
    let explosion = { ...shipExplosionTemplate }
    explosion.x = ship.x
    explosion.y = ship.y
    explosion.img = new Image()
    explosion.img.src = "img/Explosion.png"
    explosion.size = 150

    activeShipExplosions.push(explosion)
    let int = setInterval(() => {
        explosion.currentframe++
        if (explosion.currentframe >= explosion.totalframes) {
            clearInterval(int)
            activeShipExplosions.splice(i, 1)
        }
    }, 40);

    explosion3Sound.play()
}

function drawUI() {
    drawStamina()
    drawMiniHP()
    drawHP()

    context.fillStyle = 'black';
    context.textAlign = 'center';

    context.drawImage(uiBox, 10, 10, 400, 50)
    context.fillText("Score: " + Math.floor(score), 200, 45, 290);

    context.drawImage(uiBox, 590, 10, 400, 50)
    context.fillText("Time: " + Math.floor(timeSurvived), 790, 45, 290);
}