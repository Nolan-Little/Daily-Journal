// add event listener that calls previous methods and targets "print all entries button" to print all entries
// in the database.json file and renders them to the page.

let moodFilter = document.querySelector("#moodFilter")
moodFilter.addEventListener("click", (e) => {
  let entries = document.querySelectorAll(".entryContainer")
  entries.forEach((entry) => {
    if (entry.childNodes[1].textContent.indexOf(e.target.value) > -1) {
      entry.classList.remove("hidden")
    } else {
      entry.classList.add("hidden")
    }
  })
})

let printButton = document.querySelector("#journalPrint")
printButton.addEventListener("click", () => {
  entryFetcher.fetchEntries()
    .then((readyToPrint) => {
      printOnClick(readyToPrint)
      moodFilter.classList.remove("hidden")
    })
})

