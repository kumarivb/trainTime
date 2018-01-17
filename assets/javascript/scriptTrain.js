// make sure js doesn't run until html has finished loading
$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBxMxLOhB_0JQYoKY_ijshvE-3m-OC6Qt0",
    authDomain: "train-schedule-42396.firebaseapp.com",
    databaseURL: "https://train-schedule-42396.firebaseio.com",
    projectId: "train-schedule-42396",
    storageBucket: "train-schedule-42396.appspot.com",
    messagingSenderId: "1096924922067"
};

firebase.initializeApp(config);

// create variable for database
var database = firebase.database();

// button to add new wagon
$('#submit').on('click', function(event) {
    // prevent default behavior
    event.preventDefault();

    // variables for user inputs
    var wagonName = $('#validationName').val().trim();
    var destination = $('#validationDestination').val().trim();
    // x is for unix timestamp, HH is for military time (24hrs)
    var firstTime = moment($('#validationFirstTime').val().trim(), "hh:mm").format("X");
    var frequency = $('#validationFrequency').val().trim();

    // get current time
    var currentTime = moment();

    console.log(wagonName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);
    console.log(currentTime);

    // "temporary" object for all new wagon info
    var newWagon = {
        wagon: wagonName,
        wagonDest: destination,
        wagonArrival: firstTime,
        wagonFreq: frequency
    };

    // upload new wagon info to firebase
    database.ref().push(newWagon);

    // clear input fields
    $('#validationName').val("");
    $('#validationDestination').val("");
    $('#validationFirstTime').val("");
    $('#validationFrequency').val("");
});

// firebase event to add new wagon to database and a row in the html
database.ref().on('child_added', function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // store snapshots in variables (from temp object)
    var wagonName = childSnapshot.val().wagon;
    var destination = childSnapshot.val().wagonDest;
    var firstTime = childSnapshot.val().wagonArrival;
    var frequency = childSnapshot.val().wagonFreq;

    // wagon info
    console.log(wagonName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);

    // make time easier to read
    var wagonTime = moment.unix(firstTime).format("hh:mm");

    // difference between times
    var diff = moment().diff(moment(wagonTime), "minutes");

    // (%) Number remainder
    var remain = diff % frequency;

    // min until arrive
    var minAway = frequency - remain;

    // next arrival time
    var nextArrive = moment().add(minAway, "minutes").format("hh:mm");

    // display info in current wagon schedule table
    $('#wagonSchedule > tbody').append('<tr><td>' + wagonName + '</td><td>' + destination + '</td><td>' + frequency + '</td><td>' + nextArrive + '</td><td>' + nextArrive + '</td></tr>');

});

});