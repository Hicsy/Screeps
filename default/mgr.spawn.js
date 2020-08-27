var constants = require('mgr.constants');
var spawner = require('role.spawner');
const { filter } = require('lodash');


/**
 * Spawn Rules I could be bothered to come up with right now:
 * 
 * Each energy source gets 1 HARVESTER.
 *  - Harvester sized at upto (X ticks) faster than full drain:
 *      - Source size = 3000 (or 1500 Unreserved / 4000 Center).
 *      - Sources refill after 300 ticks (so average 10/tick).
 *      - Each unboosted WORK unit harvests 2 energy per tick.
 *      - Therefore 5 WORK units (RCL3) to max out claimed source...
 *          - Or 6-7 WORK units (RCL4) for speed+overheads.
 *  - Example 50% MOVE speed (unburdened) harvester:
 *      - MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, WORK.
 *      - Cost: 800 (RCL3 Max), Spawn Time: 30 ticks (3 ticks / part).
 *  - Delivers to closest spawn (If no COURIER) otherwise StructureContainer.
 * 
 * Each energy source adds 1 BUILDER.
 *  - Body is similar to HARVESTER.
 * 
 * Each spawn or tower adds 1 COURIER.
 *  - Each 100% MOVE speed (burdened) COURIER has pairs of [CARRY, MOVE].
 *  - Cost: {'RC1': 300, 'RC2': 500, 'RC3': 800, 'RC4': 1300}.
 * 
 * If under attack: make DEFENDER.
 * 
 * If threatened: defend/support.
 * 
 * Each energy source adds 1 UPGRADER.
 *  - Body is [CARRY, MOVE] then all WORK (upto RCL max like the COURIERS).
 * 
 * Each unassigned StructureContainer gets a TRUCK.
 *  - Body is blocks of [CARRY, CARRY, CARRY, MOVE] to Energy Max.
 * 
 * Each resource gets a HARVESTER?
 *  - TODO: Check resource harvesting/trading/crafting processes
 * 
 * When all above is covered, and energy stores definitely maxed:
 *  - Expansion
 *  - Growth
 *  - Defense
 *  - Offense
 */


/**
 * Each energy source gets 1 HARVESTER
 * @param {string} roomName The index name of the room ie Game.rooms[roomName] .
 */
function harvestersNeeded(roomName) {
    console.log(`${roomName} - mgrSpawn.harvestersNeeded() - checking 'harvester' count...`);
    let roomSources = Game.rooms[roomName].find(FIND_SOURCES);
    let roomWorkers = Game.rooms[roomName].find(
        FIND_MY_CREEPS,
        {filter: (creep)=>{return creep.memory.role == 'harvester'}}
    );
    return roomSources.length - roomWorkers.length
}


/**
 * Each energy source adds 1 BUILDER
 * @param {string} roomName The index name of the room ie Game.rooms[roomName] .
 */
function buildersNeeded(roomName) {
    console.log(`${roomName} - mgrSpawn.buildersNeeded() - checking 'builder' count...`);
    let roomSources = Game.rooms[roomName].find(FIND_SOURCES);
    let roomWorkers = Game.rooms[roomName].find(
        FIND_MY_CREEPS,
        {filter: (creep)=>{return creep.memory.role == 'builder'}}
    );
    return roomSources.length - roomWorkers.length
}


/**
 * Each spawn or tower adds 1 COURIER.
 * @param {string} roomName The index name of the room ie Game.rooms[roomName] .
 */
function couriersNeeded(roomName) {
    console.log(`${roomName} - mgrSpawn.couriersNeeded() - checking 'courier' count...`);
    let roomConsumers = []
    let found = Game.rooms[roomName].find(
        FIND_STRUCTURES,
        {filter: (obj)=>{return [STRUCTURE_SPAWN,
                        STRUCTURE_TOWER].includes(obj.structureType)}}
        ); // TODO: count containers also? << maybe truck-specific instead.
    console.log(`${roomName} - mgrSpawn.couriersNeeded() - Consumer: ${found.length}`);
    roomConsumers.push(...[].concat(found));
    let roomWorkers = Game.rooms[roomName].find(
        FIND_MY_CREEPS,
        {filter: (creep)=>{return creep.memory.role == 'courier'}}
    );
    let [i,j] = [roomWorkers.length, roomConsumers.length];
    console.log(`${roomName} - mgrSpawn.couriersNeeded() - Couriers: ${i}/${j}`);
    return roomConsumers.length - roomWorkers.length
}


