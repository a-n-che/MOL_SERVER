const session = require('koa-session');
const passport = require('koa-passport');
const LocalStrategy  = require('passport-local').Strategy;
const route = require('koa-route');
const send = require('koa-send');
const helper = require('./helper');

module.exports = (app) => {
// trust proxy
app.proxy = true

// sessions
app.keys = ['your-session-secret-static+']//+process.hrtime()] // для каждого перезапуска свой ключ(соль...)
//console.log(app.keys)
app.use(session({}, app))

// authentication

app.use(passport.initialize())
app.use(passport.session())

//---
passport.serializeUser(function(user, done) {
  //console.log(user)
  done(null, user._id)
})
passport.deserializeUser(function(id, done) {
  try {
    let user = helper.fetchUser(id,'_id')
    done(null, user)
  } catch(err) {
    done(err)
  }
})
passport.use(new LocalStrategy(function(username, password, done) {
  helper.fetchUser(username,'login')
    .then(user => {
      //if (username === user.username && password === user.password) {
      if (user && username === user.login && password === user.password) { //!!!<<<=== ПАРОЛЬ В ОТКРЫТУЮ!
      //console.log('logon OK - '+username)
        done(null, user)
      } else {
        console.log('logon BAD - '+username)  
        done(null, false)
      }
    })
    .catch(err => done(err))
}))
//------

// POST /login
app.use(route.post('/login',  async (ctx, next) => {
  //console.log('>>'+ctx.isAuthenticated()+' '+JSON.stringify(ctx.request.body))
  await next(ctx, next)
  //console.log('<<'+ctx.isAuthenticated())
  ctx.redirect(ctx.request.body.location)
}))
app.use(route.post('/login', // async (ctx, next) => {await next(ctx, next)},
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  })))

app.use(route.get('/logout', function(ctx) {
  ctx.logout()
  ctx.redirect('/')
}))




  app.use(async (ctx, next) => {
        if (ctx.isAuthenticated()) {
          //console.log( ctx )
          return next()
        } else {
            //console.log('AUTH!')
            await send(ctx, '../ui/login.html', {root: "./"})
        }
      })

}
