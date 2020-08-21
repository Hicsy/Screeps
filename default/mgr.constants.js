// Various constants to use throughout various scripts.
// Called from main.js so far...
// Centralises data-entry until I bother finding a better way.
// you can import these like this:
// var constants = require('mgr.constants');

module.exports = Object.freeze({
    //////     Limits     //////
    maxNum1: 1,
    maxNum2: 2,
    //////   Creep Bodies   //////
    bodies: {
        worker: [
            MOVE, MOVE, TOUGH, TOUGH,
            MOVE, WORK, MOVE, WORK, MOVE,
            MOVE, MOVE, CARRY, MOVE, MOVE,
            WORK, MOVE, MOVE, WORK, WORK,
            WORK, WORK, WORK, CARRY, MOVE
        ], // Max-cost: 1520, RCL: 5
        courier: [
            CARRY, MOVE, CARRY, MOVE, CARRY,
            MOVE, CARRY, MOVE, CARRY, MOVE
        ]
    },
    //////      Styles      //////
    stylePathBuild: {
        fill: 'transparent',
        stroke: '#dddddd',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .3
    },
    stylePathDeliver: {
        fill: 'transparent',
        stroke: '#00ffaa',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
    },
    stylePathHarvest: {
        fill: 'transparent',
        stroke: '#00ffaa',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
    },
    stylePathRepair: {
        fill: 'transparent',
        stroke: '#ffaa00',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .3
    },
    stylePathUpgrade: {
        fill: 'transparent',
        stroke: '#00aaff',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
    },
    //////     Messages     //////
    msgStatusBuild: '🚧 Build',
    msgStatusBuild: '🚛 Deliver',
    msgStatusHarvest: '🪓 Harvest',
    msgStatusIdle: '💤 Idle',
    msgStatusRecycle: '🔄 Recycle',
    msgStatusRepair: '🔧 Repair',
    msgStatusUpgrade: '🆙 Upgrade'
});