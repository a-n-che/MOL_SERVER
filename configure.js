const minimist=require('minimist');
const argv = minimist(process.argv.slice(2), {
                        string: ['admin','app', 'config'],
                        boolean: true,
                        alias: {'port': 'p', 'mongodb':'mongo'},
                        default: {'app': 'ui_app', 'mongo':true},
                        unknown: (arg) => {
                            console.error('Unknown option: ', arg)
                            return false
                        }});

if(argv.help){ //выводим HELP
   console.log('Keys:\n'+
                '  admin - запуск с подставным админом,\n'+
                '  app - путь где лежат модули приложения,\n'+
                '  config - путь к файлу конфигурации,\n'+
                '  mongo - подключать mongodb или нет (для отключения --no-mongo),\n'+
                '  port - порт для http сервера')
    process.exit(0);
}


const confFile = argv.config || './config.json'        
let config;                
 try{           
    config = require(confFile);
 }catch(err){
    console.log("Error load config file!\n"+err.name+" - "+err.message)
    process.exit(0);
 }
const port = argv.port || config.application.port || 80;

if(!argv.mongo) config.mongodb = false;

config.application.port = port;
config.argv = argv
//console.log(config)

global.appConfig = config;

if(config.argv.admin) console.log("ВНИМАНИЕ! Приложение запущено в режиме администратора!")
module.exports = config