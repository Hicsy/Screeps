var constants = require('mgr.constants');


/**
 * Get a new creep BODY reduced to fit the energy budget.
 * @param {number} energy The permitted MAX energy budget for this creep.
 * @param {string} [bodyType=worker] A body as defined in constants[bodies].
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


/**
 * Spawn defined creep with some pre-defined memory.
 * @param {string} spawnName The index NAME of the spawn to use. ie Game.spawns[spawnName] .
 * @param {string[]} body An array describing new creep’s body. eg [WORK,CARRY,MOVE] .
 * @param {string} role The new creep's role, stored as: Memory.creeps[creepName].role .
 * @param {string} [manager] ID of the creep's boss stored as: Memory.creeps[creepName].manager .
 * @param {string} [creepName] The index name for the new creep ie Game.creeps[creepName] .
 */
function newSpawn(spawnName, body, role, manager, creepName) {
    // check spawn busy?
    if (!creepName){
        var creepName = role + Game.time;
    }
    if (!manager){
        var manager = undefined;
    }


    console.log(`${spawnName} - funcSpawn.newSpawn(${spawnName}, ${body}, ${role}, ${manager}, ${creepName})`)
    
    myResult = Game.spawns[spawnName].spawnCreep(
        body,
        creepName, 
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
        console.log(`${spawnName} - Spawning: ${creepName}`);
    }
    return myResult;
}

module.exports = {
    newBody,
    newSpawn
}