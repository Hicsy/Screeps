var constants = require('mgr.constants');

function harvest(creep) {
	// consider seeking closer enegery storage structures.
	var target = null
	if (creep.store.getFreeCapacity()){
		creep.memory.job = 'harvest';
		creep.memory.status = 'harvest'; // set outside perhaps?
		if (creep.memory.targetId){
			target = Game.getObjectById(creep.memory.targetId);
		}
		if (!target || (target.structureType !== Source)) {
			target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if(target && target.id) {
				creep.memory.targetId = target.id;
				creep.memory.targetType = 'source';
        		creep.memory.targetPos = target.pos;
			}
		}
		if(target) {
			if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {visualizePathStyle: constants.stylePathHarvest});
			}
		}
	} else {
		goIdle(creep);
	}
}

function deliver(creep) {
	creep.memory.job = 'deliver';
	creep.memory.status = 'deliver';
	if (creep.memory.targetId){
		target = Game.getObjectById(creep.memory.targetId);
		if(target) {
			if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {visualizePathStyle: constants.stylePathDeliver});
			}
		}
	} else {
		goIdle(creep);
	}
}

function goHarvest(creep) {
	creep.memory.job = undefined;
	creep.memory.status = 'harvest';
	creep.memory.targetId = undefined;
	creep.memory.targetType = undefined;
    creep.memory.targetPos = undefined;
	creep.say(constants.msgStatusHarvest);
	harvest(creep);
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
    deliver,
	goHarvest,
	harvest
}