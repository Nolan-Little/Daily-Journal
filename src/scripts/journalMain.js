// add event listener that calls previous methods and targets "print all entries button" to print all entries
// in the database.json file and renders them to the page.


let printButton = document.querySelector("#journalPrint")
printButton.addEventListener("click", () => {
  entryFetcher.fetchEntries()
    .then((readyToPrint) => printOnClick(readyToPrint))
})
