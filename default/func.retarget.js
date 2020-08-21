var constants = require('mgr.constants');

/**
 * Performs an expanding search until a nearby CONSTRUCTION target is found:
 *
 *  - (Any) Closest
 *  - (Mine) Size <= 5k, NOT: Road/Wall/Rampart.
 *  - (Mine) Size <= 5k.
 *  - (Mine) Any
 */
function targetNearbyConstruction(creep, forceClosest = false) {
    console.log(creep + "- : Searching for constructions...");
    var target = null
    // Waterfall through expanding criteria until a target is found:    
    for (retry = 0; target == null; retry++){
        switch (retry) {
            case 0:
                if (forceClosest) {
                    console.log(creep + "- 0: Getting closest site...");
                    target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                }
                break;
            case 1:
                console.log(creep + "- 1: Finding my basic sites...");
                //target = creep.room.find(
                target = creep.pos.findClosestByPath(
                    FIND_MY_CONSTRUCTION_SITES,
                    {filter: (obj) => obj.progressTotal <= 5000
                        && !([STRUCTURE_WALL,
                            STRUCTURE_RAMPART,
                            STRUCTURE_ROAD].includes(obj.structureType))
                    }
                );
                break;
            case 2:
                console.log(creep + "- 2: Finding any normal sites incl road/wall/rampart...");
                target = creep.pos.findClosestByPath(
                    FIND_MY_CONSTRUCTION_SITES,
                    {filter: (obj) => obj.progressTotal <= 5000}
                );
                break;
            case 3:
                console.log(creep + "- 3: Getting any site...");
                target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                break;
            default:
                console.log(creep + "- UNABLE to find construction site!");
                return null; // extra exit-point
        }
    }
    ///////////////////////////////////////////////////////////////
    // TODO: Finalise design choice - set creep.memory.targetId ... or return object/list ??
    if (target && target.id) {
        console.log(creep + "- Target construction site:" + target);
        creep.memory.targetId = target.id;
        creep.memory.targetType = target.structureType;
        creep.memory.targetPos = target.pos;
        creep.memory.job == 'build';
    } else {
        console.log(creep + "- Construction target ID unavailable or no Target.");
    }
    return target // another exit-point exists in the switch statement!
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
 *  TODO: Consider splitting walls/ramparts/?roads? into their own repair agents
 */
function targetNearbyRepair(creep, forceClosest = false) {
    console.log(creep.id + "_" + creep + "- Searching for repairs...");
    var target = null
    // Waterfall through expanding options until a target is found:
    for (retry = 0; target == null; retry++){
        switch (retry) {
            case 0:
                if (forceClosest) {
                    console.log(creep + "- 0: Getting closest repair...");
                    target = creep.pos.findClosestByPath(
                        FIND_STRUCTURES,
                        {filter: (obj) => obj.hits < obj.hitsMax}
                        // TODO: does it need to filter owner != enemy?
                    );
                }
                break;
            case 1:
                console.log(creep + "- 1: Finding my basic repairs...");
                //target = creep.room.find(
                target = creep.pos.findClosestByPath(
                    FIND_MY_STRUCTURES,
                    {filter: (obj) => obj.hits < (obj.hitsMax - 200)
                        && obj.hits <= 5000
                    }
                );
                break;
            case 2:
                console.log(creep + "- 2: Finding my normal repairs...");
                target = creep.pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < (obj.hitsMax - 200)
                        && obj.hits <= 30000
                    }
                );
                break;
            case 3:
                console.log(creep + "- 3: Finding any repair incl roads on hills...");
                target = creep.pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax
                        && obj.hits <= 75000
                    }
                );
                break;
            case 4:
                console.log(creep + "- 4: Finding any repair below chosen Walls Max...");
                target = creep.pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax
                        && obj.hits <= 250000
                    }
                );
                break;
            case 5:
                console.log(creep + "- 5: Finding any repair below a nuke...");
                target = creep.pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax
                        && obj.hits <= 10000000
                    }
                );
                break;
            case 6:
                console.log(creep + "- 6: Getting any repairs...");
                target = creep.pos.findClosestByPath(
                    FIND_STRUCTURES,
                    {filter: (obj) => obj.hits < obj.hitsMax}
                );
                break;
            default:
                console.log(creep + "- 7: UNABLE to find any repair sites!");
                return null; // << extra exit-point.
        }
    }
    ///////////////////////////////////////////////////////////////
    // TODO: Finalise design choice - set creep.memory.targetId ... or return object/list ??
    if (target && target.id) {
        console.log(creep + "- Target repair site:" + target);
        creep.memory.targetId = target.id;
        creep.memory.targetType = target.structureType;
        creep.memory.targetPos = target.pos;
        creep.memory.job == 'repair'
    } else {
        console.log(creep + "- Repair target ID unavailable or no repairs required :-S");
    }
    return target // another exit-point exists in the switch statement!
}



module.exports = {
    targetNearbyConstruction,
    targetNearbyRepair
}