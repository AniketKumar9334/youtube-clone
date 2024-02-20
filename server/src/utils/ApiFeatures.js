export class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr 
        ? {
            title:{
                $regex: this.queryStr,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({...keyword})
        return this;
    }

    pagination(resultPerPage, page){
        const currentPage = Number(page)
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this;
    }
}