const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const Proposal = require('./models/Proposal'); 
const Vote = require('./models/Vote');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/daoVotingDb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware before your routes

// Routes
app.get('/api/proposals', async (req, res) => {
    try {
        const proposals = await Proposal.find();
        res.json(proposals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/votes/:proposalId', async (req, res) => {
    try {
        const votes = await Vote.find({ proposal: req.params.proposalId });
        if (votes.length === 0) {
            return res.status(404).json({ message: "Votes not found" });
        }
        res.json(votes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/proposals', async (req, res) => {
    try {
        const { description, createdBy } = req.body;

        let proposal = new Proposal({
            description,
            createdBy,
            createdAt: new Date()
        });

        await proposal.save();
        res.json(proposal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.put('/api/proposals/:proposalId/deactivate', async (req, res) => {
    try {
        let proposal = await Proposal.findById(req.params.proposalId);
        
        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        proposal.active = false;
        await proposal.save();

        res.json(proposal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/api/proposals/:proposalId/vote', async (req, res) => {
    try {
        let proposal = await Proposal.findById(req.body.proposalId);
        
        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        let ethAmount = parseFloat(req.body.ethAmount);

        if (ethAmount <= 0) {
            return res.status(400).json({ message: "Invalid Vote amount. It should be greater than 0." });
        }
        
        let vote = new Vote({
            voter: req.body.voter,
            proposal: proposal._id,
            voteChoice: req.body.voteChoice,
            ethAmount: ethAmount
        });

        await vote.save();

        if (req.body.voteChoice) {
            proposal.voteCountYes ++;
        } else {
            proposal.voteCountNo ++;
        }
        
        await proposal.save();

        res.json(vote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

