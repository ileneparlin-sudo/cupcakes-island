const assert=require('node:assert/strict');
const {create}=require('../adventure-model.js');
let day='2026-11-01';
function seed(){return {stars:321,lastDay:day,completed:[],owned:['rainbow','lamp'],support:{day,done:{},hard:false,reading:2,keys:7,dream:4,homework:[]}};}
{
 const data=seed();data.support.done={'morning:1':true,'learning:0':true};data.completed=['school'];
 const model=create(data,()=>day);
 assert.equal(data.stars,321);assert(model.done('morning',1));assert(model.done('evening',3));assert(model.done('learning',2));
 assert.equal(model.complete('learning',0),false);assert.equal(model.complete('evening',3),false);assert.equal(data.stars,321);
 assert.equal(model.complete('morning',0),true);assert.equal(data.stars,326);assert.equal(model.complete('morning',0),false);
 assert.equal(model.complete('bad',0),false);assert.equal(model.complete('morning',99),false);assert.equal(data.stars,326);
 assert.deepEqual(data.owned,['rainbow','lamp']);
}
{
 const data=seed(),model=create(data,()=>day);
 assert(model.complete('evening',3));assert(!model.complete('learning',0));assert.equal(data.stars,326);assert.equal(data.support.reading,3);assert.equal(data.support.keys,8);
 const reload=create(JSON.parse(JSON.stringify(data)),()=>day);assert(!reload.complete('learning',0));
 assert(model.postpone('morning',0));assert.notEqual(model.next(8).id,'dress');assert.equal(data.stars,326);
 assert(model.postpone('morning',0));assert.equal(model.next(8).id,'dress');
 data.support.hard=true;assert(model.visible('morning').every(s=>s.essential));assert.equal(model.done('evening',3),true);
 day='2026-11-02';model.ensureDay();assert(!model.done('learning',0));assert(model.complete('learning',0));assert.equal(data.stars,331);assert.equal(data.support.reading,4);
}
{
 const data=seed();data.completed=['morning','bedtime'];data.support.homework=[{name:'Old assignment',done:true}];
 const model=create(data,()=>day);assert.equal(data.stars,321);assert(model.done('morning',4));assert(model.done('evening',5));assert(model.done('learning',2));
 day='2026-11-03';model.ensureDay();assert(!model.done('learning',2),'historical completed homework must not claim every future day');assert.equal(data.stars,321);
}
{
 const data=seed();data.support.adventures={version:99};assert.throws(()=>create(data,()=>day),/newer/);assert.equal(data.stars,321);
}
console.log('PASS: migration, daily reward idempotency, shared reading, stable legacy mapping, Gentle Day, postponement, midnight rollover, forward-version guard');
