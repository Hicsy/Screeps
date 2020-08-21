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
    let target = creep.room.findClosestByPath(FIND_STRUCTURES, {
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


    // Won't this just go back to harvesting after 1 tick of work?!?
    if(creep.store.getFreeCapacity() > 0) {
        var resource = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else {
        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

module.exports = {run};