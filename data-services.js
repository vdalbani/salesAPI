const mongoose = require('mongoose');

mongoose.Promise = global.Promise; 

// Loading schema
const salesSchema= require("./models/salesSchema.js");

//MongoDB conection export
module.exports = function(mongoDBConnectionString){

    let Sale; //instance

    return {

        initialize: function(){
            return new Promise(function(resolve,reject){
                let db = mongoose.createConnection(mongoDBConnectionString, {  useNewUrlParser: true,useUnifiedTopology: true });
                
                db.on('error', (err)=>{
                    reject(err);
                });
        
                db.once('open', ()=>{
                    Sale = db.model("Sale", salesSchema);
                    resolve();
                });
            });
        },

        addNewSale: function(data){
            return new Promise((resolve,reject)=>{

                let newSale = new Sale(data);

                newSale.save((err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(`new sale: ${newSale._id} successfully added`);
                    }
                });
            });
        },

        getAllSales: function(){
            return new Promise((resolve,reject)=>{
                
                Sale.find()
                .populate("Sale") 
                .exec()
                .then((sales)=>{
                    resolve(sales);
                })
                .catch((err)=>{
                    reject(err);
                });
            })

        },

        getSalesById: function(id){
            return new Promise((resolve,reject)=>{
                Sale.find({_id: id})
                .populate("Sale")
                .limit(1)
                .exec()
                .then((sales)=>{
                    resolve(sales);
                })
                .catch((err)=>{
                    reject(err);
                });

            })
        },
        
        updateSaleById: function(id, data){
            return new Promise((resolve,reject)=>{
                Sale.updateOne({_id: id}, 
                {
                    $set: data
                }).exec()
                .then(()=>{
                    resolve(`sale ${id} successfully updated`)
                }).catch(err=>{
                    console.log(err);
                    reject(err);
                });

            });
        },

        deleteSaleById: function(id){
            return new Promise((resolve,reject)=>{
                Sale.deleteOne({_id: id})
                .exec()
                .then(()=>{
                    resolve(`sale ${id} successfully deleted`)
                }).catch(err=>{
                    reject(err);
                });
            });
        }

        //Finish        
    }
}