const route = require('koa-route');
const send = require('koa-send');

const dateFormat = require('dateformat')

module.exports = (app)=>{
    app.use(route.get( "/", async (ctx)=>{
        await send(ctx, './spa/ui/index.html', {root: "../"})
        const u = await ctx.state.user
        if(u){
            console.log(dateFormat(Date.now(), 'dd.mm.yyyy HH:MM:ss')+
            ' ['+(ctx.ip).replace('::ffff:', '')+']'+
            '      Open session user: '+u.login)
        }
    }))
}