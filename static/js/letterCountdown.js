const MASTER_FONTS_LIST = [
  "arial",
  "courier",
  "times new roman",
  "garamond",
  "brush script MT",
  "palatino",
  "bookman",
  "avant garde",
  "impact",
  "comic sans MS",
];

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getFontsMinusCurrent(currentFont) {
  const modifiedFontsArray = MASTER_FONTS_LIST;
  const index = modifiedFontsArray.indexOf(currentFont);
  if (index !== -1) {
    modifiedFontsArray.splice(index, 1);
  }
  return modifiedFontsArray;
}

let timerId = null;
let lastChanged = -1;

// Update the count down every 1 second
const turnOnLetterCountdown = () => {
  if (timerId == null) {
    const helpText = document.getElementById("help");
    if (helpText) {
      helpText.innerText = "please god make it stop";
    }
    timerId = setInterval(function () {
      const randomInt = getRandomInt(1, 8);
      if (randomInt == lastChanged) {
        if (randomInt <= 8 && randomInt > 1) {
          randomInt -= 1;
        } else {
          randomInt += 1;
        }
      }
      lastChanged = randomInt;
      const rotation = getRandomInt(-10, 10);
      const randomLetters = document.querySelectorAll(
        `[id=site-title-letter-${randomInt}]`
      );
      randomLetters[1].style.rotate = `${rotation}deg`;

      const flipCard = randomLetters[0].parentElement.parentElement;
      const fontsToChooseFrom = getFontsMinusCurrent(flipCard.style.fontFamily);
      const randomFont =
        fontsToChooseFrom[Math.floor(Math.random() * fontsToChooseFrom.length)];
      flipCard.style.fontFamily = randomFont;

      if (flipCard.classList.contains("flipped")) {
        flipCard.classList.remove("flipped");
        flipCard.classList.add("unflipped");
      } else {
        flipCard.classList.add("flipped");
        flipCard.classList.remove("unflipped");
      }
    }, 3000);
  }
};

const turnOffLetterCountdown = () => {
  clearInterval(timerId);
  timerId = null;
  const helpText = document.getElementById("help");
  helpText.innerText = "please god make it... start?";
  helpText.setAttribute("onClick", "turnOnLetterCountdown()");
  console.log("helpText", helpText);
  for (i = 1; i < 8; i++) {
    const randomLetters = document.querySelectorAll(
      `[id=site-title-letter-${i}]`
    );
    randomLetters.forEach((x) => (x.style.rotate = "0deg"));
    const flipCardInner = randomLetters[0].parentElement.parentElement;
    flipCardInner.style.fontFamily = "";
    flipCardInner.classList.remove("flipped");
    flipCardInner.classList.remove("unflipped");
  }
};

turnOnLetterCountdown();
