const express = require('express')
const Team = require('../models/team')
const router = express.Router()

const baseUrl = 'http://localhost:8080/api/team'

router.get('/team', async (req, res) => {
    try {
        const teams = await Team.find({}).exec()
        
        if (teams.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No team found'
            })
        }

        res.status(200).json({teams : teams})
        
    } catch (e) {
        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

router.get('/team/:id', async (req, res) => {
    let teamId = req.params.id
    try {
        let query = {
            _id: teamId
        }
        const team = await Team.find(query).exec()
        
        if (team.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No team found'
            })
        }

        res.status(200).json({team})
        
    } catch (e) {
        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

router.post('/team', async (req, res) => {
    let teamData = req.body;
    try {
        const team = new Team({
            teamName: teamData.teamName,
            users: teamData.users
        })

        await team.save()

        res.status(200).json({
            status: 201,
            message: 'Team created, Successfully'
        })
    } catch (e) {
        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

module.exports = router