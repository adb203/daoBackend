const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProposalSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    voteCountYes: {
        type: Number,
        default: 0
    },
    voteCountNo: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Proposal', ProposalSchema);
