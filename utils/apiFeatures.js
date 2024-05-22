const express=require('express');
class APIFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString

    }
    filter(){
        // this.query=this.query.find(this.queryString)
        // return this;
        const queryObj={...this.queryString};
        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        this.query=this.query.find(JSON.parse(queryStr));
        return this;
    }
    paginate(){
        const page=this.queryString.page*1||1
        const limit=this.queryString.limit*1||10
        const skip=(page-1)*limit
        this.query= this.query.limit(limit).skip(skip);
        return this;
    }
}
module.exports=APIFeatures;