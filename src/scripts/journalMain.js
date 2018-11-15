// add event listener that calls previous methods and targets "print all entries button" to print all entries
// in the database.json file and renders them to the page.
import createForm from "./createForm"
import formClass from "./captureForm"
import entryAPI from "./getEntries"
import createHTML from "./printEntries"

let form = createForm.form()
const printDiv = $("#printDiv")[0]

$(document).on("click", "#journalPrint", function () {
  entryAPI.fetchEntries()
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

$(document).on("click", "#journalSubmit", function (e) {
  let formObj = mainJournalForm.getFormValues()
  console.table(formObj)
  if (mainJournalForm.validateValues(mainJournalForm.getFormValues()) === 1) {
    // post entry
    // reprint with new entry
    entryAPI.postEntry(mainJournalForm.getFormValues()).then(() => {
      entryAPI.fetchEntries()
        .then((readyToPrint) => {
          createHTML.printOnClick(readyToPrint)
          $("#moodFilter").removeClass("hidden")
        })
    })
    $("form")[0].reset()
  }
})

let mainJournalForm = new formClass
$(".journal__header")[0].after(form[0])
mainJournalForm.form = "form"

