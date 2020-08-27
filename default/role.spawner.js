var constants = require('mgr.constants');
var funcSpawn = require('func.spawn');


/**
 * For critically maintaining harvesters...
 * @todo Redundant. This is probably better handled by the manager script.
 * @todo Refactor getObjectById() to directly access Game hashtable instead.
 * @param {string} spawnName The index name of the spawn ie Game.spawns[spawnName] .
 */
function checkHarvester(spawnName) {
    let myHarvester = Game.getObjectById(Memory.spawns[spawnName].harvester);
    if (myHarvester) {
        // prepare to respawn when TTL is low?
        return myHarvester.ticksToLive
    } else {
        // urgently push a new Harvester
        return false
    }
}


/**
 * Try to spawn a new standardised harvester.
 * @todo Should we use silos per role, or can we stick to a single generic function?
 * @param {string} spawnName The index name of the spawn to use ie Game.spawns[spawnName] .
 */
function spawnHarvester(spawnName) {
    console.log(`${spawnName} - roleSpawner.spawnHarvester()`)

    let role = 'harvester';
    let body = funcSpawn.newBody(Game.spawns[spawnName].room.energyAvailable, 'worker');
    myResult = funcSpawn.newSpawn(spawnName, body, role);
    if (myResult == 0) {
        // success msg or whatevs
    }
    return myResult;
}


/**
 * Spawn a new standardised creep.
 * @param {string} spawnName The index NAME of the spawn to build from. eg Game.spawns[spawnName] .
 * @param {string} role The new creep's job role.
 * @param {string} bodyType The new creeps bodyType constant.
 */
function spawnWorker(spawnName, role, bodyType) {
    console.log(`${spawnName} - roleSpawner.spawnWorker(${spawnName}, ${role}, ${bodyType})`)
    let body = funcSpawn.newBody(Game.spawns[spawnName].room.energyAvailable, bodyType);
    myResult = funcSpawn.newSpawn(spawnName, body, role);
    if (myResult == 0) {
        // success msg or whatevs
    }
    return myResult;
}


module.exports = {
    spawnHarvester,
    spawnWorker
}