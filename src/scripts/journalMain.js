// add event listener that calls previous methods and targets "print all entries button" to print all entries
// in the database.json file and renders them to the page.

$("#moodFilter").click((e) => {
  let entries = $(".entryContainer").toArray()
  entries.forEach((entry) => {
    if (entry.childNodes[1].textContent.indexOf(e.target.value) > -1) {
      $(entry).removeClass("hidden")
    } else {
      $(entry).addClass("hidden")
    }
  })
})


$("#journalPrint").click(() => {
  entryFetcher.fetchEntries()
    .then((readyToPrint) => {
      printOnClick(readyToPrint)
      moodFilter.classList.remove("hidden")
    })
})


