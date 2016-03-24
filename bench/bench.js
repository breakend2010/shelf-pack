'use strict';

var Benchmark = require('benchmark');
var ShelfPack = require('../.');
var BinPack = require('bin-pack');

var N = 10000;
var dim = 10000;
var sizes = [12, 16, 20, 24];

function randSize() {
    return sizes[Math.floor(Math.random() * sizes.length)];
}

// generate data
var fixedBoth = [],
    randWidth = [],
    randHeight = [],
    randBoth = [],
    w, h;

for (var i = 0; i < N; i++) {
    w = randSize();
    h = randSize();
    fixedBoth.push({width: 12, height: 12});
    randWidth.push({width: w, height: 12});
    randHeight.push({width: 12, height: h});
    randBoth.push({width: w, height: h});
}


var suite = new Benchmark.Suite();

suite
    .add('ShelfPack allocate fixed bins', function(t) {
        var pack = new ShelfPack({ w: dim, h: dim });
        var ok = true;
        for (var j = 0; j < N; j++) {
            ok = pack.allocate(fixedBoth[j].width, fixedBoth[j].height);
            if (!ok) throw 'out of space';
        }
    })
    .add('ShelfPack allocate random width bins', function(t) {
        var pack = new ShelfPack({ w: dim, h: dim });
        var ok = true;
        for (var j = 0; j < N; j++) {
            ok = pack.allocate(randWidth[j].width, randWidth[j].height);
            if (!ok) throw 'out of space';
        }
    })
    .add('ShelfPack allocate random height bins', function(t) {
        var pack = new ShelfPack({ w: dim, h: dim });
        var ok = true;
        for (var j = 0; j < N; j++) {
            ok = pack.allocate(randHeight[j].width, randHeight[j].height);
            if (!ok) throw 'out of space';
        }
    })
    .add('ShelfPack allocate random height and width bins', function(t) {
        var pack = new ShelfPack({ w: dim, h: dim });
        var ok = true;
        for (var j = 0; j < N; j++) {
            ok = pack.allocate(randBoth[j].width, randBoth[j].height);
            if (!ok) throw 'out of space';
        }
    })
    .add('BinPack allocate fixed bins', function(t) {
        var pack = BinPack(fixedBoth);
    })
    .add('BinPack allocate random width bins', function(t) {
        var pack = BinPack(randWidth);
    })
    .add('BinPack allocate random height bins', function(t) {
        var pack = BinPack(randHeight);
    })
    .add('BinPack allocate random height and width bins', function(t) {
        var pack = BinPack(randBoth);
    })
    .on('cycle', function(event) {
        if (event.target.error) {
            console.log(event.target.name + ':  ERROR ' + event.target.error);
        } else {
            console.log(String(event.target));
        }
    })
    .run();
