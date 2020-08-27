/**
 * Handle core functions of towers each tick.
 * @todo Fix order of operation per tick... consider prioritisation.
 * @param {Structure} tower TODO: Change this to take string of structureName instead...
 */
function run (tower) {
    // attack
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower.attack(closestHostile);
    }
    // repair
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    }
}


module.exports = {run};