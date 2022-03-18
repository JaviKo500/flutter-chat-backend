const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_Cnn);
        console.log('db online');
    } catch (error) {
        console.log(error);
        throw new Error('Server error - Contact whit admin');
    }
};

module.exports = {
    dbConnection
};