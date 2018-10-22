
// class constructor
class formView {
  constructor() {
    this.form = document.querySelector("form");
    this.form.onsubmit = this.onsubmit
  }


  onsubmit(e) {
    e.preventDefault();

    const { target: form } = e;
    const { journalDate, journalMood, journalConcepts, journalEntry } = form;
    const values = [journalDate.value, journalMood.value, journalConcepts.value, journalEntry.value];
    console.log(values);
    // printEntry(values[0], values[1], values[2], values[3]);

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
    .then( (response) => {
      //do something awesome that makes the world a better place
      console.log(response);
    });
  }
}

new formView();
