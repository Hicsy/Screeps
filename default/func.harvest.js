var constants = require('mgr.constants');


/**
 * Verify target and then harvest it. Move-to if too far away.
 * @todo Refactor getObjectById() to directly access Game hashtable instead.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 */
function harvest(creepName) {
	// consider seeking closer enegery storage structures.
	var target = null
	if (Game.creeps[creepName].store.getFreeCapacity()){
		Memory.creeps[creepName].job = 'harvest';
		Memory.creeps[creepName].status = 'harvest'; // set outside perhaps?
		if (Memory.creeps[creepName].targetId){
			target = Game.getObjectById(Memory.creeps[creepName].targetId);
		}
		if (!target || (target.structureType !== Source)) {
			target = Game.creeps[creepName].pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if(target && target.id) {
				Memory.creeps[creepName].targetId = target.id;
				Memory.creeps[creepName].targetType = 'source';
        		Memory.creeps[creepName].targetPos = target.pos;
			}
		}
		if(target) {
			if(Game.creeps[creepName].harvest(target) == ERR_NOT_IN_RANGE) {
				Game.creeps[creepName].moveTo(
					target,
					{visualizePathStyle: constants.stylePathHarvest}
				);
			}
		}
	} else {
		goIdle(creepName);
	}
}


/**
 * Transfer energy to target in memory.
 * @todo Refactor getObjectById() to directly access Game hashtable instead.
 * @todo Handle target full or not capable errors.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 */
function deliver(creepName) {
	Memory.creeps[creepName].job = 'deliver';
	Memory.creeps[creepName].status = 'deliver';
	if (Memory.creeps[creepName].targetId){
		target = Game.getObjectById(Memory.creeps[creepName].targetId);
		if(target) {
			if(Game.creeps[creepName].transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				Game.creeps[creepName].moveTo(target, {visualizePathStyle: constants.stylePathDeliver});
			}
		}
	} else {
		goIdle(creepName);
	}
}


/**
 * Reset creep's memory and kickoff a fresh harvesting process.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function goHarvest(creepName) {
	Memory.creeps[creepName].status = 'harvest';
	Memory.creeps[creepName].job = undefined;
	Memory.creeps[creepName].targetId = undefined;
	Memory.creeps[creepName].targetType = undefined;
    Memory.creeps[creepName].targetPos = undefined;
	Game.creeps[creepName].say(constants.msgStatusHarvest);
	harvest(creepName);
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
    deliver,
	goHarvest,
	harvest
}