soundManager.setup({
    preferFlash: false,
    onready: function () {
        blasterSound = soundManager.createSound({
            id: 'blasterSound',
            url: 'audio/blaster2.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 6
        })
        enemyBlasterSound = soundManager.createSound({
            id: 'enemyBlasterSound',
            url: 'audio/blaster2.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 1
        })
        explosion1Sound = soundManager.createSound({
            id: 'explosion1Sound',
            url: 'audio/explosion1.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 25
        })
        explosion2Sound = soundManager.createSound({
            id: 'explosion2Sound',
            url: 'audio/explosion2.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 15
        })
        explosion3Sound = soundManager.createSound({
            id: 'explosion3Sound',
            url: 'audio/explosion3.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 85
        })
    }
})

let blasterSound = {}
let explosion1Sound = {}
let explosion2Sound = {}
let explosion3Sound = {}

