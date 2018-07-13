window.addEventListener('load', init, false);

function init(params) {


    var urlBase = 'http://localhost:3000';
    var btnPost = document.getElementById('btnPost');
    var btnUpdate = document.getElementById('btnUpdate');
    var btnDelete = document.getElementById('btnDelete');
    var btnCancel = document.getElementById('btnCancel');
    var txtTitle = document.getElementById('txtTitle');
    var txtBody = document.getElementById('txtBody');
    var owner = 'Luisk';
    var selectedPostUi = null;



    var posts = [];
    // initFb();
    requestAllPosts();

    btnPost.hidden = false;
    btnUpdate.hidden = true;
    btnDelete.hidden = true;
    btnCancel.hidden = true;

    btnPost.onclick = createPost;
    btnDelete.onclick = deletePost;
    btnUpdate.onclick = updatePost;

    //Start equest posts

    function requestAllPosts() {
        var request = new XMLHttpRequest();
        request.open('GET', urlBase + '/posts', true);
        request.setRequestHeader("Access-Control-Allow-Origin", '*');
        request.onreadystatechange = requestAllPostsCallBack;
        request.send();
    }

    function requestAllPostsCallBack(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status == 200) {
                posts = [];
                var postsData = JSON.parse(request.responseText);
                for (const key in postsData) {
                    var postData = postsData[key];
                    var editable = false;
                    if (postData.owner === owner) {
                        editable = true;
                    }
                    // var date = new Date(postData.timestamp);
                    var post = new Post(key, postData.title, postData.body, postData.owner, postData.timestamp, editable);
                    posts.push(post);
                }
                showPosts();
            } else {
                console.log('Error on request: ', request.status);
            }
        }
    }

    function showPosts() {
        var postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = "";
        posts.forEach(post => {
            var postUI = new PostUI(post);
            if (postUI.post.editable) {
                postUI.container.onclick = selectPost;
            }

            postsContainer.appendChild(postUI.container);
            console.log(post);
        });
    }

    //End request posts

    //Start create posts

    function createPost() {
        var post = new Post(null, txtTitle.value, txtBody.value, owner, null, true);

        posts.push(post);

        var request = new XMLHttpRequest();
        request.open('POST', urlBase, true);
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        request.onreadystatechange = sendPostCallBack;
        request.send(JSON.stringify(post));
        cleanUI();
    }

    function sendPostCallBack(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            } else {
                console.log('Error on request: ', request.status);
            }
        }
    }
    //End create posts

    //Start delete posts
    function deletePost(event) {
        if (confirm('¿Está seguro que desea eliminar el post?')) {
            var url = 'https://theevilmouseblog.firebaseio.com/posts/' + selectedPostUi.post.key + '.json';
            var request = new XMLHttpRequest();
            request.open('Delete', url, true);
            request.onreadystatechange = deletePostCallback;
            request.send();
            removeSelectedPostStyle();
            cleanUI();
        }
    }

    function deletePostCallback(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            } else {
                console.log('Error on request: ', request.status);
            }
        }
    }

    //End delete posts

    //Start update posts

    function updatePost(event) {
        var request = new XMLHttpRequest();
        request.open('PATCH', urlBase, true);
        request.onreadystatechange = updatePostCallback;
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

        var post = selectedPostUi.post;
        post.title = txtTitle.value;
        post.body = txtBody.value;
        post.timestamp = new Date();
        var key = post.key;
        post.key = null;
        var postJson = '{' + JSON.stringify(key) + ':' + JSON.stringify(post) + '}';

        console.log(postJson);
        request.send(postJson);

        removeSelectedPostStyle();
        cleanUI();

        //Otra manera de definir el .json de arriba
        // var post = '{' + JSON.stringify(selectedPostUi.post.fbKey) + ':{title:' + JSON.stringify(selectedPostUi.post.title) + ':{body:' + JSON.stringify(selectedPostUi.post.body) + ':{owner:' + JSON.stringify(selectedPostUi.post.owner) + ':{timestamp:' + JSON.stringify(selectedPostUi.post.timestamp) + '}}';

    }

    function updatePostCallback(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            } else {
                console.log('Error on request: ', request.status);
            }
        }
    }

    //End update posts

    //Start styles

    function selectPost(event) {
        // removeSelectedPostStyle();
        if (event.target.post) {
            selectedPostUi = event.target;
            txtTitle.value = selectedPostUi.post.title;
            txtBody.value = selectedPostUi.post.body;
            btnDelete.hidden = false;
            btnUpdate.hidden = false;
            btnCancel.hidden = false;
            btnPost.hidden = true;

            selectedPostUi.classList.add('selectedPost');
        }
    }

    function cleanUI() {
        txtTitle.value = '';
        txtBody.value = '';
    }

    function removeSelectedPostStyle(event) {
        selectedPostUi.classList.remove('selectedPost');
        btnDelete.hidden = true;
        btnUpdate.hidden = true;
        btnCancel.hidden = true;
        btnPost.hidden = false;
    }

    //End styles
}




// function requestAllPostsCallBack(event) {
//     var request = event.target;
//     switch (request.readyState) {
//         case XMLHttpRequest.DONE:
//             console.log('DONE');
//             switch (request.status) {
//                 case 200:
//                     posts = [];
//                     var postsData = JSON.parse(request.responseText);
//                     for (const key in postsData) {
//                         var postData = postsData[key];
//                         var editable = false;
//                         if (postData.owner === owner) {
//                             editable = true;
//                         }

//                         var post = new Post(key, postData.title, postData.body, postData.owner, new Date(postData.timestamp), postData.editable);
//                         posts.push(post);
//                     }
//                     break;

//                 case 400:

//                     break;
//                 case 401:

//                     break;

//                 default:
//                     break;
//             }
//             break;
//     }
// }