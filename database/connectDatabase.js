
const mongoose = require('mongoose');
const config = require('../config/config');

async function connectDatabase() {

    const result = await mongoose.connect(config.database_url);
    return result;
}

module.exports = connectDatabase;