var constants = require('mgr.constants');
var funcHarvest = require('func.harvest');


function upgrade(creep) {
    creep.memory.job = 'upgrade';
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: constants.stylePathUpgrade});
    }
}

function goUpgrade(creep) {
    creep.memory.job = undefined;
	creep.memory.status = 'upgrade';
	creep.memory.targetId = creep.room.controller.id;
	creep.say(constants.msgStatusUpgrade);
	upgrade(creep);
}


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.store.getFreeCapacity()){
            // if empty: go harvest
            if(creep.store[RESOURCE_ENERGY] == 0) {
                funcHarvest.goHarvest(creep);
            }
        } else {
            // if full: go upgrade
            goUpgrade(creep);
        }
	    switch (creep.memory.status) {
            case 'harvest':
                funcHarvest.harvest(creep);
                break;
            case 'upgrade':
                upgrade(creep);
                break;
            case 'idle':
                goUpgrade(creep);
                break;
            default:
                console.log(creep + ' - resetting unknown status to upgrade.')
                goUpgrade(creep);
                break;
        }
	}
};

module.exports = roleUpgrader;