var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');
var funcRepair = require('func.repair');
var funcRetarget = require('func.retarget');


/**
 * Restock the builder's energy supply.
 * @todo try to find a nearby storage or dropped energy.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function restock(creepName) {
    funcHarvest.goHarvest(creepName);
}


/**
 * Continue Building target item in memory (or repair if finished).
 * @todo Refactor getObjectById() to directly access Game hashtable instead.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function build(creepName) {
    if (Game.creeps[creepName].store[RESOURCE_ENERGY] == 0) {
        // "fetch more energy instead."
        restock(creepName);
    } else {
        var target = Game.getObjectById(Memory.creeps[creepName].targetId);
        if (target == null ){
            // No target found, check if there is a repair now, otherwise retarget.
            let repairs = Game.creeps[creepName].room.lookForAt(LOOK_STRUCTURES, Memory.creeps[creepName].targetPos);
            if(repairs.length > 0) {
                repairs.sort((a,b) => a.hits - b.hits);
                funcRepair.goRepair(creepName, repairs[0]);
            } else {
                target = funcRetarget.targetNearbyConstruction(creepName);
            }
        }
        if (target) {
            // Perform Build errand on Construction Site
            if (Memory.creeps[creepName].job != 'build'){
                Memory.creeps[creepName].job = 'build';
                Game.creeps[creepName].say(constants.msgStatusBuild);
            }
            if(Game.creeps[creepName].build(target) == ERR_NOT_IN_RANGE) {
                Game.creeps[creepName].moveTo(
                    target,
                    {visualizePathStyle: constants.stylePathBuild}
                );
            }
            // TODO: catch other error codes of Build attempt.
        } else {
            target = funcRetarget.targetNearbyRepair(creepName);
        }
    }
}


/**
 * Reset creep's memory and kickoff a new Build process.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function goBuild(creepName) {
	Memory.creeps[creepName].job = undefined;
	Memory.creeps[creepName].status = 'build';
    Memory.creeps[creepName].targetId = undefined;
    Memory.creeps[creepName].targetType = undefined;
    Memory.creeps[creepName].targetPos = undefined;
	Game.creeps[creepName].say(constants.msgStatusBuild);
	build(creepName);
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
    build,
    goBuild
}