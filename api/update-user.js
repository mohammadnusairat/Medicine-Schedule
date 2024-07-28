const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const { firstName, lastName, schedule, savedAsTxt } = req.body;
    const csvPath = path.join(__dirname, '..', 'users.csv');

    fs.readFile(csvPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading user data');
        }

        const lines = data.split('\n');
        const updatedLines = lines.filter(line => {
            const [fname, lname] = line.split(',');
            return !(fname === firstName && lname === lastName);
        });

        const updatedUser = `${firstName},${lastName},"${schedule.join(';')}",${savedAsTxt}\n`;
        updatedLines.push(updatedUser);

        fs.writeFile(csvPath, updatedLines.join('\n'), err => {
            if (err) {
                return res.status(500).send('Error updating user data');
            }
            res.status(200).send('User data updated');
        });
    });
};
