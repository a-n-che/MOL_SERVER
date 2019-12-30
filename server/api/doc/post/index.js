const database = require('../../../data');
module.exports = async (ctx, next)=>{
    const db = ctx.query.db;
    const id = ctx.query.id;
    const body =ctx.request.body;

    let ret  = await database.getDB(db).setDoc(id, body);
    //console.log(ret)

    ctx.body = body;
}