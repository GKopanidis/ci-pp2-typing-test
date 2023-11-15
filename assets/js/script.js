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
 * Comparing input words with quote
 */
userInput.addEventListener("input", () => {
    keystrokes++;
})
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    //Create an array from received span tags
    quoteChars = Array.from(quoteChars);
    //Create an array from input chars
    let userInputChars = userInput.value.split("");
    //loop through each char in quote
    quoteChars.forEach((char, index) => {
        //Check char(quote char) = userInputChars[index](input char)
        if (char.innerText == userInputChars[index]) {
            char.classList.add("correctWords");
        }
        //If user hasn't entered anything or backspaced
        else if(userInputChars[index] == null) {
            //Remove class if any
            if(char.classList.contains("correctWords")) {
                char.classList.remove("correctWords");
            }
            else {
                char.classList.remove("incorrectWords");
            }
        }
        //If user enter wrong char
        else{
            //Checks if allready have added fail class
            if(!char.classList.contains("incorrectWords")) {
                //increment and diplay incorrect
                incorrectWords += 1;
                char.classList.add("incorrectWords");
            }
            document.getElementById("incorrectWords").innerText = incorrectWords;
        }
        // Returns true if all chars are entered correctly
        let check = quoteChars.every(element=> {
            return element.classList.contains("correctWords");
        });
        if (check) {
            displayResult();
        }
    });
});

/**
 * Start Test
 */
const startTest = () => {
    correctWords = 0;
    incorrectWords = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
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
}

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
}

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
};