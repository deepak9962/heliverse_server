const express = require('express')
const User = require('../models/user')
const router = express.Router()

const baseUrl = 'https://api-heliverse.onrender.com/api/users?'

router.get('/users', async (req, res) => {
    let query = req.query
    let page = query.page === undefined
        ? new Number(1)
        : parseInt(req.query.page, 10);

    let filter = {}

    if (query.q !== undefined) {
        filter["first_name"] = {$regex: query.q}
    }

    if (query.domain !== undefined) {
        filter["domain"] = query.domain
    }

    if (query.gender !== undefined) {
        filter["gender"] = query.gender
    }

    if (query.available !== undefined) {
        filter["available"] = query.available
    }

    console.log(filter);

    const usersLength = await User.find(filter).count()
    const users = await User.find(filter)
        .skip(page >= 2 ? (page - 1) * 20 : 0)
        .limit(20)
        .exec();

    res.status(200).json({
        prev: page >= 2 ? baseUrl + 'page=' + (page - 1) : null,
        next: (usersLength / page) <= 20 ? null : baseUrl + 'page=' + (page + 1),
        userCount: usersLength,
        users
    })
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).exec()
        if (user === null) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            })
        }

        res.status(200).json(user)
    } catch (e) {
        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

router.post('/users', async (req, res) => {
    let reqUser = req.body
    console.log(reqUser);
    try {
        const user = new User({
            first_name: reqUser.first_name,
            last_name: reqUser.last_name,
            email: reqUser.email,
            gender: reqUser.gender,
            avatar: reqUser.avatar,
            domain: reqUser.domain,
            available: reqUser.available
        })

        await user.save()

        res.status(200).json({
            status: 201,
            message: 'Success, user added'
        })
    } catch (e) {
        if (e.message != null) {
            req.session.error = e.message
        }

        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

router.put('/users/:id', async (req, res) => {

    const reqUser = req.body
    try {
        const query = {
            _id: req.params.id
        }
        let userUpdates = {
            $set: {
                first_name: reqUser.first_name,
                last_name: reqUser.last_name,
                email: reqUser.email,
                gender: reqUser.gender,
                avatar: reqUser.avatar,
                domain: reqUser.domain,
                available: reqUser.available
            }
        }

        const updateStatus = await User.updateOne(query, userUpdates)
        console.log('updateStatus: ' + updateStatus)

        console.log('server put');
        res.status(202).json({
            status: 202,
            message: 'User updated, Successfully'
        })

    } catch (e) {
        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).exec()
        if (user === null) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            })
        }

        const deleteQuery = { _id: req.params.id }
        const deleted = await User.deleteOne(deleteQuery).exec()

        if (deleted.deletedCount === 0) {
            return res.status(403).json({
                status: 403,
                message: 'Could not delete, Not found'
            })
        }

        res.status(203).json({
            status: 203,
            message: 'User deleted, Successfully'
        })
    } catch (e) {
        res.status(406).json({
            status: 406,
            message: e.message
        })
    }
})

router.get('/ka', (req, res) => {
    res.sendStatus(200);
})

module.exports = router