

/**
 * Get an ASCII progress bar based on Game.time .
 * @param {string} bg The background image (ASCII).
 * @param {string} fwd The animation to overlay (ASCII).
 * @param {string} [rev] An optional animation to loop back to the start.
 */
function progressBar (bg,fwd,rev){
    let max = rev ? bg.length*2 : bg.length;
    let t = Game.time%max;
    if (rev && t>=max/2){
        [fg,i]=[rev,max-t-1]
    } else {
        [fg,i]=[fwd,t]
    }
    return bg.substring(0,i)+fg+bg.substring(i+1);
}


/**
 * Print a little animation on the console to represent the passing Game ticks.
 * @param {string} [separator] Add whitespace between each ASCII char.
 */
function consoleAnimation(separator='') {
    let [bg,fwd,rev]=['········O','ᗣᗣᗣ··ᗧ','ᗣᗣᗣ·ᗤ·']
    let anim = `|${progressBar(bg,fwd,rev)}|`.split('').join(separator);
    console.log(`Tick: ${Game.time}\n\t\t${anim}\n\n`);
}


module.exports = {
    progressBar,
    consoleAnimation
}