const mongoose = require('mongoose');
const Schemas = mongoose.Schema;

//=======================================
// Определяем модель данных для коллекции
const Schema = new Schemas({
    "username" : String,
    "login" : {
        type: String,
        required: true,
        index: true,
        unique: true 
    },
    "password" : {
        type: String,
        required: true
    }//,
    //"test": {type:String, default: "TTTTT"}
})
// Создаем модель
const Model = mongoose.model('user', Schema);

//================================================
// Определяем списки-представления для отображения
const Views = {
    ALL: {
        query:{},
        options:{},
        sort:{username:1}
    },
    USERLIST:{
        query:{},
        options:{
            projection:{
                "_id": 1,
                "login": 1,
                "password": 1
         }

        },
        sort:{}       
    }
}

//============ EXPORT =========================

module.exports = {
    // Представления
    Views: Views,

    // Схемы
    Schema: Schema,

    // Модель
    Model: Model

}