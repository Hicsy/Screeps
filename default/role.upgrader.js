var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');


/**
 * Attempt to perform an upgrade of this creep's room controller.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 */
function upgrade(creepName) {
    Memory.creeps[creepName].job = 'upgrade';
    if(Game.creeps[creepName].upgradeController(Game.creeps[creepName].room.controller) == ERR_NOT_IN_RANGE) {
        Game.creeps[creepName].moveTo(
            Game.creeps[creepName].room.controller,
            {visualizePathStyle: constants.stylePathUpgrade}
        );
    }
}


/**
 * Reset creep's memory and kickoff a new Upgrade process.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 */
function goUpgrade(creepName) {
    Memory.creeps[creepName].job = undefined;
	Memory.creeps[creepName].status = 'upgrade';
	Memory.creeps[creepName].targetId = Game.creeps[creepName].room.controller.id;
	Game.creeps[creepName].say(constants.msgStatusUpgrade);
	upgrade(creepName);
}



/**
 * Handle core functions of creeps with upgrader role.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 */
function run (creepName) {
    if (Game.creeps[creepName].store.getFreeCapacity()){
        // if empty: go harvest
        if(Game.creeps[creepName].store[RESOURCE_ENERGY] == 0) {
            funcHarvest.goHarvest(creepName);
        }
    }
    switch (Memory.creeps[creepName].status) {
        case 'harvest':
            funcHarvest.harvest(creepName);
            break;
        case 'upgrade':
            upgrade(creepName);
            break;
        case 'idle':
            goUpgrade(creepName);
            break;
        default:
            console.log(`${creepName} - resetting unknown status to upgrade.`)
            goUpgrade(creepName);
            break;
    }
}


module.exports = {run};