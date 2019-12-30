const request = require('request-promise-native');
//const config = require('../../config.json');


const DominoWrapper = class {
    constructor(col_name) {
        this.collectionName = col_name;
        this.apiURL = appConfig.domino.api;
        //console.log(this)
    }

async getView(name, param) {
    //console.log(param)
    const options = {
        method: 'GET',
        uri: this.apiURL+"view",
        qs: {
            db: this.collectionName,
            name: name
        },
        json: true
    }
    if(param.skip) options.qs.start=param.skip
    if(param.limit) options.qs.count=param.limit
    if(param.key) options.qs.key = param.key

    try{
        const a = await request(options);
        const res = {
            pos: param.skip||0,
            total_count: a.length,
            data: a
        }
        return res
    }catch(err){
        console.log("ERROR: Domino сервер не отвечает... \n["+err.name+" - "+err.message+"]")
        console.log(options)
        return {}
    }

}

async getDoc(id) {
    const options = {
        method: 'GET',
        uri: this.apiURL+"doc",
        qs: {
            db: this.collectionName,
            id: id
        },
        json: true
    }
    try{
        const ret = await request(options);
        return ret
    }catch(err){
        console.log("ERROR: Domino сервер не отвечает... \n["+err.name+" - "+err.message+"]")
        console.log(options)
        return {}
    }

}

async queryDoc(query, options){}

async setDoc(id, body){}

async newDoc(){console.log('newDoc')}

}

module.exports = DominoWrapper;