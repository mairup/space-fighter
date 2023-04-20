soundManager.setup({
    url: 'node_modules/soundmanager2/swf',
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
            volume: 20
        })/*
        backAudio = soundManager.createSound({
            id: 'backAudioSound',
            url: 'audio/ScifiAmbient.wav',
            autoLoad: true,
            autoPlay: true,
            onload: function () {
                console.log('The sound ' + this.id + ' loaded!');
            },
            loops: 999,
            volume: 50
        })*/
    }
})

let backAudio = {}
let blasterSound = {}
let explosion1Sound = {}

