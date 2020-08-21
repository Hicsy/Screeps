var constants = require('mgr.constants');

/**
 * Get a new creep BODY reduced to fit the energy budget.
 * @param {number} energy The permitted MAX energy budget for this creep.
 * @param {string} [bodyType] A body as defined in constants[bodies].
 * @returns {Array} A new creep body list.
 */
function newBody(energy, bodyType = "worker") {
    var blueprint = constants.bodies[bodyType]
    var body = [];
    var bodyCost = 0;

    //body = constants.bodies[bodyType].reduceRight((x,part)=>{chk+unsh},body)
    for (let i = blueprint.length-1; i >= 0; i--){
        part = blueprint[i]
        bodyCost += BODYPART_COST[part]
        if (bodyCost <= energy) {
            body.unshift(part);
        }else{
            break;
        }
    }
    if (body.length){return body}
}

// spawn defined dood with some items in memory.
function newSpawn(spawn, body, role, manager, name) {
    // check spawn busy?
    if (!name){
        var name = role + Game.time;
    }
    if (!manager){
        var manager = undefined;
    }


    console.log(spawn + " - funcSpawn.newSpawn("+ spawn + body + role + manager + name+")")
    
    myResult = Game.spawns[spawn].spawnCreep(
        body,
        name, 
        {memory: {
            manager: manager,
            role: role, // builder, harvester, upgrader
            targetId: undefined, // target.id
            targetType: undefined, // target.structureType
            targetPos: undefined, // target.pos
            job: 'spawning'
        }}
    );
    if (myResult == 0) {
        console.log(spawn + ' - Spawning: ' + name);
    }
    return myResult;
}

module.exports = {
    newBody,
    newSpawn
}