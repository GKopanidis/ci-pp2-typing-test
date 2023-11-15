/**
 * Generates random quotes 
 */
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const shownTextSection = document.getElementById("shownText");
const userInput = document.getElementById("shownTextInput");

let shownText = "";
let time = 60;
let timer = "";
let mistakes = 0;


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
 * Start Test
 */
const startTest = () => {
    incorrectWords = 0;
    timer = "";
    userInput.disabled = false;
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