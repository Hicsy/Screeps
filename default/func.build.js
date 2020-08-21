var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');
var funcRepair = require('func.repair');
var funcRetarget = require('func.retarget');

function restock(creep) {
    // TODO: try to find a nearby storage or dropped energy.
    funcHarvest.goHarvest(creep);
}

function build(creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        // "fetch more energy instead."
        restock(creep);
    } else {
        var target = Game.getObjectById(creep.memory.targetId);
        if (target == null ){
            // No target found, check if there is a repair now, otherwise retarget.
            let repairs = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.targetPos);
            if(repairs.length > 0) {
                repairs.sort((a,b) => a.hits - b.hits);
                funcRepair.goRepair(creep, repairs[0]);
            } else {
                target = funcRetarget.targetNearbyConstruction(creep);
            }
        }
        if (target) {
            // Perform Build errand on Construction Site
            if (creep.memory.job != 'build'){
                creep.memory.job = 'build';
                creep.say(constants.msgStatusBuild);
            }
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: constants.stylePathBuild});
            }
            // TODO: catch other error codes of Build attempt.
        }
    }
}

function goBuild(creep) {
	creep.memory.job = undefined;
	creep.memory.status = 'build';
    creep.memory.targetId = undefined;
    creep.memory.targetType = undefined;
    creep.memory.targetPos = undefined;
	creep.say(constants.msgStatusBuild);
	build(creep);
}

function goIdle(creep) {
	creep.memory.job = undefined;
	creep.memory.status = 'idle';
    creep.memory.targetId = undefined;
    creep.memory.targetType = undefined;
    creep.memory.targetPos = undefined;
	creep.say(constants.msgStatusIdle);
}


module.exports = {
    build,
    goBuild
}