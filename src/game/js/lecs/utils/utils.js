export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function playSound(soundName,volume=0.3){
    let sound=new Audio(soundName)
    sound.volume=volume
    sound.play()
}