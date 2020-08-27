var constants = require('mgr.constants');
var funcBuild = require('func.build');
var funcHarvest = require('func.harvest');
var funcRepair = require('func.repair');
var funcRetarget = require('func.retarget');
//var funcBuild = require('func.build');


/**
 * Find work to do while memory doesnt already have a job.
 * @todo This seems more like core run() functionality rather than an extra.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 */
function idleWork(creepName) {
	var target = null
	if (!Memory.creeps[creepName].targetId){
		console.log(`${creepName} - RoleBuilder::idleWork::RetargetConstruction.`)
		target = funcRetarget.targetNearbyConstruction(creepName);
		if (!target) {
			console.log(`${creepName} - RoleBuilder::idleWork::RetargetRepair.`)
			funcRetarget.targetNearbyRepair(creepName);
		}
	}
	if (Memory.creeps[creepName].targetId){
		switch (Memory.creeps[creepName].job) {
			case 'harvest':
				funcHarvest.harvest(creepName);
				break;
			case 'repair':
				funcRepair.repair(creepName);
				break;
			case 'build':
				funcBuild.build(creepName);
				break;
			case 'spawning':
				goIdle(creepName);
				break;
			case undefined:
				funcBuild.goBuild(creepName);
				break;
			default:
				Game.creeps[creepName].say(constants.msgStatusIdle);
				// do upgrades or stocking up?
				break;
		}
	} else {
		Game.creeps[creepName].say(constants.msgStatusIdle);
		// upgrade core?
		// move somewhere to wait?
		// become something else?
	}
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
	idleWork(creepName);
}


/**
 * Continue Building target item in memory (or repair if finished).
 * @todo Is this needed anymore? Now moved to funcBuild.build() .
 * @todo Refactor getObjectById() to directly access Game hashtable instead.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function build(creepName, targetId) {
	target = Game.getObjectById(targetId);
	if (target) {
		if (Game.creeps[creepName].store[RESOURCE_ENERGY] == 0) {
			// "fetch more energy instead."
			funcHarvest.goHarvest(creep);
		} else {
			if (target instanceof ConstructionSite) {
				// "do some building!"
				if (Memory.creeps[creepName].job != 'build'){
					Memory.creeps[creepName].job = 'build';
					Game.creeps[creepName].say(constants.msgStatusBuild);
				}
				if(Game.creeps[creepName].build(target) == ERR_NOT_IN_RANGE) {
					Game.creeps[creepName].moveTo(target, {visualizePathStyle: constants.stylePathBuild});
				}
			} else if (target.structureType != null) {
				// "repair job instead?"
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
					// repaired.
					goIdle(creepName);
				}
			} else {
				// "no idea!" Maybe the construction just finished.
				console.log("Build order given targeting non-contruction site!")
				goIdle(creepName);
			}
		}
	} else {
		// no target was set.
		goIdle(creepName);
	}
}


/**
 * Handle core functions of creeps with builder role.
 * @todo Sort out between this and idleWork() .
 * @todo Handle "BusyWork" should nothing be needed.
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 */
function run(creepName) {
	console.log(`${creepName} - RoleBuilder.run(${creepName})`)
	var target = null
	if (!Memory.creeps[creepName].targetId){
		console.log(`${creepName} - RoleBuilder::idleWork::RetargetConstruction.`)
		target = funcRetarget.targetNearbyConstruction(creepName);
		if (!target) {
			console.log(`${creepName} - RoleBuilder::idleWork::RetargetRepair.`)
			funcRetarget.targetNearbyRepair(creepName);
		}
	}
	if (Memory.creeps[creepName].targetId){
		switch (Memory.creeps[creepName].job) {
			case 'harvest':
				funcHarvest.harvest(creepName);
				break;
			case 'repair':
				funcRepair.repair(creepName);
				break;
			case 'build':
				funcBuild.build(creepName);
				break;
			case 'spawning':
				goIdle(creepName);
				break;
			case undefined:
				funcBuild.goBuild(creepName);
				break;
			default:
				Game.creeps[creepName].say(constants.msgStatusIdle);
				// do upgrades or stocking up?
				break;
		}
	} else {
		Game.creeps[creepName].say(constants.msgStatusIdle);
		// upgrade core?
		// move somewhere to wait?
		// become something else?
	}
}

module.exports = {run}