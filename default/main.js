var constants = require('mgr.constants');
var mgrBuild = require('mgr.build');
var mgrGui = require('mgr.gui');
var mgrSpawn = require('mgr.spawn');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleTower = require('role.tower');
var roleUpgrader = require('role.upgrader');


module.exports.loop = function () {
    // Garbage Collection - ALWAYS RUN THIS BEFORE ANYTHING ELSE **sigh**
    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
            console.log(`Clearing non-existing creep memory: ${i}`);
        }
    }


    // manage spawns + constructions
    for(let roomName in Game.rooms){
        mgrSpawn.run(roomName);
        //mgrBuild.run(Game.rooms[roomName])
    }
    

    // room visuals
    for (let spawnName in Game.spawns){
        if(Game.spawns[spawnName].spawning) { 
            let spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1, 
                Game.spawns[spawnName].pos.y, 
                {align: 'left', opacity: 0.8});
        }
    }

    
    // run Creeps
    for(let creepName in Game.creeps) {
        switch (Game.creeps[creepName].memory.role){
            case 'harvester':
                roleHarvester.run(creepName);
                break;
            case 'upgrader':
                roleUpgrader.run(creepName);
                break;
            case 'builder':
                roleBuilder.run(creepName);
                break;
        }
    }

    // run Towers *
    /*var tower = Game.getObjectById('9889d4a8ae550152e56a3e78');
    if(tower) {
        roleTower.run(tower)
    }*/

    // Finally, signify the end of the tick in the console: · ᗧ · 🍒 · ᗣ · ᗤ ·
    mgrGui.consoleAnimation('  ');
}
