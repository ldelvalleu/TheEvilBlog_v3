class Post {
    constructor(key, pTitle, pBody, pOwner, pTimeStamp, pEditable) {
        this.key = key;
        this.title = pTitle;
        this.body = pBody;
        this.owner = pOwner;
        this.editable = pEditable;

        if (pTimeStamp === null) {
            this.timestamp = new Date();
        } else {
            this.timestamp = new Date(pTimeStamp);
        }
    }
}