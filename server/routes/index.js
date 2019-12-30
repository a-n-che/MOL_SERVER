const fs = require('fs');
const path = require('path');
const route = require('koa-route');

module.exports = (app, prfx, root) => {
    const pth = path.resolve(root);
    console.log('Set API {'+prfx+'} from '+pth);
    const files = fs.readdirSync(pth)
    files.forEach( function (file){
        let stat = fs.statSync(path.join(pth,file));
        if(stat.isDirectory()){
            let subp = path.join(path.resolve(pth), file);
            //console.log( 'function: '+file+"; "+subp );
            if (fs.existsSync(path.join(subp, 'index.js'))) {
                // в каталоге функции есть определение - значит оно для ALL
                //console.log('  action(def): ALL /'+prfx+"/"+file+'; requrie path: '+subp);
                let f = require(subp);
                app.use(route.all('/'+prfx+"/"+file, f ));
            }else{
                // разбираем подкаталоги с разбивкой по действиям
                let subf = fs.readdirSync(subp);
                subf.forEach( (action)=>{
                   let rpth = path.join(subp,action);
                   let subs = fs.statSync(rpth);
                    if(subs.isDirectory()){
                       //console.log('  action: '+action+' /'+prfx+"/"+file+'; requrie path: '+rpth);
                        let f = require(rpth);
                        //console.log(typeof f);
                        app.use(route[action]('/'+prfx+"/"+file, f ));
                    }
                    })
            }
        }
    });
    app.use(route.all('/'+prfx+"/*", async (ctx, next)=>{
        ctx.body = { //Для API, если функции не найдено, то возвращаем JSON с ошибкой
        "err": "function not found"
        };
    }));
}