const mongoose = require('mongoose');
//const fs = require('fs');
const path = require('path');
//const ObjectID = require('mongodb').ObjectID;
//const fakedata = require('./fake');

const pth = path.resolve('./server/data/dbs/');

const DBWrapper = class {
	constructor(col_name) { //,db) {
		//тут определяем подключения к базе\коллекции и т.п.
		const db = mongoose.connection.db
		this.parent = db;
		this.collectionName = col_name;
		this.collection = db.collection(col_name);

		let col_path = path.join(pth,col_name);

		//загружаем представления-списки
		try{
			const module  = require(col_path);
			this.Views = module.Views;
			this.Scheme = module.Scheme;
			this.Model = module.Model;

			//this.views = this.module.views;
		}catch(err){
			console.log('Error load program module for '+col_name+'. Sets default value.')
			this.module = {}
			this.module.views = {
				 ALL: {
					query:{},
					options:{},
					sort:{}
				}
			}
		}

		console.log('Connect to data-collection: '+db.databaseName+"::"+col_name)
	}

	async getView(name, param) {
		//отдает массив JSON'ов
		//console.log('getView');
		let skip  =0;
		let limit =0;
		if(param){
			if(param.skip)  skip  = parseInt(param.start, 10);
			if(param.limit) limit = parseInt(param.count, 10);
		}


		if(typeof name == "undefined" || name==='') name='ALL';
		let vw = this.Views[name.toUpperCase()];
		//console.log(vw)
		if(typeof vw == "undefined" ) {
			console.log('ERROR: View <'+name+'> for <'+this.collectionName+'> not found'); 
			return [];//если пытаемся взять хрен-вьюшку, то и получаем пустой массив
		}else{
			const col = this.collection;
			const f = col.find(vw.query, vw.options);
			const c = await f.count()
			const a = await f.sort(vw.sort).skip(skip).limit(limit).toArray();

			//console.log('count in '+name+': '+c);

			const res = {
				pos: skip,
				total_count: c,
				data: a
			}

			return  res
//			return  await col.find(vw.query, vw.options).sort(vw.sort).skip(skip).limit(limit).toArray();
		}
	}

	async getDoc(id) {
	   let ret = {};
	   if(this.Model){
			//console.log("getDoc... Model")
			ret = await this.Model.findById(id)
	   }else{
			//console.log("getDoc... Native")
	  		ret = await this.collection.findOne({_id: mongoose.Types.ObjectId(id)})
		}
	   //console.log(ret)
	   return ret
	}

	async queryDoc(query, options){
		let ret;
		try{
			if(this.Model){
				//console.log("getDoc... Model")
				ret = await this.Model.findOne(query,options)
		   }else{
				//console.log("getDoc... Native")
				  ret = await this.collection.findOne(query,options)
			}
		}catch(err){
			//console.log(err)
		}
		return ret;
	}

	async setDoc(id, body){
		//console.log("POSTed data: "+this.collectionName+"::"+id)
		//console.log(body);
		let ret = {}
		if(this.Model){
			//const doc = new this.Model(body)
			if(id) {
				await this.Model.findOneAndReplace({_id: id}, body)//doc.toObject());
				ret = await this.getDoc(id)
			}else{
				const doc = new this.Model(body)
				ret = await doc.save()
			}

			//console.log(doc.toObject())
		}else{
			if(body._id) {
				body._id = mongoose.Types.ObjectId(body._id);
				ret = (await this.collection.findOneAndUpdate({_id:body._id}, {$set: body})).value;
			}else{
				ret = (await this.collection.insertOne(body)).ops;
			}
		}

		return ret
	}

	async newDoc(){
		const doc = new this.Model({})
		//console.log(doc)
		return doc
	}

}

module.exports = DBWrapper;