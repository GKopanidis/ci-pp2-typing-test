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
    /**
     * Get a random quote from api
     */
    const response = await fetch(quoteApiUrl);
    /**
     * Store response
     */
    let data = await response.json();
    /**
     * Access quote
     */
    quote = data.content;

    console.log(data.content)
}

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}