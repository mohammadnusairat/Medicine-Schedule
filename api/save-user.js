const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const { firstName, lastName, schedule, savedAsTxt } = req.body;
    const csvPath = path.join(__dirname, '..', 'users.csv');

    const newUser = `${firstName},${lastName},"${schedule.join(';')}",${savedAsTxt}\n`;

    fs.appendFile(csvPath, newUser, err => {
        if (err) {
            return res.status(500).send('Error saving user data');
        }
        res.status(200).send('User data saved');
    });
};
