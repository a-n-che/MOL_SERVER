//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')
//const config = require('../../config.json');
//const fakedata = require('./fake');
const DBWrapper = require('./wrapper');
const DominoWrapper = require('./wrapperDomino');
const dbList = {};

const data = {

    Init:  async () => {
        if(appConfig.mongodb){
            const url = appConfig.mongodb.url;
            const connectOptions = appConfig.mongodb.connectOptions;
            //const dbName = config.database.db;
            try{
            // Create a new MongoClient
            //const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
            //console.log("Connect to mongodb... ("+config.database.url+")")
            //await client.connect();
            //const db = await client.db(dbName)

                await mongoose.connect(url, connectOptions);
            
                console.log("Connected to mongodb!...")
            } catch(err) {
                console.log("Error connected to mongodb! \n["+err.name+" - "+err.message+"]")
                throw err
            }
                
            //========================================
            //Загрузка\подключение баз из MongoDB
            appConfig.mongodb.cols.forEach((item) =>{
                console.log('Load Domino wrapper for "%s"',item)
                NewDB(DBWrapper, item)
            })
            //NewDB(DBWrapper, 'users')
        }
        //Загрузка\подключение баз из DOMINO
        if(appConfig.domino){
            appConfig.domino.dbs.forEach((item) =>{
                console.log('Load Domino wrapper for "%s"',item)
                NewDB(DominoWrapper, item)
            })
            //NewDB(DominoWrapper, 'dbstructure')
            //NewDB(DominoWrapper, 'dbcarea')
        }
        //DominoWrapper.newDoc()
    },

    getDB: (db) => {
        // тут надо проверку на корректность базы
        //console.log( dbList)
        return dbList[db.toUpperCase()];
    }



}

const NewDB = (wrapper, name)=>{
    dbList[name.toUpperCase()]= new wrapper(name);
}

module.exports = data;