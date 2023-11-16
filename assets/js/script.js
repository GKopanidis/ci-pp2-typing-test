/**
 * Generates random quotes 
 */
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const shownTextSection = document.getElementById("shownText");
const userInput = document.getElementById("shownTextInput");

let shownText = "";
let time = 60;
let timer = "";
let correctWords = 0;
let incorrectWords = 0;
let keystrokes = 0;
let lastCorrectIndex = -1;
let correctIndexes = new Set();
let incorrectIndexes = new Set();
let isTestCompleted = false;
let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];


/**
 * Display random quote
 */
const renderNewQuote = async () => {
    //Get a random quote from api
    const response = await fetch(quoteApiUrl);
    //Store response
    let data = await response.json();
    //Access quote
    quote = data.content;
    //Array of characters in the quote
    let arr = quote.split("").map((value) => {
        //wrap the characters in a span tag
        return "<span class='quote-chars'>" + value + "</span>";
    });
    //Join array for displaying
    shownTextSection.innerHTML += arr.join("");
};

/**
 * Event Listener, comparing input words with quote
 */
userInput.addEventListener("input", () => {
    keystrokes++;
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);
    let userInputChars = userInput.value.split("");

    quoteChars.forEach((char, index) => {
        if (char.innerText == userInputChars[index]) {
            char.classList.add("correctWords");
            if (!correctIndexes.has(index)) {
                correctIndexes.add(index);
            }
        } else {
            if (char.classList.contains("correctWords")) {
                char.classList.remove("correctWords");
                correctIndexes.delete(index);
            }
            if (index < userInputChars.length) {
                char.classList.add("incorrectWords");
                incorrectIndexes.add(index);
            }
        }
    });

    correctWords = correctIndexes.size;
    incorrectWords = incorrectIndexes.size;

    document.getElementById("correctWords").innerText = correctWords;
    document.getElementById("incorrectWords").innerText = incorrectWords;

    isTestCompleted = (quoteChars.length === correctIndexes.size) && (userInput.value.length === quoteChars.length);

    if (isTestCompleted) {
        displayResult();
    }
});

/**
 * Start Test
 */
const startTest = () => {
    if (timer) {
        clearInterval(timer);
    }
    userInput.disabled = false;
    userInput.value = "";
    correctWords = 0;
    incorrectWords = 0;
    keystrokes = 0;
    correctIndexes.clear();
    incorrectIndexes.clear()
    timer = "";
    document.getElementById("correctWords").innerText = correctWords;
    document.getElementById("incorrectWords").innerText = incorrectWords;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    shownTextSection.innerHTML = "";
    renderNewQuote();
    setTimeout(() => {
        userInput.focus();
    }, 0);
};

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
};

/**
 * Set timer
 */
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

/**
 * Update timer
 */
function updateTimer() {
    if (time == 0) {
        //End test if timer reaches 0
        displayResult();
    }
    else {
        document.getElementById("timer").innerText = --time + "s";
    }
};

/**
 * End Test
 */
const displayResult = () => {
    //display result div
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("cpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(0) + " cpm";

    let accuracy = Math.round(((userInput.value.length - incorrectWords) / userInput.value.length) * 100);
    document.getElementById("accuracy").innerText = accuracy + "%";
    // Check, if accuracy is 100%
    if (accuracy === 100) {
        // Show text, if accuracy is 100%
        document.getElementById("godlike").style.display = "block";
        document.getElementById("godlike").innerText = "GODLIKE :D";
    } else {
        // Hide text, if accuracy isnt 100%
        document.getElementById("godlike").style.display = "none";
    }

    document.getElementById("keystrokes").innerText = + keystrokes;
    document.getElementById("start-test").style.display = "block";
    isTestCompleted = false;
};

document.addEventListener("keydown", function (event) {
    let resultDisplayed = document.querySelector(".result").style.display === "block";
    if (event.key === "Enter") {
        if (isTestCompleted && !resultDisplayed && userInput.value.length > 0) {
            displayResult();
        } else if (resultDisplayed) {
            startTest();
        }
    }
});

/**
 * Modal box
 */
// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}