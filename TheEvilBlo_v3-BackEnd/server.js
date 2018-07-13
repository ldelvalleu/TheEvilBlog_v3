const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const uniqid = require('uniqid');

const port = 3000;
const localhost = 'localhost';


var server = http.createServer((request, response) => {
    // console.log(request);
    let parseUrl = url.parse(request.url, true);
    let path = parseUrl.pathname;
    path = path.replace(/^\/+|\/+$/g, '');
    let method = request.method;
    let query = parseUrl.query;
    let key = query.key;
    let headers = request.headers;
    let buffer = '';
    let data = [];

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
                    // postPost(request, response);
                    break;
                case 'PATCH':
                    // updatePost(request, response, key);
                    break;
                case 'DELETE':
                    // delelePost(request, response);
                    break;
                default:
                    // send404(request, response);
                    break;
            }
            break;
        default:
            send404(request, response);
            break;
    }


    request.on('data', (chunk) => {
        // console.log(chunk);
        // body.push(chunk);
    }).on('end', () => {
        // console.log('Transferencia de datos completa.');

        // body = Buffer.concat(body).toString();
        // body = JSON.parse(body);
        // console.log(body);
    });
});

server.listen(port, localhost, () => {
    console.log('Server is listening port: ' + port + '.');
});


// function addCrossHeaders(request, response) {

//     let origin = '*';

//     if (request.headers['origin']) {
//         origin = request.headers['origin'];
//     }

//     console.log(origin);

//     response.setHeader('Access-Control-Allow-Origin', origin);
//     response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, PATCH, POST, DELETE');
//     response.setHeader('Access-Control-Allow-Headers', 'access-control-allow-credentials');
//     response.setHeader('Access-Control-Allow-Headers', 'access-control-allow-origin');
// }

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

    let loadPostsPromise = loadPosts();

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
}

function respondToOptions(request, response) {
    addCrossHeaders(request, response);
    response.writeHead(200);
    response.end();
}

function postPost(request, response) {
    addCrossHeaders(request, response);
    let buffer = [];
    let post = null;

    request.on('data', (chunk) => {
        console.log(chunk);
        buffer.push(chunk);
    }).on('end', () => {

        buffer = Buffer.concat(buffer).toString();
        buffer = JSON.parse(buffer);

        loadPosts().then((posts) => {
            posts[uniqid()] = post;
            savePosts(posts).then(() => {
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

// function savePosts(posts) {
//     return new Promise((resolve, reject) => {
//         fs.writeFile(path.resolve)
//     });
// }


function updatePost(request, response) {

    addCrossHeaders(request, response);

    let buffer = [];
    let post = null;

    request.on('data', (chunk) => {
        buffer.push(chunk);
    });

    request.on('end', () => {

        buffer = Buffer.concat(buffer).toString();
        buffer = JSON.parse(buffer);

        loadPosts().then((posts) => {

            for (const key in posts) {
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

            })
        })
    });
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

// function send404(request, response) {
//     addCrossHeaders(request, response);
// }