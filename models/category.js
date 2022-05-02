const mongoose = require('mongoose');

const caterorySchema = mongoose.Schema({

    name: {
        type: String,
        require: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    }
 
    

    
})

caterorySchema.virtual('id').get( function() {
    return this._id.toHexString();
});

caterorySchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('Category', caterorySchema)