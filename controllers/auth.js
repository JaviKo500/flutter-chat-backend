const bcrypt = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generateJWT } = require("../helpers/jwt");
const User = require("../models/user");


const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const existingEmail = await User.findOne({ email });
        if ( existingEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email is existing'
            });
        }

        const user = new User( req.body );

        // encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password ,salt );
        await user.save();

        // generate token
        const token = await generateJWT( user.id );
        return res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Talk to the admin'
        });
    }
};

const login = async ( req, res = response ) => {
    const { email, password } = req.body;
    
    try {
        const userBD = await User.findOne({ email });
        if ( !userBD ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email not found'
            });
        }
        const validPassword = bcrypt.compareSync( password, userBD.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }

        const token = await generateJWT( userBD.id);
        return res.json({
            ok: true,
            user: userBD,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Talk to the admin'
        });
    }
    
};

const renewToken = async ( req, res = response) => {
    const uid = req.uid;
    
    try {
        const userBD = await User.findById({ _id: uid });
        if ( !userBD ) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found' 
            });
        }
        const token = await generateJWT( uid );
        return res.json({
            ok: true,
            user: userBD,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Talk to the admin'
        });
    }
    
}

module.exports = {
    createUser,
    login,
    renewToken
};