const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const uniqid = require('uniqid');

const port = 3000;
const localhost = 'localhost';


var server = http.createServer((request, response) => {
    let parseUrl = url.parse(request.url, true);
    let path = parseUrl.pathname;
    path = path.replace(/^\/+|\/+$/g, '');
    let method = request.method;
    let query = parseUrl.query;
    let key = query.query;
    let headers = request.headers;
    let buffer = '';
    let data = [];
    // console.log(query.query);

    console.log(path);
    console.log(method);

    switch (path) {
        case 'posts':
            switch (method) {
                case 'OPTIONS':
                    respondToOptions(request, response);
                    break;
                case 'GET':
                    getPosts(request, response);
                    break;
                case 'POST':
                    postPost(request, response);
                    break;
                case 'PATCH':
                    updatePost(request, response);
                    break;
                case 'DELETE':
                    deletePost(request, response, key);
                    break;
                default:
                    console.log('Request not processed 1.');
                    send404(request, response);
                    break;
            }
            break;
        default:
            console.log('Request not processed 2.');
            send404(request, response);
            break;
    }
});

server.listen(port, localhost, () => {
    console.log('Server is listening port: ' + port + '.');
});

function loadPosts() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(process.cwd(), './data/posts.json'), (err, data) => {
            if (err) {
                reject(null);
            } else {
                posts = JSON.parse(data);
                resolve(posts);
            }
        });
    });
}

function savePosts(posts) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(process.cwd(), './data/posts.json'), JSON.stringify(posts), (err) => {
            if (err) {
                reject();
            } else {
                resolve();
            }
        });
    });
}

function addCrossHeaders(request, response) {
    let origin = '*';

    if (request.headers['origin']) {
        origin = request.headers['origin'];
    }

    if (request.headers['content-type']) {
        response.setHeader('Content-Type', request.headers['content-type']);
    }
    response.setHeader('Access-Control-Allow-Origin', request.headers['origin']);
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, PATCH, POST, DELETE');

    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Content-Type');
}

function getPosts(request, response) {

    addCrossHeaders(request, response);

    loadPosts().then((posts) => {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });

        response.write(JSON.stringify(posts));
        response.end();

    }).catch(() => {
        send404(request, response);
    });
}

function postPost(request, response) {

    addCrossHeaders(request, response);

    let buffer = [];
    let post = null;

    request.on('data', (chunk) => {
        console.log(chunk);
        buffer.push(chunk);
    });

    request.on('end', () => {

        buffer = Buffer.concat(buffer).toString();
        post = JSON.parse(buffer);

        loadPosts().then((posts) => {
            posts[uniqid()] = post;
            savePosts(posts).then(() => {
                console.log(posts);

                response.writeHead(200);
                response.end();
            }).catch(() => {
                send404(request, response);
            });
        }).catch(() => {
            send404(request, response);
        });
        console.log(buffer);
    });
}

function updatePost(request, response) {

    addCrossHeaders(request, response);

    let buffer = [];
    let post = null;

    request.on('data', (chunk) => {
        buffer.push(chunk);
    });

    request.on('end', () => {

        buffer = Buffer.concat(buffer).toString();
        post = JSON.parse(buffer);

        loadPosts().then((posts) => {

            for (const key in posts) {
                console.log(key);
                console.log(posts);


                for (const keyToUpdate in post) {
                    if (key == keyToUpdate) {
                        posts[key] = post[key];
                    }
                }
            }

            savePosts(posts).then(() => {
                response.writeHead(200);
                response.end();
            }).catch(() => {
                send404(request, response);
            })
        }).catch(() => {
            send404(request, response);
        });
    });
}

function deletePost(request, response, key) {

    addCrossHeaders(request, response);

    loadPosts().then((posts) => {

        delete posts[key];

        savePosts(posts).then(() => {
            response.writeHead(200);
            response.end();
        }).catch(() => {
            send404(request, response);
        });
    }).catch(() => {
        send404(request, response);
    });
}

function send404(request, response) {

    addCrossHeaders(request, response);

    response.writeHead(404, {
        'Content-Type': 'applicacion/json'
    });
    response.end();
}

function respondToOptions(request, response) {

    addCrossHeaders(request, response);

    response.writeHead(200);
    response.end();
}