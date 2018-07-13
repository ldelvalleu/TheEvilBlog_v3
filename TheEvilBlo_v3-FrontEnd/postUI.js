class PostUI {
    constructor(post) {
        this.post = post;

        this.container = document.createElement('div');
        this.titleTxt = document.createElement('h2');
        this.bodyTxt = document.createElement('p');
        this.timeStampTxt = document.createElement('legend');
        this.bodyTxt.classList.add("pPosts");
        this.timeStampTxt.classList.add("pPosts");

        this.container.appendChild(this.titleTxt);
        this.container.appendChild(this.timeStampTxt);
        this.container.appendChild(this.bodyTxt);

        // element.classList.add("mystyle");
        if (this.post !== null) {
            this.titleTxt.innerText = this.post.title;
            this.bodyTxt.innerText = this.post.body;
            this.timeStampTxt.innerText = this.post.owner + " " + this.post.timestamp.getDate() + "-" + this.post.timestamp.getMonth() + "-" + this.post.timestamp.getFullYear();
        }
        this.container.post = this.post;
        this.container.classList.add("contPost");
    }
}