var constants = require('mgr.constants');
var funcSpawn = require('func.spawn');

function newSpawn(creepRole, spawn){
    // check spawn busy?
    var newName = creepRole + Game.time;
    console.log('Spawning: ' + newName);

    Game.spawns[spawn].spawnCreep(
        [WORK,CARRY,MOVE],
        newName, 
        {memory: {role: creepRole}}
    );
}

/** 
 * @param {Structure} spawn
 */
function checkHarvester(spawn) {
    var myHarvester = Game.getObjectById(spawn.memory.harvester);
    if (myHarvester) {
        // prepare to respawn when TTL is low?
        return myHarvester.ticksToLive
    } else {
        // urgently push a new Harvester
        return false
    }
}

function spawnHarvester(spawn) {
    console.log(`${spawn} - roleSpawner.spawnHarvester()`)

    let role = 'harvester';
    let body = funcSpawn.newBody(spawn.room.energyAvailable, 'worker');
    myResult = funcSpawn.newSpawn(spawn.name, body, role);
    if (myResult == 0) {
        // success msg or whatevs
    }
    return myResult;
}

/**
 * 
 * @param {Structure} spawn The spawn object to attempt to build from.
 * @param {String} role The new creep's job role.
 * @param {String} bodyType The new creeps bodyType constant.
 */
function spawnWorker(spawn, role, bodyType) {
    console.log(`${spawn} - roleSpawner.spawnWorker(${spawn}, ${role}, ${bodyType})`)
    let body = funcSpawn.newBody(spawn.room.energyAvailable, bodyType);
    myResult = funcSpawn.newSpawn(spawn.name, body, role);
    if (myResult == 0) {
        // success msg or whatevs
    }
    return myResult;
}


module.exports = {
    spawnHarvester,
    spawnWorker
}