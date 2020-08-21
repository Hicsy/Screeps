var constants = require('mgr.constants');
var spawner = require('role.spawner');
const { filter } = require('lodash');

function harvestersNeeded(room) {
    console.log(room + " - mgrSpawn.harvestersNeeded() - checking harvesters...");
    var roomSources = Game.rooms[room].find(FIND_SOURCES);
    var roomHarvesters = Game.rooms[room].find(FIND_MY_CREEPS,{
        filter: (creep)=>{return creep.memory.role == 'harvester'}
    });
    if (roomHarvesters.length < roomSources.length){
        return roomSources.length - roomHarvesters.length
    }
}

function updateSourceMemory(sourceID) {
    if (!Memory.sources){Memory.sources = {}}
    if (!Memory.sources[sourceID] && Game.getObjectById(sourceID)){
        Memory.sources[sourceID] = {}
    }
}

/**
 * Spawn Rules I could be bothered to come up with right now:
 * 
 * Each energy source gets one HARVESTER.
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
 * Each energy source gets 1 BUILDER.
 *  - Body is similar to HARVESTER.
 * 
 * Each spawn or tower get one COURIER.
 *  - Each 100% MOVE speed (burdened) COURIER has pairs of [CARRY, MOVE].
 *  - Cost: {'RC1': 300, 'RC2': 500, 'RC3': 800, 'RC4': 1300}.
 * 
 * If under attack: make DEFENDER.
 * 
 * If threatened: defend/support.
 * 
 * Each energy source gets 1 UPGRADER.
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
function run(room) {
    console.log(room + " - mgrSpawn.run()");
    // Exit early if energy storage is too empty.
    if (Game.rooms[room].energyAvailable < 200) {return -6} //   << Exit-point!
    
    console.log(room + " - mgrSpawn.run(1)");
    // Exit early if no available spawner.
    var roomSpawns = Game.rooms[room].find(FIND_MY_SPAWNS);

    ////
    // TODO: this filter is NOT finding available spawns correctly
    ////
    var freeSpawns = _.filter(roomSpawns,{spawning: null});
    if (!freeSpawns.length) {return -4} // << Exit-point!
    console.log(room + " - mgrSpawn.run() - freeSpawns: " + freeSpawns);


    // Each energy source gets one HARVESTER
    for (i = harvestersNeeded(room); i > 0; i--){
        myResult = spawner.spawnHarvester(freeSpawns[0]);
        if (myResult == 0){
            unshift(freeSpawns[0]);
            //delete freeSpawns[0];
        }
    }

    // Each spawn or tower get one COURIER.

    // Each energy source gets 1 BUILDER

    // If under attack: make DEFENDER.

    // Try to upgrade existing units

    // If threatened: defend/support.

    // Each energy source gets 1 UPGRADER.

    // Each unassigned StructureContainer gets a TRUCK.

    // Each advanced resource gets a HARVESTER?

    // Expansion, Growth, Defense, Offense

}



module.exports = {
    run
}


/*
var mgrSpawn = {
    //
    run: function() {
        var spawnCap = {harvester: 1, builder: 5, upgrader: 5};
        for (var creepRole in spawnCap){
            var creepCount = _.sum(Game.creeps, (creep) => creep.memory.role == creepRole);
            var creepMax = spawnCap[creepRole]
            //console.log(creepRole + ': ' + creepCount + '/' + creepMax);
            if(creepCount < creepMax) {
                newSpawn(creepRole, spawn);
            }
        }
	}
};

module.exports = mgrSpawn;
*/