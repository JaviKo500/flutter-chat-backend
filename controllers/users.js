const { response } = require("express");

const User = require("../models/user");
const getUsers = async ( req, res = response) => {
    const page = Number(req.query.page) || 0;
    try {
        const users = await User
            .find({_id: { $ne: req.uid} })
            .sort('-online')
            .skip(page)
            .limit(20);
        return res.status(200).json({
            ok: true,
            msg: 'users',
            users,
            page
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Talk to the admin'
        });
    }
};

module.exports = {
    getUsers
};