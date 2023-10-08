const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    voter: {
        type: String,
        required: true
    },
    proposal: {
        type: Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true
    },
    voteChoice: {
        type: Boolean,
        required: true
    },
    ethAmount: {   
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Vote', VoteSchema, 'daoVoting');
