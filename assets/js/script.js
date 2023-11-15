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
    correctWords = 0;

    quoteChars.forEach((char, index) => {
        if (char.innerText == userInputChars[index]) {
            char.classList.add("correctWords");
            if (!correctIndexes.has(index)) {
                correctIndexes.add(index);
            }
        } else {
            if (char.classList.contains("correctWords")) {
                char.classList.remove("correctWords");
            }
            if (index < userInputChars.length && !char.classList.contains("incorrectWords")) {
                char.classList.add("incorrectWords");
                if (!incorrectIndexes.has(index)) {
                    incorrectWords++;
                    incorrectIndexes.add(index);
                }
            }
        }
    });

    correctWords = correctIndexes.size;

    document.getElementById("correctWords").innerText = correctWords;
    document.getElementById("incorrectWords").innerText = incorrectWords;

    // Returns true if all chars are entered correctly
   isTestCompleted = quoteChars.length === correctIndexes.size;
    if (isTestCompleted) {
        displayResult();
    }
});

/**
 * Start Test
 */
const startTest = () => {
    userInput.disabled = false;
    userInput.value = "";
    correctWords = 0;
    incorrectWords = 0;
    keystrokes = 0;
    correctIndexes.clear();
    incorrectIndexes.clear()
    timer = "";
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
    if(time == 0) {
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
    if(time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - incorrectWords) / userInput.value.length) * 100) + "%";
    document.getElementById("keystrokes").innerText = + keystrokes;
    document.getElementById("start-test").style.display = "block";
    isTestCompleted = false;
};

document.addEventListener("keydown", function(event) {
    let resultDisplayed = document.querySelector(".result").style.display === "block";

    if (event.key === "Enter" && (resultDisplayed || testCompleted)) {
        userInput.disabled = false;
        setTimeout(() => {
            startTest();
        }, 0);
    }
});