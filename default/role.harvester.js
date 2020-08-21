var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');

/**
 * Assertions:
 * Room must always be able to deliver mined resources to consumers.
 * Each harvester must have an assigned manager (source) in a 1:1 relationship.
 */


/** @param {Creep} creep **/
function retarget(creep) {
    // If harvester has no manager, assign one (storage/energy-source)
    if (undefined == creep.memory.manager) {
        // TODO: Find+Assign a manager.
    }

    // Handle full creeps
    if (creep.memory.job == 'harvest') {
        return;                                        // << Early break-point!
    }

    // if inventory empty, then goHarvest()
    if(0 == creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
        funcHarvest.goHarvest(creep);
        return;                                        // << Early break-point!
    }
    // If room has no Couriers, set next delivery target = consumers
    // If no next delivery target, set target = manager
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && 
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (target) {
        creep.memory.job = 'deliver';
        creep.memory.targetId = target.id;
		creep.memory.targetType = 'consumer';
        creep.memory.targetPos = target.pos;
    }
}


/** @param {Creep} creep **/
function run(creep) {
    retarget(creep);
    switch (creep.memory.job) {
        case 'harvest':
            funcHarvest.harvest(creep);
            break;
        case 'deliver':
            funcHarvest.deliver(creep);
            break;
        case 'recycle':
            // Handle recycle/upgrade flow
            break;
        default:
            creep.say(constants.msgStatusIdle);
            break;
    }
}

module.exports = {run};