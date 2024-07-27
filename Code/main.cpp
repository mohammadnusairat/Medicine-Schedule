/*
This program takes in a medicine/vitamin name,
associated with an intake frequency per day &
intake frequency per week, then outputs a weekly
schedule for the user, creating an efficient
schedule to organize the user's medicine/vitamin
intake. This will ensure that the user does not
unnecessarily overlap medicine/vitamin intake.

@date: 7/27/2024
@author: Mohammad Nusairat, Jafar Kazi
@purpose: Headstarter AI Week 1 Hackathon 2024
*/
#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <fstream>
using namespace std;

/*
@description: helper function to verify user is entering a valid integer
@param: string input from user
@output: true if is a valid number, false otherwise.
*/
bool isNumber(const string& str) {
    if (str.empty()) return false;

    for (int i = 0; i < str.size(); ++i) {
        if (!isdigit(str[i])) return false;
    }

    return true;
}

/*
@description: take in user input.
@param: none
@output: map of string/int,int
*/
map<string, pair<int,int>> gatherUserInput() {
    // ask for number of medicine/vitamins being inputted, save as int
    int numItems = 0; string cinString = "";
    cout << "Enter number of items being inputted: ";
    cin >> cinString;
    while (!isNumber(cinString)) {
        cout << endl;
        cout << "ERROR: not a valid number." << endl;
        cout << "Enter number of items being inputted: ";
        cin >> cinString;
    }
    cout << endl;
    numItems = stoi(cinString);

    string itemName = "";
    int freqPerWeek, freqPerDay = 0;
    map<string, pair<int, int>> items;

    // input will be first a string (confirm is unique), second an int (1 < x < 8) freq per week, third an int (1 < x < 10^100) freq per day.
    for (int i = 0; i < numItems; i++) {
        // ask for string name
        cout << "Enter item name: ";
        cin >> itemName;
        cout << endl;

        // ask for freq per week
        cout << "Enter frequency per week: ";
        cin >> cinString;
        while (!isNumber(cinString)) {
            cout << endl;
            cout << "ERROR: not a valid number." << endl;
            cout << "Enter frequency per week: ";
            cin >> cinString;
        }
        cout << endl;
        freqPerWeek = stoi(cinString);

        // ask for freq per day
        cout << "Enter frequency per day: ";
        cin >> cinString;
        while (!isNumber(cinString)) {
            cout << endl;
            cout << "ERROR: not a valid number." << endl;
            cout << "Enter frequency per week: ";
            cin >> cinString;
        }
        cout << endl;
        freqPerDay = stoi(cinString);

        // initialize map. key is a unique string (name of the medicine/vitamin). value is an int pair (frequency per week, frequency per day)
        items[itemName] = make_pair(freqPerWeek, freqPerDay);
    }

    // return items map
    return items;
}

/*
@description: take in intialized map of items from the user,
and return a vector of strings for each day.
@param: map of string/int,int
@output: vector of 7 strings (one for each day)
*/
vector<string> outputUserSchedule(map<string, pair<int,int>> items) {
    vector<string> daysOfTheWeek = {"S", "M", "T", "W", "TH", "F", "Sat"};
    map<string, vector<pair<string, int>>> weeklySchedule;

    // initialize the weekly schedule
    for (const auto& item : items) {
        int frequencyPerWeek = item.second.first;
        int frequencyPerDay = item.second.second;
        int daysInserted = 0;

        // distribute the item evenly across the week
        for (const auto& day : daysOfTheWeek) {
            if (daysInserted < frequencyPerWeek) {
                weeklySchedule[day].push_back(make_pair(item.first, frequencyPerDay));
                daysInserted++;
            }
        }
    }

    // initialize and return final user schedule
    vector<string> userSchedule(7);
    int j = 0;
    for (const auto& day : daysOfTheWeek) {
        userSchedule[j] = day + ": ";
        for (const auto& pair : weeklySchedule[day]) {
            userSchedule[j] += pair.first + " x" + to_string(pair.second) + " ";
        }
        j++;
    }

    return userSchedule;
}

int main () {
    string command = "";
    do {
        /* user input & initializing data structure */
        map<string, pair<int, int>> userItems = gatherUserInput();

        /* output schedule */
        vector<string> schedule = outputUserSchedule(userItems);
        for (const auto& day : schedule) {
            cout << day << endl;
        }

        /* prompt user to either end program, restart, or save output as txt file. */
        string txtfile;
        cout << "Save schedule as a txt file ('yes' for yes, anything else for no.)? ";
        cin >> txtfile;
        cout << endl;
        if (txtfile == "yes") {
            cout << "Enter the filename (e.g., schedule.txt): ";
            string filename;
            cin >> filename;
            cout << endl;
            ofstream outFile(filename);
            if (outFile.is_open()) {
                for (const auto& day : schedule) {
                    outFile << day << endl;
                }
                outFile.close();
                cout << "Schedule saved to " << filename << endl;
            } else {
                cout << "Error opening file!" << endl;
            }
        }

        cout << "Enter 'end' to end the program, or anything else to generate another schedule: ";
        cin >> command;
        cout << endl;
    } while (command != "end");

    cout << "Thank you for using this application!" << endl;

    return 0;
}