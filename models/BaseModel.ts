
export class BaseModel {
    static prepare(data:any){
        data.id = data._id.$oid;
        delete data._id;
        return data;
    }
}