//valter fallsterljung
var words = [
    ["i>0;", "i=0"],
    ["Sort();", "newList"],
    ["GetComponent", "GetComponent"],
    ["returndamage", "return"],
    ["myList[i].GetComponent", "myList[i].GetComponent"]
]
var wordPictures = [
    ["forloophard.png","forloopeasy.png"],
    ["listhard.png", "listeasy.png"],
    ["getcomponenthard.png", "getcomponent.png"],
    ["damagecalculation.png", "returneasy.png"],
    ["slutexempel.png", "slutexempel.png"]
];
var letters = [];
var answerId = 0;
var currentPic = 0;
var answer = "";
var Chances = 6;
var currentMistakes = 0;
var guessedLetters = [];
var pictures = ["hangman1.png", "hangman2.png", "hangman3.png", "hangman4.png", "hangman5.png", "hangman6.png", "hangman7.png"];
var clues = [["En forloop består av tre uttryck. Det första uttrycket körs en gång i början av varje loop. Det andra uttrycket bestämmer under vilka förhållanden loopen ska köras. Det tredje uttrycket körs efter att loopen är färdig.",
"Ett eller fler av ovanstående uttryck saknas i denna metod. Skriv in vilket.",
"En enkel forloop kan se ut något i stil med for(int i = 0; i < 5; i++){}. Denna loop kommer utföra vad som står inom {} paranteserna fem gånger."],
["List används för att hålla reda på objekt.", 
"List har flera metoder som hjälper till med att bland annat lägga till, sortera och leta efter objekt i listan.",
"En lista av strings kan skapas så här: List\x3c string \x3e myList = new List\x3c string \x3e();"],
["Denna metod kan användas för att nå komponenter på spelobjekt", 
"Denna metod returnerar en komponent av en angiven typ", 
"Denna metod returnerar den första komponenten den hittar, hittar den inget så returnera den null"],
["Metoden tar just nu fram ett värde men gör sedan inget med det.", 
"En metod kan ha en returtyp. Om denna returtyp är en int så förväntar sig metoden att en int returneras. Detta gäller även för till exempel string, char och bool.", 
"Du behöver returnera något."],
["Ingen ledtråd denna gång.",
"Använd vad du lärt dig",
"för att klara denna uppgift."]
];
var descriptions = [
["DoALoop ska skriva ut i 20 gånger men en del av for loopen saknas. Skriv in vad som fattas.", "DoALoop sak skriva ut i fem gånger men en del av loopen saknas. Skriv in vad som fattas."],
["myList är oorganiserad och behöver ordnas från lägsta tal till högsta. Skriv in vad som fattas.", "exempelklassen försöker skapa en ny lista. Skriv in vad som saknas."],
["Denna klass vill fylla listan mySprites med sprites från de gameobjects som finns i myGameObjects. Skriv in den metod som saknas.", "Denna klass ska hämta en bild från spelobjektet det är satt på och göra den svart. Skriv in vilken metod som saknas."],
["Metoden DamageCalculation ska ta in heltalen attack och defence och sedan ge tillbaka attack - defence. Skriv in vad som saknas.", "Metoden Heads or tails ska simulera ett myntflipp och antingen ge tillbaka true eller false som symbolerar huvud och klave. Skriv in vad som saknas."],
["Denna klass ska loopa igenom alla spelobjekt i en lista och ändra färgen på deras bild. Skriv in vad som saknas.", "Denna klass ska loopa igenom alla spelobjekt i en lista och ändra färgen på deras bild. Skriv in vad som saknas."]
];
var cluesGiven = 0;
var wordStatus = null;

