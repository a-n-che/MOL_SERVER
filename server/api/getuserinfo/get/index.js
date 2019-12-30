module.exports = async (ctx, next)=>{
    ctx.body = await ctx.state.user;
}