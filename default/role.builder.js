var constants = require('mgr.constants');
var funcBuild = require('func.build');
var funcHarvest = require('func.harvest');
var funcRepair = require('func.repair');
var funcRetarget = require('func.retarget');
//var funcBuild = require('func.build');


function idleWork(creep) {
	// TODO: This is being rebuilt. I just finished splitting build() + repair() into stand-alone modules+functions.
	//console.log(creep.id + "_" + creep + " - RoleBuilder::idleWork.")
	// TODO: if target already set, do that instead of calculating?
	var target = null
	if (!creep.memory.targetId){
		console.log(creep.id + "_" + creep + " - RoleBuilder::idleWork::RetargetConstruction.")
		target = funcRetarget.targetNearbyConstruction(creep);
		if (!target) {
			console.log(creep.id + "_" + creep + " - RoleBuilder::idleWork::RetargetRepair.")
			funcRetarget.targetNearbyRepair(creep);
		}
	}
	if (creep.memory.targetId){
		switch (creep.memory.job) {
			case 'harvest':
				funcHarvest.harvest(creep);
				break;
			case 'repair':
				funcRepair.repair(creep);
				break;
			case 'build':
				funcBuild.build(creep);
				break;
			case undefined:
				funcBuild.goBuild(creep);
				break;
			default:
				creep.say(constants.msgStatusIdle);
				// do upgrades or stocking up?
				break;
		}
	} else {
		creep.say(constants.msgStatusIdle);
		// upgrade core?
		// move somewhere to wait?
		// become something else?
	}
}

function goIdle(creep) {
	creep.memory.job = undefined;
	creep.memory.status = 'idle';
	creep.memory.targetId = undefined;
	creep.memory.targetType = undefined;
    creep.memory.targetPos = undefined;
	creep.say(constants.msgStatusIdle);
	idleWork(creep);
}



function build(creep, targetId) {
	target = Game.getObjectById(targetId);
	if (target) {
		if (creep.store[RESOURCE_ENERGY] == 0) {
			// "fetch more energy instead."
			funcHarvest.goHarvest(creep);
		} else {
			if (target instanceof ConstructionSite) {
				// "do some building!"
				if (creep.memory.job != 'build'){
					creep.memory.job = 'build';
					creep.say(constants.msgStatusBuild);
				}
				if(creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: constants.stylePathBuild});
				}
			} else if (target.structureType != null) {
				// "repair job instead?"
				if (target.hits < target.hitsMax){
					if (creep.memory.job != 'repair'){
						creep.memory.job = 'repair';
						creep.say(constants.msgStatusRepair);
					}
					if(creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: constants.stylePathRepair});
					}
				} else {
					// repaired.
					goIdle(creep);
				}
			} else {
				// "no idea!" Maybe the construction just finished.
				console.log("Build order given targeting non-contruction site!")
				goIdle(creep);
			}
		}
	} else {
		// no target was set.
		goIdle(creep);
	}
}


//////    export: run    //////
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		//console.log(creep.id + "_" + creep + " - RoleBuilder func.")
		idleWork(creep);
	}
};

module.exports = roleBuilder;