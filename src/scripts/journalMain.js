// add event listener that calls previous methods and targets "print all entries button" to print all entries
// in the database.json file and renders them to the page.
import createForm from "./createForm"
import formClass from "./captureForm"
import entryFetcher from "./getEntries"
import createHTML from "./printEntries"

let form = createForm.form()
const printDiv = $("#printDiv")[0]

$(document).on("click", "#journalPrint", function () {
  entryFetcher.fetchEntries()
    .then((readyToPrint) => {
      createHTML.printOnClick(readyToPrint)
      $("#moodFilter").removeClass("hidden")
    })
})

$(document).on("click", "#moodFilter", function (e) {
  let entries = $(".entryContainer").toArray()
  entries.forEach((entry) => {
    if (entry.childNodes[1].textContent.indexOf(e.target.value) > -1) {
      $(entry).removeClass("hidden")
    } else {
      $(entry).addClass("hidden")
    }
  })
})

let mainJournalForm = formClass
let h1 = $(".journal__header")[0].after(form[0])

