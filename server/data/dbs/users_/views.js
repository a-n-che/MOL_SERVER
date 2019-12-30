module.exports = {
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