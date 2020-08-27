var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');

/**
 * Assertions:
 * Room must always be able to deliver mined resources to consumers.
 * Each harvester must have an assigned manager (source) in a 1:1 relationship.
 */


/**
 * Find a job to do.
 * @todo Find+Assign a manager.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function retarget(creepName) {
    // If harvester has no manager, assign one (storage/energy-source)
    if (undefined == Memory.creeps[creepName].manager) {
        // TODO: Find+Assign a manager.
    }

    // Handle full creeps
    if (Memory.creeps[creepName].job == 'harvest') {
        return;                                        // << Early break-point!
    }

    // if inventory empty, then goHarvest()
    if(0 == Game.creeps[creepName].store.getUsedCapacity(RESOURCE_ENERGY)) {
        funcHarvest.goHarvest(creepName);
        return;                                        // << Early break-point!
    }
    // If room has no Couriers, set next delivery target = consumers
    // If no next delivery target, set target = manager
    let target = Game.creeps[creepName].pos.findClosestByPath(
        FIND_STRUCTURES,
        {filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && 
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }}
    );
    if (target) {
        Memory.creeps[creepName].job = 'deliver';
        Memory.creeps[creepName].targetId = target.id;
		Memory.creeps[creepName].targetType = 'consumer';
        Memory.creeps[creepName].targetPos = target.pos;
    }
}


/**
 * Handle core functions of creeps with harvester role.
 * @todo Handle recyle/upgrade flow.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 */
function run(creepName) {
    retarget(creepName);
    switch (Memory.creeps[creepName].job) {
        case 'harvest':
            funcHarvest.harvest(creepName);
            break;
        case 'deliver':
            funcHarvest.deliver(creepName);
            break;
        case 'recycle':
            // Handle recycle/upgrade flow
            break;
        default:
            Game.creeps[creepName].say(constants.msgStatusIdle);
            break;
    }
}

module.exports = {run};