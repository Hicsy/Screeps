const { result } = require("lodash");

// determine object types:
let target = Game.getObjectById('57a025bdcfa3ffae361105ba')
if (target instanceof StructureTower){
    // tower
}
if (target.structureType != null) {
    // "Type: STRUCTURE\n";
}
if (target instanceof Creep) {
    // creep
}

if (target instanceof Source) {
    // ? energy resource?
}

if (creep.memory.job != 'build'){"build job assigned"}


CONTROLLER_STRUCTURES = {
    "spawn": {0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3},
    "extension": {0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60},
    "link": {1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 3, 7: 4, 8: 6},
    "road": {0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
    "constructedWall": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
    "rampart": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
    "storage": {1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1},
    "tower": {1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6},
    "observer": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
    "powerSpawn": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
    "extractor": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
    "terminal": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
    "lab": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 3, 7: 6, 8: 10},
    "container": {0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5},
    "nuker": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
    "factory": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 1, 8: 1}
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

creep.memory = {
    manager: undefined, // who this unit is assigned to.
    role: myRole, // builder, harvester, upgrader, courier, truck.
    targetId: undefined, // target.id.
    targetType: undefined, // target.structureType.
    targetPos: undefined, // target.pos.
    job: undefined // 'build' , 'harvest' , 'repair' , 'spawning' , 'recycle' , 'deliver'.
}

spawn.memory = {
    "harvester": undefined // GameObject.id
}

function myTest(x,y) {
    console.time('adder');
    z = x+y;
    console.log("Added: "+z);
    console.timeEnd('adder');

    console.time('taker');
    z = x-y;
    console.log("Subtracted: "+z);
    console.timeEnd('taker');
}
