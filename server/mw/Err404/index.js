const send = require('koa-send');

Err404 = async (ctx, next) =>{
    try {
        await next()
      } catch (err) {
        throw err
      }
      if(parseInt(ctx.status) === 404){
        ctx.status = 404
        await send(ctx, 'ui/404.html', {root: "./"})
     }
}

module.exports = Err404