const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save-user', (req, res) => {
    const { firstName, lastName, schedule, savedAsTxt } = req.body;
    const filePath = path.join(__dirname, 'users.csv');

    const user = `${firstName},${lastName},"${schedule.join('; ')}",${savedAsTxt}\n`;

    fs.appendFile(filePath, user, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('User and schedule saved successfully');
    });
});

app.post('/update-user', (req, res) => {
    const { firstName, lastName, schedule, savedAsTxt } = req.body;
    const filePath = path.join(__dirname, 'users.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Internal Server Error');
        }

        const lines = data.split('\n');
        const updatedLines = lines.filter(line => {
            if (line.trim() === '') return false; // remove empty lines
            const [fname, lname] = line.split(',');
            return !(fname === firstName && lname === lastName);
        });

        const newEntry = `${firstName},${lastName},"${schedule.join('; ')}",${savedAsTxt}\n`;
        updatedLines.push(newEntry);

        fs.writeFile(filePath, updatedLines.join('\n'), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).send('Internal Server Error');
            }
            res.send('User and schedule updated successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
