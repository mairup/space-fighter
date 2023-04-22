soundManager.setup({
    preferFlash: false,
    onready: function () {
        blasterSound = soundManager.createSound({
            id: 'blasterSound',
            url: 'audio/blaster2.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 10
        })
        explosion1Sound = soundManager.createSound({
            id: 'explosion1Sound',
            url: 'audio/explosion1.mp3',
            autoLoad: true,
            autoPlay: false,
            volume: 25
        })
    }
})

let backAudio = {}
let blasterSound = {}
let explosion1Sound = {}

