const mongoose = require('mongoose')
const initDB = require('./data.js')
const Listing = require('../model/listing.js')

main().then(()=>{
    console.log("connected succesfull")
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const initData = async ()=>{
     await Listing.deleteMany({});
     initDB.data = initDB.data.map((obj)=>({
        ...obj, owner:"679e80801f4f43c8b949f672"
     }))
     await Listing.insertMany(initDB.data);
     console.log("DB was initialised")
}

initData();

