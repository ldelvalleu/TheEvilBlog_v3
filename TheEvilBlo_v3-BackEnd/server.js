const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;
const localhost = 'localhost';


var server = http.createServer((request, response) => {
    // console.log(request);

    var parseUrl = url.parse(request.url, true);

    var path = parseUrl.pathname;
    path = path.replace(/^\/+|\/+$/g, '');
    var method = request.method;
    var query = parseUrl.query;
    var headers = request.headers;
    let buffer = '';
    let data = [];


    request.on('data', (chunk) => {
        // console.log(chunk);
        // body.push(chunk);
    }).on('end', () => {
        // console.log('Transferencia de datos completa.');

        // body = Buffer.concat(body).toString();
        // body = JSON.parse(body);
        // console.log(body);
    });

    addCrossHeaders(request, response);


    var loadPostsPromise = loadPosts();

    loadPostsPromise.then(resolve).catch(reject);

    function resolve(posts) {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.write(JSON.stringify(posts));
        response.end();
    }

    function reject() {
        response.writeHead(404);
        response.end();
    }
});

server.listen(port, localhost, () => {
    console.log('Server is listening port: ' + port + '.');
});


function addCrossHeaders(request, response) {

    let origin = '*';

    if (request.headers['origin']) {
        origin = request.headers['origin'];
    }

    console.log(origin);

    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, PATCH, POST, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'access-control-allow-credentials');
    response.setHeader('Access-Control-Allow-Headers', 'access-control-allow-origin');
}

function loadPosts() {
    return new Promise(loadPostsPromiseExecuter);
}

function loadPostsPromiseExecuter(resolve, reject) {
    fs.readFile(path.resolve(process.cwd(), './data/posts.json'), (err, data) => {
        if (err) {
            reject();
        } else {
            let postsData = JSON.parse(data);
            let posts = postsData['posts'];
            // console.log(posts);
            resolve(posts);
        }
    });
}