<h1 align="center"> amitt </h1>
<p align="center">
  <b>amitt is a simple event emitter for browser and node.js </b>
</p>

## Description
amitt helps you build functional event emitter / pubsub

Documentations for types - https://webigorkiev.github.io/amitt/

## Installation

```bash
npm i amitt
```

```javascript
// using ES6 modules
import {amitt} from "amitt";
 
// using CommonJS modules
const {amitt} = require("amitt");
```

## Features

* Zero Dependencies
* Tiny ~800b
* Very simple small library
* Focus on usability and performance
* Testing coverage
* RegExp event filters for emit
* once execute handlers
* emit can return array of Promise for async use

## Usage

### Simple example

```typescript
import {amitt} from 'amitt';

const emitter = amitt();

emitter.on("fire", () => console.log("handler"));
emitter.emit("fire");

```

### async example

```typescript
const {amitt} = require('../dist/index.js');
const emitter = amitt();

(async() => {
    try {
        const handler1 = async() => await new Promise(resolve => setTimeout(resolve, 1000));
        const handler2 = async() => await new Promise(resolve => setTimeout(resolve, 1000));

        emitter.on("fire", handler1);
        emitter.on("fire-fight", handler2);

        await Promise.all([...emitter.emit(/^fi/)]);

        console.log("end");
    } catch(e) {
        console.log(e);
    }
})();
```