let userFirstName = '';
let userLastName = '';
let userSchedule = [];
let savedAsTxt = false;

function submitName() {
    userFirstName = document.getElementById('firstName').value;
    userLastName = document.getElementById('lastName').value;

    if (userFirstName && userLastName) {
        document.getElementById('nameForm').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    } else {
        alert('Please enter both your first and last name.');
    }
}

function gatherUserInput() {
    const numItems = document.getElementById('numItems').value;
    const inputFieldsDiv = document.getElementById('inputFields');
    inputFieldsDiv.innerHTML = '';

    for (let i = 0; i < numItems; i++) {
        inputFieldsDiv.innerHTML += `
            <div>
                <label for="itemName${i}">Enter item name: </label>
                <input type="text" id="itemName${i}">
                <label for="freqPerWeek${i}">Enter frequency per week: </label>
                <input type="number" id="freqPerWeek${i}" min="1" max="7">
                <label for="freqPerDay${i}">Enter frequency per day: </label>
                <input type="number" id="freqPerDay${i}" min="1">
            </div>
            <br>
        `;
    }

    inputFieldsDiv.innerHTML += '<button onclick="generateSchedule()">Generate Schedule</button>';
}

function generateSchedule() {
    const numItems = document.getElementById('numItems').value;
    const items = {};

    for (let i = 0; i < numItems; i++) {
        const itemName = document.getElementById(`itemName${i}`).value;
        const freqPerWeek = parseInt(document.getElementById(`freqPerWeek${i}`).value);
        const freqPerDay = parseInt(document.getElementById(`freqPerDay${i}`).value);

        items[itemName] = [freqPerWeek, freqPerDay];
    }

    userSchedule = outputUserSchedule(items);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<h2>Weekly Schedule</h2>';
    userSchedule.forEach(day => {
        outputDiv.innerHTML += `<p>${day}</p>`;
    });

    outputDiv.innerHTML += '<button onclick="saveSchedule()">Save Schedule as txt file</button>';
    outputDiv.innerHTML += '<button onclick="finishWithoutSaving()">Finish</button>';

    saveUserAndSchedule(userFirstName, userLastName, userSchedule, false);
}

function outputUserSchedule(items) {
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weeklySchedule = {};

    // Initialize weeklySchedule with empty arrays
    daysOfTheWeek.forEach(day => {
        weeklySchedule[day] = [];
    });

    for (const item in items) {
        const [frequencyPerWeek, frequencyPerDay] = items[item];
        let daysInserted = 0;

        // First pass: fill empty days
        daysOfTheWeek.forEach(day => {
            if (daysInserted < frequencyPerWeek && weeklySchedule[day].length === 0) {
                weeklySchedule[day].push([item, frequencyPerDay]);
                daysInserted++;
            }
        });

        // Second pass: fill remaining days if necessary
        daysOfTheWeek.forEach(day => {
            if (daysInserted < frequencyPerWeek) {
                weeklySchedule[day].push([item, frequencyPerDay]);
                daysInserted++;
            }
        });
    }

    const userSchedule = daysOfTheWeek.map(day => {
        let schedule = `${day}: `;
        if (weeklySchedule[day].length > 0) {
            weeklySchedule[day].forEach(pair => {
                schedule += `${pair[0]} x${pair[1]} `;
            });
        } else {
            schedule += 'No medication';
        }
        return schedule;
    });

    return userSchedule;
}

function saveSchedule() {
    savedAsTxt = true;
    const text = document.getElementById('output').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'schedule.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    updateUserAndSchedule(userFirstName, userLastName, userSchedule, savedAsTxt);
}

function finishWithoutSaving() {
    savedAsTxt = false;
    alert("Schedule generated and saved without saving as a text file.");
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('nameForm').style.display = 'block';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
}

function saveUserAndSchedule(firstName, lastName, schedule, savedAsTxt) {
    fetch('/save-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, schedule, savedAsTxt }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

function updateUserAndSchedule(firstName, lastName, schedule, savedAsTxt) {
    fetch('/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, schedule, savedAsTxt }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}