/**
 * Each energy source adds 1 UPGRADER.
 * @param {string} roomName The index name of the room ie Game.rooms[roomName] .
 */
function upgradersNeeded(roomName) {
    console.log(`${roomName} - mgrSpawn.upgradersNeeded() - checking 'upgrader' count...`);
    let roomSources = Game.rooms[roomName].find(FIND_SOURCES);
    let roomWorkers = Game.rooms[roomName].find(
        FIND_MY_CREEPS,
        {filter: (creep)=>{return creep.memory.role == 'upgrader'}}
    );
    return roomSources.length - roomWorkers.length
}


/**
 * Add an energy source into memory.
 * @param {string} sourceID The energy source to add into memory.
 */
function updateSourceMemory(sourceID) {
    if (!Memory.sources){Memory.sources = {}}
    if (!Memory.sources[sourceID] && Game.getObjectById(sourceID)){
        Memory.sources[sourceID] = {}
    }
}


/**
 * A Manager to oversee the creep spawning of a given room.
 * @param {string} roomName The index name of the room ie Game.rooms[roomName] .
 */
function run(roomName) {
    // Exit early if energy storage is too empty.
    console.log(`${roomName} - mgrSpawn.run()`);
    if (Game.rooms[roomName].energyAvailable < 200) {return -6} //   << Exit-point!
    
    // Exit early if no available spawner.
    var freeSpawns = Game.rooms[roomName].find(FIND_MY_SPAWNS, {filter: {spawning: null} });
    if (!freeSpawns.length) {return -4} //                       << Exit-point!
    
    console.log(`${roomName} - mgrSpawn.run(1) - freeSpawns: ${freeSpawns}`);
    // Each energy source gets one HARVESTER
    for (i = harvestersNeeded(roomName); i > 0; i--){
        myResult = spawner.spawnWorker(freeSpawns[0].name, 'harvester', 'worker');
        if (myResult == 0){
            freeSpawns.shift();
            if (!freeSpawns.length) {return -4} //               << Exit-point!
            //delete freeSpawns[0];
        }
    }

    console.log(`${roomName} - mgrSpawn.run(2) - freeSpawns: ${freeSpawns}`);
    // Each energy source gets 1 BUILDER
    for (i = buildersNeeded(roomName); i > 0; i--){
        myResult = spawner.spawnWorker(freeSpawns[0].name, 'builder', 'worker');
        if (myResult == 0){
            freeSpawns.shift();
            if (!freeSpawns.length) {return -4} //               << Exit-point!
            //delete freeSpawns[0];
        }
    }

    console.log(`${roomName} - mgrSpawn.run(3) - freeSpawns: ${freeSpawns}`);
    // Each spawn or tower get one COURIER.
    for (i = couriersNeeded(roomName); i > 0; i--){
        myResult = spawner.spawnWorker(freeSpawns[0].name, 'courier', 'courier');
        if (myResult == 0){
            freeSpawns.shift();
            if (!freeSpawns.length) {return -4} //               << Exit-point!
            //delete freeSpawns[0];
        }
    }

    console.log(`${roomName} - mgrSpawn.run(4) - freeSpawns: ${freeSpawns}`);
    // If under attack: make DEFENDER.

    console.log(`${roomName} - mgrSpawn.run(5) - freeSpawns: ${freeSpawns}`);
    // Try to upgrade existing units

    console.log(`${roomName} - mgrSpawn.run(6) - freeSpawns: ${freeSpawns}`);
    // If threatened: defend/support.

    console.log(`${roomName} - mgrSpawn.run(7) - freeSpawns: ${freeSpawns}`);
    // Each energy source gets 1 UPGRADER.
    for (i = upgradersNeeded(roomName); i > 0; i--){
        myResult = spawner.spawnWorker(freeSpawns[0].name, 'upgrader', 'worker');
        if (myResult == 0){
            freeSpawns.shift();
            if (!freeSpawns.length) {return -4} //               << Exit-point!
            //delete freeSpawns[0];
        }
    }

    console.log(`${roomName} - mgrSpawn.run(8) - freeSpawns: ${freeSpawns}`);
    // Each unassigned StructureContainer gets a TRUCK.

    console.log(`${roomName} - mgrSpawn.run(9) - freeSpawns: ${freeSpawns}`);
    // Each advanced resource gets a HARVESTER?

    console.log(`${roomName} - mgrSpawn.run(10) - freeSpawns: ${freeSpawns}`);
    // Expansion, Growth, Defense, Offense

}



module.exports = {
    run
}