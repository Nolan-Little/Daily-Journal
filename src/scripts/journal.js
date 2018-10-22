// target empty div to print entries to
const printDiv = document.getElementById("printDiv");

// construct and append elements given the tag name, textNode and value to print, and element to append
function constructElement(element, textNode, value, appendTo) {
  let tag = document.createElement(element);
  let text = document.createTextNode(`${textNode} ${value}`)
  tag.appendChild(text);
  appendTo.appendChild(tag);
}
// function to print entry which accepts the values to be printed and calls
  // the constructor function to specify the formatting for each value to print.
  // first 2 lines create  a container div so each entry is styled individually.
function printEntry(date, mood, concept, entry) {
  let entryContainer = document.createElement("div");
  entryContainer.className = "entryContainer";
  constructElement("h3", "date:", date, entryContainer)
  constructElement("h3", "mood:", mood, entryContainer)
  constructElement("h4", "Concepts covered:", concept, entryContainer)
  constructElement("p","", entry, entryContainer)
  printDiv.appendChild(entryContainer);
}

// class constructor
// class formView {
//   constructor() {
//     this.form = document.querySelector("form");
//     this.form.onsubmit = this.onsubmit
//   }


//   onsubmit(e) {
//     e.preventDefault();

//     const { target: form } = e;
//     const { journalDate, journalMood, journalConcepts, journalEntry } = form;
//     const values = [journalDate.value, journalMood.value, journalConcepts.value, journalEntry.value];
//     console.log(values);
//     printEntry(values[0], values[1], values[2], values[3]);

//   }
// }

// new formView();



