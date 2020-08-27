/**
 * A manager to oversee all builds for a given room.
 * @param {string} roomName The index name of the room ie Game.rooms[roomName] .
 */
function run (roomName) {
    let constructions = Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES);
    console.log('Construction sites available: ' + constructions.length);
    if (constructions) {
        freeBuilders = _.filter(Game.creeps,{'room': Game.rooms[roomName], 'status': 'idle'})
        console.log('Builders available: ' + freeBuilders.length);
    }
    /*if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
    }
    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
        creep.memory.building = true;
        creep.say('🚧 build');
    }

    if(creep.memory.building) {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    else {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }*/
}


module.exports = {run};