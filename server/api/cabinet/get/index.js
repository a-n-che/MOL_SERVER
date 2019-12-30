const setWith = require('lodash.setwith');
const database = require('../../../data');

module.exports = async (ctx, next)=>{
// получаем и парсим данные для кабинета ДОУ 
    let data = {}
    const u = await ctx.state.user // Поучаем объект авторизированного пользователя
    if(u){
        const param = {
            key: u._id
        }
        // Из вьщки по ключу ID пользователя, получаем запись о докте кабинета
        let dt =  await database.getDB('dbcarea').getView('AreaByID', param); 
        if(dt.data){
            const unid = dt.data[0]['@unid'] // получаем UNID документа кабинета
            dt =  await database.getDB('dbcarea').getDoc(unid); //получаем документ кабинета

            // Парсим полученные данные преобразуем поля с тэгами в JSON
            for (let key in dt) {
                //console.log('%s: %s', key, typeof dt[key])
                if((typeof dt[key])==='string'){ // берем только стринговые поля (по соглашению)
                    if(dt[key].substr(0,1)==='<' && dt[key].substr(-1,1)==='>'){
                        // Если в поле <...> то это теговое поле
                            const arr =dt[key].split('|') // разбиваем на массив по |
                            let aro
                            if(arr.length>1){
                                aro = arr.map(parseTag)
                            }else{
                                aro = parseTag(arr[0])
                            }
                            data[key]=aro
                    }else{
                        //для остальных передаем как есть
                        data[key]=dt[key]
                    }
                }
            }
        }
    }
    // Отдаем объект на клиент
    ctx.body = data
}

function parseTag(elt){
    const src = elt.substr(1, elt.length-2)// Обрезаем начальный и конечный <>
    const prm = src.split('><')// Рабиваем на массив по ><
    const o = {}
    prm.forEach(element => { // преобразуем теги в поля объекта
        const p=element.split(':')
        setWith(o, p[0],p[1])
    });
    return o
}