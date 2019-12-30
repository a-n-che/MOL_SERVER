const request = require('request-promise-native');
const data = require('../data');

let users =[];

/*const reFetchUsers = async()=>{
  //console.log('reFetchUsers')
  users = await data.getUsersList()
}*/

const reFetchUser = async (name,value) =>{
  let ret=""
  if(appConfig.argv.admin){
    //console.log('ADMIN FIKE!')
    users=[ { _id: '777', login: 'admin', password: appConfig.argv.admin } ]
  } else {
    if(appConfig.auth.type=="mongodb"){
      //=== авторизация в монге
      let q ={}
      q[name]=value;
      ret = await data.getDB("USERS").queryDoc(
        q, { "_id": 1, "login": 1, "password": 1 })
     if(!ret) return;
      let f=true;
      users.forEach((item, idx, arr) =>{
        if(item.login===value){
        //console.log('Есть такой ')
          arr[idx]=ret; //замещаем старое новым....
          f=false;
        }
      })
      if(f){//если не найден, то добавим
        users.push(ret)
      }
      return ret
    }else if(appConfig.auth.type=="domino"){
      //=== авторризация в домино
      //console.log("auth domino")
      const options = {
        method: 'GET',
        uri: appConfig.domino.api+"view",
        qs: {
            db: appConfig.auth.db,
            name: name,
            key: value
            },
        json: true
      }
      //console.log(options)
      try{
        const res = await request(options);
        //console.log(res)
        if(res.length==0) return;
        const ret = res[0];
        let f=true;
        users.forEach((item, idx, arr) =>{
          if(item.login===value){
          //console.log('Есть такой ')
            arr[idx]=ret; //замещаем старое новым....
            f=false;
          }
        })
        if(f){//если не найден, то добавим
          users.push(ret)
        }
        return ret
    }catch(err){
        console.log("ERROR: Domino сервер не отвечает... \n["+err.name+" - "+err.message+"]")
        console.log(options)
        return {}
    }


    }

  }
}

const fetchUser = ( () => {
  //reFetchUsers();
  return async function(value,name) {
    //console.log(value+'>'+name)
    let ret//={};
    if(name==='login') {return await reFetchUser(name,value)}
    else {
      users.forEach((item)=>{
        if(item[name]==value) {
          ret = item
        }
      })
      if(!ret){
        //console.log('нет в массиве')
        ret = await reFetchUser(name,value)
      }
      return ret
    }
  }
})()



module.exports.fetchUser = fetchUser
//module.exports.reFetchUsers = reFetchUsers //для перезагрузки списка пользователей