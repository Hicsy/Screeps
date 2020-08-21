var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');
var funcRetarget = require('func.retarget');


function repair(creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        // "fetch more energy instead."
        funcHarvest.goHarvest(creep);
    } else {
        var target = null;
        var targetId = creep.memory.targetId || null;
        if (targetId){
            target = Game.getObjectById(creep.memory.targetId);
        }
        if (!target) {
            target = funcRetarget.targetNearbyRepair(creep);
        }
        if (target) {
            if (target.hits < target.hitsMax){
                if (creep.memory.job != 'repair'){
                    creep.memory.job = 'repair';
                    creep.say(constants.msgStatusRepair);
                }
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: constants.stylePathRepair});
                }
            } else {
                // repaired?
                goIdle(creep);
            }
        }
    }
}


function goRepair(creep,
                  target = {structureType: undefined,
                                       id: undefined,
                                      pos: undefined}) {
    creep.memory.job        = undefined;
	creep.memory.status     = 'repair';
    creep.memory.targetId   = target.structureType;
    creep.memory.targetType = target.id;
    creep.memory.targetPos  = target.pos;
	creep.say(constants.msgStatusRepair);
	repair(creep);
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
    repair,
    goRepair
}