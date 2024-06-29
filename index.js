const Hapi = require('@hapi/hapi');
const _ = require('lodash');

const getrandomscratchproject = async () => {
    let found = false;
    let id = 0;
    while (!found) {
        const random = _.random(105, 1043030328);
        const response = await fetch(`https://api.scratch.mit.edu/projects/${random}`);
        const json = await response.json();
        if (json.code !== "NotFound") {
            found = true;
            id = random;
        }
    }
    return id;
}

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            return h.redirect(`https://scratch.mit.edu/projects/${await getrandomscratchproject()}`);
        }
    });

    server.route({
        method: 'GET',
        path: '/api/v1/random',
        handler: async (request, h) => {
            return await fetch(`https://api.scratch.mit.edu/projects/${await getrandomscratchproject()}`).then(data => data.json());
        }
    })

    await server.start();
    console.log(`server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
});

init();