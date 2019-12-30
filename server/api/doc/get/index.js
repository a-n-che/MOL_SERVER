const database = require('../../../data');
module.exports = async (ctx, next)=>{
    const db = ctx.query.db;
    const id = ctx.query.id;
    let data = {}
    //console.log("Get doc "+id);
    if(db){
        if(id){
            data =  await database.getDB(db).getDoc(id); 
        }else{
            //?Make new
            data = await database.getDB(db).newDoc()

        }
    }
    //console.log(data)
    ctx.body = data
}