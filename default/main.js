var constants = require('mgr.constants');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTower = require('role.tower');
var mgrSpawn = require('mgr.spawn');
var mgrBuild = require('mgr.build');


module.exports.loop = function () {
    // Garbage Collection - ALWAYS RUN THIS BEFORE ANYTHING ELSE **sigh**
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
            console.log('Clearing non-existing creep memory:', i);
        }
    }


    // manage spawns + constructions
    for(let roomName in Game.rooms){
        mgrSpawn.run(roomName);
        //mgrBuild.run(Game.rooms[roomName])
    }
    

    for (mySpawn in Game.spawns){
        if(Game.spawns[mySpawn].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns[mySpawn].spawning.name];
            Game.spawns[mySpawn].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[mySpawn].pos.x + 1, 
                Game.spawns[mySpawn].pos.y, 
                {align: 'left', opacity: 0.8});
        }
    }

    
    // run Creeps
    for(var creepName in Game.creeps) {
        switch (Game.creeps[creepName].memory.role){
            case 'harvester':
                roleHarvester.run(Game.creeps[creepName]);
                break;
            case 'upgrader':
                roleUpgrader.run(Game.creeps[creepName]);
                break;
            case 'builder':
                roleBuilder.run(Game.creeps[creepName]);
                break;
        }
    }

    // run Towers *
    /*var tower = Game.getObjectById('9889d4a8ae550152e56a3e78');
    if(tower) {
        roleTower.run(tower)
    }*/
}
