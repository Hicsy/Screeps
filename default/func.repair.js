var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');
var funcRetarget = require('func.retarget');


/**
 * Repair target structure in memory after validating it.
 * @todo Refactor getObjectById() to directly access Game hashtable instead.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function repair(creepName) {
    if (Game.creeps[creepName].store[RESOURCE_ENERGY] == 0) {
        // "fetch more energy instead."
        funcHarvest.goHarvest(creepName);
    } else {
        var target = null;
        var targetId = Memory.creeps[creepName].targetId || null;
        if (targetId){
            target = Game.getObjectById(Memory.creeps[creepName].targetId);
        }
        if (!target) {
            target = funcRetarget.targetNearbyRepair(creepName);
        }
        if (target) {
            if (target.hits < target.hitsMax){
                if (Memory.creeps[creepName].job != 'repair'){
                    Memory.creeps[creepName].job = 'repair';
                    Game.creeps[creepName].say(constants.msgStatusRepair);
                }
                if(Game.creeps[creepName].repair(target) == ERR_NOT_IN_RANGE) {
                    Game.creeps[creepName].moveTo(
                        target,
                        {visualizePathStyle: constants.stylePathRepair}
                    );
                }
            } else {
                // repaired?
                goIdle(creepName);
            }
        }
    }
}


/**
 * Reset creep's memory and kickoff a new Repair process.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 * @param {Object} [target] The actual target to dissect into memory.
 */
function goRepair(creepName,
                  target = {structureType: undefined,
                                       id: undefined,
                                      pos: undefined}) {
    Memory.creeps[creepName].job        = undefined;
	Memory.creeps[creepName].status     = 'repair';
    Memory.creeps[creepName].targetId   = target.structureType;
    Memory.creeps[creepName].targetType = target.id;
    Memory.creeps[creepName].targetPos  = target.pos;
	Game.creeps[creepName].say(constants.msgStatusRepair);
	repair(creepName);
}


/**
 * Reset creep's memory and go into idle state.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function goIdle(creepName) {
	Memory.creeps[creepName].job = undefined;
	Memory.creeps[creepName].status = 'idle';
    Memory.creeps[creepName].targetId = undefined;
    Memory.creeps[creepName].targetType = undefined;
    Memory.creeps[creepName].targetPos = undefined;
	Game.creeps[creepName].say(constants.msgStatusIdle);
}


module.exports = {
    repair,
    goRepair
}