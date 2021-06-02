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
})()

