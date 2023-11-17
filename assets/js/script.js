/**
 * Generates random quotes 
 */
const shownTextSection = document.getElementById("shownText");
const userInput = document.getElementById("shownTextInput");

let minLength = 80;
let maxLength = 100;
let shownText = "";
let time = 60;
let timer = "";
let correctWords = 0;
let incorrectWords = 0;
let wordCount = 0;
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
const renderNewQuote = async (min, max) => {
    //Get a random quote from api
    const response = await fetch("https://api.quotable.io/random?minLength="+min+"&maxLength="+max);
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

// Hinzugefügte Funktion zur Aktualisierung von wordCount
const updateWordCount = () => {
    const words = userInput.value.trim().split(/\s+/);
    wordCount = words.filter(word => word.length > 0).length;
    document.getElementById("wordCount").innerText = wordCount;
};

/**
 * Event Listener, comparing input words with quote
 */
userInput.addEventListener("input", () => {
    if (!timer) {
        timeReduce();
    }
    keystrokes++;
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);
    let userInputChars = userInput.value.split("");
    updateWordCount();

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
const startTest = (min, max) => {
    if (timer) {
        clearInterval(timer);
    }
    userInput.disabled = false;
    userInput.value = "";
    timer = 0;
    correctWords = 0;
    incorrectWords = 0;
    wordCount = 0;
    accuracy = 0;
    charsPerMinute = 0;
    keystrokes = 0;
    wordsPerMinute = 0;
    correctIndexes.clear();
    incorrectIndexes.clear();
    document.querySelector(".result").style.display = "none";
    document.getElementById("timer").innerText = 60;
    document.getElementById("correctWords").innerText = correctWords;
    document.getElementById("incorrectWords").innerText = incorrectWords;
    document.getElementById("wordCount").innerText = wordCount;
    document.getElementById("easy-mode").style.display = "none";
    document.getElementById("hard-mode").style.display = "none";
    document.getElementById("extreme-mode").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    shownTextSection.innerHTML = "";
    renderNewQuote(min, max);
    setTimeout(() => {
        userInput.focus();
    }, 0);
};

window.onload = () => {
    userInput.value = "";
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
        document.getElementById("timer").innerText = --time;
    }
}

/**
 * End Test
 */
const displayResult = () => {
    let timeTaken = 60 - time;
    let wordsPerMinute = 0;
    let charsPerMinute = 0;
    let accuracy = 0;

    //Berechnung der Gesamtanzahl der Wörter und Zeichen pro Minute
    const words = userInput.value.trim().split(/\s+/).length;
    
    //Display result div
    document.querySelector(".result").style.display = "block";
    document.getElementById("easy-mode").style.display = "block";
    document.getElementById("hard-mode").style.display = "block";
    document.getElementById("extreme-mode").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    clearInterval(timer);
    userInput.disabled = true;
    
    // Berechnen der verstrichenen Zeit
    if (time <= 0) {
        timeTaken = 1;
    }
    
    if (words > 0 && timeTaken > 0) {
        wordsPerMinute = (words / timeTaken * 60).toFixed(0);
        charsPerMinute = (userInput.value.length / timeTaken * 60).toFixed(0);
        if (userInput.value.length == 0){
            accuracy = 0;
            wordsPerMinute = 0;
        } else {
            accuracy = Math.round(((userInput.value.length - incorrectWords) / userInput.value.length) * 100);
        } 
    }

    // Anzeigen der Ergebnisse
    document.getElementById("charsPerMinute").innerText = charsPerMinute + " cpm";
    document.getElementById("keystrokes").innerText = keystrokes;
    document.getElementById("accuracy").innerText = accuracy + "%";
    document.getElementById("wordsPerMinute").innerText = wordsPerMinute + " wpm";

    // Anzeige von "GODLIKE", wenn die Genauigkeit 100% beträgt
    if (accuracy === 100 && isTestCompleted) {
        document.getElementById("godlike").style.display = "block";
        document.getElementById("godlike").innerText = "GODLIKE :D";
    } else {
        document.getElementById("godlike").style.display = "none";
    }    

    // Zurücksetzen der Testanzeige
    document.getElementById("easy-mode").style.display = "block";
    document.getElementById("hard-mode").style.display = "block";
    document.getElementById("extreme-mode").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    isTestCompleted = false;
};

/**
 * Event listener for pressing Enter
 */
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
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};