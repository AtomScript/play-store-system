<h1 align="center">Play Store System</h1>

<p align="center">
  <a href="https://npm-stat.com/charts.html?package=play-store-system">
    <img src="https://img.shields.io/npm/dm/play-store-system.svg">
  </a>
  <a href="https://www.npmjs.com/package/play-store-system">
    <img src="https://badge.fury.io/js/play-store-system.svg">
  </a>
  <a href="https://snyk.io/test/github/AtomScript/play-store-system">
    <img src="https://snyk.io/test/github/AtomScript/play-store-system/badge.svg" style="max-width:100%;">
  </a>
</p>
<span align="center">this is a library that is able to notify updates of a specific apps, and get information from an app</span>


## Install
```bash
npm i play-store-system
```

## Get App Info
```javascript
const pss = require('play-store-system');

const app = new pss();

app.getInfo("com.mojang.minecraftpe").then(info =>{
  console.log(info)
});
```


## Update Notify

```javascript
const pss = require('play-store-system');

const app = new pss();

app.on('com.mojang.minecraftpe', {startMessage: true, repeat: true, ms: 100, displayErrors: false}, info => {
  console.log(`${info.version}`);
});
```
The `startMessage` property can alert when event initialize.

The `repeat` property can start the event automatically without the update actually being released.

The `ms` property defines a miliseconds for the time to check for updates.

The `displayErrors` property defines whether you want to display annoying errors


## Search System

```javascript
const pss = require('play-store-system');

const app = new pss();

app.search({
  term: "minecraft",
  num: 5
}).then((appIds) => {
  console.log(appIds);
});
```

The `term` is the name of the application to application

The `num` is the maximum number of applications found. The limit for applications found is 50.


## Check For More Apps Update
``` javascript
const pss = require('play-store-system');

const app = new pss();

const apps = ['com.mojang.minecraftpe', 'com.supercell.clashofclans'];

for(let appId of apps){
  app.on(appId, {}, (info) =>{
    console.log(`new update of ${info.appId}, version: ${info.version}`);
  });
}
```
