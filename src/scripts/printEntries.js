// target empty div to print entries to
const printDiv = document.getElementById("printDiv");

// method to print entry which accepts the values to be printed and calls
  // the constructor function to specify the formatting for each value to print.
  // first 2 lines create  a container div so each entry is styled individually.

const createHTML = {
  printEntry (date, mood, concept, entry) {
  let entryContainer = document.createElement("div");
  entryContainer.className = "entryContainer";
  constructor.constructElement("h3", "date:", date, entryContainer)
  constructor.constructElement("h3", "mood:", mood, entryContainer)
  constructor.constructElement("h4", "Concepts covered:", concept, entryContainer)
  constructor.constructElement("p","", entry, entryContainer)
  printDiv.appendChild(entryContainer);
  }
}

// capture data from getEntries and print it on click
let printOnClick = (entryArray) => {
  entryArray.forEach((entry) => {
    createHTML.printEntry(entry.date, entry.mood, entry.concept, entry.entry)
  })
}




