let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let game_over_sound = new Audio('assets/sounds/game/gameOver.mp3');
let game_won_sound = new Audio('assets/sounds/game/gameWon.mp3');

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, openGameOverDialog);
    
   //console.log('My character is', world.character);
}  

function openGameOverDialog(winOrLose) {
    let dialog = document.getElementById('dialog');
    
    if (winOrLose === 'win') {
        if (!isMuted) {
            game_won_sound.currentTime = 0;
            game_won_sound.play();
        }
        dialog.innerHTML = getDialogWonTemplate();
    } else {
        if (!isMuted) {
            game_over_sound.currentTime = 0;
            game_over_sound.play();
        }
        dialog.innerHTML = getDialogLostTemplate();
    }
    dialog.showModal(); 
}

function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
}

function toggleMute(){
    isMuted = !isMuted;

    let button = document.getElementById('button_mute');
    let icon = button.querySelector('img');

    if (isMuted) {
        icon.src = "./assets/icons/sound_off.png";
        icon.alt = "Sound OFF Icon";
    } else {
        icon.src = "./assets/icons/sound.png";
        icon.alt = "Sound ON Icon";
    }
}



window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39){
        keyboard.RIGHT = true;
    };
     if (e.keyCode == 37){
        keyboard.LEFT = true;
    };
     if (e.keyCode == 38){
        keyboard.UP = true;
    };
     if (e.keyCode == 40){
        keyboard.DOWN = true;
    };
     if (e.keyCode == 32){
        keyboard.SPACE = true;
    };
      if (e.keyCode == 68){          
        keyboard.D = true;
    };

})

window.addEventListener("keyup", (e) => {
    //console.log(e.keyCode); // Gibt Keycode der jeweils gedrückten Taste in der Console aus
    if (e.keyCode == 39){
        keyboard.RIGHT = false;
    };
     if (e.keyCode == 37){
        keyboard.LEFT = false;
    };
     if (e.keyCode == 38){
        keyboard.UP = false;
    };
     if (e.keyCode == 40){
        keyboard.DOWN = false;
    };
     if (e.keyCode == 32){
        keyboard.SPACE = false;
    };
    if (e.keyCode == 68){          
        keyboard.D = false;
    };

})

