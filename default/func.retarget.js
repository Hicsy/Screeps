var constants = require('mgr.constants');


/**
 * Perform an expanding search until a nearby CONSTRUCTION target is found:
 *
 *  - (Any) Closest
 *  - (Mine) Size <= 5k, NOT: Road/Wall/Rampart.
 *  - (Mine) Size <= 5k.
 *  - (Mine) Any
 * @param {string} creepName The index name of the creep ie Game.creeps[creepName] .
 * @param {boolean} [forceClosest=false] Quickly return the closest target if true.
 */
function targetNearbyConstruction(creepName, forceClosest = false) {
    console.log(`${creepName} - Searching for constructions...`);
    var target = null
    // Waterfall through expanding criteria until a target is found:    
    for (retry = 0; target == null; retry++){
        switch (retry) {
            case 0:
                if (forceClosest) {
                    console.log(`${creepName} - 0: Getting closest site...`);
                    target = Game.creeps[creepName].pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                }
                break;
            case 1:
                console.log(`${creepName} - 1: Finding my basic sites...`);
                //target = Game.creeps[creepName].room.find(
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_MY_CONSTRUCTION_SITES,
                    {filter: (obj) => {return (
                        obj.progressTotal <= 5000
                        && !([STRUCTURE_WALL,
                            STRUCTURE_RAMPART,
                            STRUCTURE_ROAD].includes(obj.structureType))
                        )}
                    }
                );
                break;
            case 2:
                console.log(`${creepName} - 2: Finding any normal sites incl road/wall/rampart...`);
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_MY_CONSTRUCTION_SITES,
                    {filter: (obj) => obj.progressTotal <= 5000}
                );
                break;
            case 3:
                console.log(`${creepName} - 3: Getting any site...`);
                target = Game.creeps[creepName].pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                break;
            default:
                console.log(`${creepName} - UNABLE to find construction site!`);
                return null; //                                extra exit-point
        }
    }
    ///////////////////////////////////////////////////////////////
    // TODO: Finalise design choice - set Memory.creeps[creepName].targetId ... or return object/list ??
    if (target && target.id) {
        console.log(`${creepName} - Target construction site: ${target}`);
        Memory.creeps[creepName].targetId = target.id;
        Memory.creeps[creepName].targetType = target.structureType;
        Memory.creeps[creepName].targetPos = target.pos;
        Memory.creeps[creepName].job == 'build';
    } else {
        console.log(`${creepName} - Construction target ID unavailable or no Target.`);
    }
    return target // another exit-point exists within the switch statement!
}



/**
 * Performs an expanding search until a nearby REPAIR target is found:
 *
 *  - (Any) Closest: Damaged structure
 *  - (Mine) Damaged>200, Hits <= 5k
 *  - (Any) Damaged, Hits <= 30k
 *  - (Any) Damaged, Hits <= 75k (roads on hills)
 *  - (Any) Damaged, Hits <= 250k (walls chosen Max)
 *  - (Any) Damaged, Hits <= 10Mil (nuke DMG)
 *  - (Any) Damaged
 * 
 * @todo Consider splitting walls/ramparts/?roads? into their own repair agents.
 * @param {string} creepName The index name of this creep ie Game.creeps[creepName] .
 * @param {boolean} [forceClosest=false] Quickly return the closest target if true.
 */
function targetNearbyRepair(creepName, forceClosest = false) {
    console.log(`${creepName} - Searching for repairs...`);
    var target = null
    // Waterfall through expanding options until a target is found:
    for (retry = 0; target == null; retry++){
        switch (retry) {
            case 0:
                if (forceClosest) {
                    console.log(`${creepName} - 0: Getting closest repair...`);
                    target = Game.creeps[creepName].pos.findClosestByPath(
                        FIND_STRUCTURES,
                        {filter: (obj) => obj.hits < obj.hitsMax}
                        // TODO: does it need to filter owner != enemy?
                    );
                }
                break;
            case 1:
                console.log(`${creepName} - 1: Finding my basic repairs...`);
                //target = Game.creeps[creepName].room.find(
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_MY_STRUCTURES,
                    {filter: (obj) => obj.hits < (obj.hitsMax - 200)
                        && obj.hits <= 5000
                    }
                );
                break;
            case 2:
                console.log(`${creepName} - 2: Finding my normal repairs...`);
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < (obj.hitsMax - 200)
                        && obj.hits <= 30000
                    }
                );
                break;
            case 3:
                console.log(`${creepName} - 3: Finding any repair incl roads on hills...`);
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax
                        && obj.hits <= 75000
                    }
                );
                break;
            case 4:
                console.log(`${creepName} - 4: Finding any repair below chosen Walls Max...`);
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax
                        && obj.hits <= 250000
                    }
                );
                break;
            case 5:
                console.log(`${creepName} - 5: Finding any repair below a nuke...`);
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax
                        && obj.hits <= 10000000
                    }
                );
                break;
            case 6:
                console.log(`${creepName} - 6: Getting any repairs...`);
                target = Game.creeps[creepName].pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax}
                );
                break;
            default:
                console.log(`${creepName} - 7: UNABLE to find any repair sites!`);
                return null; // << extra exit-point.
        }
    }
    ///////////////////////////////////////////////////////////////
    // TODO: Finalise design choice - set Memory.creeps[creepName].targetId ... or return object/list ??
    if (target && target.id) {
        console.log(`${creepName} - Target repair site: ${target}`);
        Memory.creeps[creepName].targetId = target.id;
        Memory.creeps[creepName].targetType = target.structureType;
        Memory.creeps[creepName].targetPos = target.pos;
        Memory.creeps[creepName].job = 'repair'
    } else {
        console.log(`${creepName} - Repair target ID unavailable or no repairs required :-S`);
    }
    return target // another exit-point exists in the switch statement!
}



module.exports = {
    targetNearbyConstruction,
    targetNearbyRepair
}