function SetWord() {
    answer = words[answerId][currentPic];
}
//skapar en lång stäng med alla bokstäver som ska bli knappar, mappar dem sedan med addLetterButton så de alla blir en knapp. Slår sedan samman bokstäverna igen.
function CreateButtons() {
    letters = "abcdefghijklmnopqrstuvwxyzåäöABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ1234567890+-=()[]\x3c\x3e.;".split("").map(addLetterButton).join("");
    document.getElementById("buttons").innerHTML = letters;
}
//ta den angivna bokstaven och skapa en knapp med bokstaven som id. När knappen trycks så åkallas handleGuess med den angivna bokstaven. Den angivna bokstaven sätts också som text på knappen
function addLetterButton(letter) {
    var l = `<button class = "letterButton" id="` + letter + `" onClick="handleGuess('` + letter + `')">
          ` + letter + `</button>`
    return l;
}
//låser bokstaven spelaren tryckt på samt kollar ifall de har gissat rätt
function handleGuess(chosenLetter) {
    guessedLetters.push(chosenLetter);
    document.getElementById("usedLetters").innerHTML+=chosenLetter;
    document.getElementById(chosenLetter).setAttribute("disabled", true);
    //om bokstaven finns i det gömda ordet så uppdatera de visade bokstäverna
    if (answer.indexOf(chosenLetter) >= 0) {
        Guess();
        CheckIfGameWon();
    } else if (answer.indexOf(chosenLetter) == -1) {
        currentMistakes++;
        UpdateMistakes();
        CheckIfGameLost();
        updateHangmanPicture();
    }
}
//om instruktionerna är gömda så visas de och ifall spelaren fått några ledtrådar så gömms de.
//om instruktionerna inte är gömda så gömms de och ifall spelaren tidigare fått ledtrådar så visas de igen.
function Instructions(){
    if(document.getElementById("instructions").hidden == true){
        document.getElementById("instructions").hidden = false;
        for(var i = 0; i < cluesGiven; i++){
            document.getElementById("clue" + i).innerHTML = " ";
        }
    }else{
        document.getElementById("instructions").hidden = true;
        for(var i = 0; i < cluesGiven; i++){
            document.getElementById("clue" + i).innerHTML = clues[answerId][i];
        }
    }
}
//ger spelaren en ledtråd sålänge som de fått mindre än tre
function giveClue() {
    if(cluesGiven >= 3){
        return;
    } 
    document.getElementById("instructions").hidden = true;
        for(var i = 0; i < cluesGiven; i++){
            document.getElementById("clue" + i).innerHTML = clues[answerId][i];
        }
    document.getElementById("clue" + cluesGiven).innerHTML = clues[answerId][cluesGiven];
    cluesGiven++;
}
function updateHangmanPicture() {
    document.getElementById("hangmanPic").src = pictures[currentMistakes];
}
function RestartGame(){
    answerId = 0;
    Reset();
}
//kollar ifall spelaren har vunnit och meddelar dem om så är fallet
function CheckIfGameWon() {
    if (wordStatus == answer) {
        document.getElementById("outcome").innerHTML = "Du vann!";
        answerId++;
        currentPic = 0;
        document.getElementById("nextButton").style.backgroundColor="green";
        LockButtons();
    }
}
//kollar ifall spelaren har förlorat och meddelar dem om så är fallet
function CheckIfGameLost() {
    if (currentMistakes >= Chances) {
        document.getElementById("outcome").innerHTML = "Du förlorade!";
        if (currentPic == 0){ currentPic = 1 } else { currentPic = 0 };
        document.getElementById("nextButton").style.backgroundColor="red";
        LockButtons();
    }
}
//låser alla knappar så att det inte går att trycka på dem när spelaren vunnit eller förlorat
function LockButtons(){
    for(var i = 0; i < letters.length; i++){
        if(letters[i] != null && document.getElementById(letters[i]) != null){
            document.getElementById(letters[i]).setAttribute("disabled", true);
        }
    }
}
function SetCodePicture() {
    document.getElementById("codePicture").src = wordPictures[answerId][currentPic];
    document.getElementById("description").innerHTML = descriptions[answerId][currentPic];
}
//återställer alla bilder, misstagen, ledtrådarna etc.
function Reset() {
    currentMistakes = 0;
    cluesGiven = 0;
    guessedLetters = [];
    document.getElementById("hangmanPic").src = pictures[0];
    document.getElementById("usedLetters").innerHTML = " ";
    document.getElementById("outcome").innerHTML = " ";
    UpdateMistakes();
    CreateButtons();
    SetWord();
    Guess();
    SetCodePicture();
    resetClues();
    document.getElementById("nextButton").style.backgroundColor= "rgb(144, 223, 186)";
}
function resetClues() {
    document.getElementById("clue0").innerHTML = "";
    document.getElementById("clue1").innerHTML = "";
    document.getElementById("clue2").innerHTML = "";
}
//uppdaterar vad det gömda ordet så att det innehåller spelarens nya gissade bokstav
function Guess() {
    wordStatus = answer.split("").map(letter => (guessedLetters.indexOf(letter) >= 0 ? letter : " _ ")).join("");
    document.getElementById("hiddenWord").innerHTML = wordStatus;

}
function UpdateMistakes() {
    document.getElementById("mistakes").innerHTML = currentMistakes;
}
document.getElementById("instructions").hidden = true;
document.getElementById("maxWrong").innerHTML = Chances;
aidButtonColor = document.getElementsByClassName("aidButtons").backgroundColor;
SetWord();
CreateButtons();
Guess();
SetCodePicture();