const database = require('../../../data');
module.exports = async (ctx, next)=>{
    const db = ctx.query.db;
    const vw = ctx.query.view;
    const param = {
        skip:  ctx.query.skip,
        limit: ctx.query.limit
    }
    //console.log(param)
    const data =  await database.getDB(db).getView(vw, param);
//console.log(data)
    ctx.body = data
}