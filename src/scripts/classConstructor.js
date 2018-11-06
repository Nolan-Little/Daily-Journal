
// class constructor
class formView {
  constructor() {
    this.form = $("form")[0]
    this.form.onsubmit = this.onsubmit
  }

  validateValues(valuesArray) {
    if (valuesArray[1] === "1") {
      alert("Please pick a mood for the entry")
      // this.addInvalid("entry")
      return null
    }
    let conceptRGEX = /^[A-Z]{1,25}$/i
    let conceptResult = conceptRGEX.test(valuesArray[2])
    if (conceptResult === false) {
      alert("Please enter a valid concept name")
      // this.addInvalid("conceptName")
      return null
    }
    let entryRGEX = /^[A-Z]{1,25}$/i
    let entryResult = entryRGEX.test(valuesArray[3])
    if (entryResult === false) {
      alert("Please enter a valid journal entry")
      // this.addInvalid("entry")
      return null
    }
    return 1
  }

  onsubmit(e) {
    e.preventDefault();

    const { target: form } = e;
    const { journalDate, journalMood, journalConcepts, journalEntry } = form;
    const values = [journalDate.value, journalMood.value, journalConcepts.value, journalEntry.value];

    // printEntry(values[0], values[1], values[2], values[3]);
    if (journalForm.validateValues(values) === 1) {
      fetch("http://localhost:8088/entries", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          date: values[0],
          mood: values[1],
          concept: values[2],
          entry: values[3],
        })
      })
        .then((response) => {
          //do something awesome that makes the world a better place
          console.log(response);
        })
      form.reset()
    }
  }
}

let journalForm = new formView();
