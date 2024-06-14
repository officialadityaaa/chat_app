
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const {Schema}=mongoose;
const userschema=new Schema({
    

    username:{
type:String,
required:true

    },
    message:{

        type:String,
        required:true
    },
    room:{

type:String,
require:true

    },
    __createdtime__: {
        type: Date,
        default: Date.now
    }

   

})


module.exports=mongoose.model("save",userschema);