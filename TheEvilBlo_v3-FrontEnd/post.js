class Post {
    constructor(pFbkey, pTitle, pBody, pOwner, pTimeStamp, pEditable) {
        this.fbKey = pFbkey;
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