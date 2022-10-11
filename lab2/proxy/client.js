const axios = require('axios');

async function get_data(url) {
    try {
        const res = await axios.get(url);
        return res.data;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { get_data };

