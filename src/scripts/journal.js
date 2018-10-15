
    const printDiv = document.getElementById("printDiv");
    function printEntry(date, mood, concept, entry) {
      let entryContainer = document.createElement('div');
      entryContainer.className = "entryContainer";
      
      let dateTag = document.createElement("h3");
      let dateText = document.createTextNode(`Date of Entry: ${date}`)
      dateTag.appendChild(dateText);
      entryContainer.appendChild(dateTag);
      
      let moodTag = document.createElement("h3");
      let moodText = document.createTextNode(`Mood: ${mood}`)
      moodTag.appendChild(moodText);
      entryContainer.appendChild(moodTag);
      
      let conceptTag = document.createElement("h4");
      let conceptText = document.createTextNode(`Concepts covered: ${concept}`)
      conceptTag.appendChild(conceptText);
      entryContainer.appendChild(conceptTag);
      
      let entryTag = document.createElement("p");
      let entryText = document.createTextNode(` ${entry}`)
      entryTag.appendChild(entryText);
      entryContainer.appendChild(entryTag);

      printDiv.appendChild(entryContainer);
    }
    class formView {
      constructor() {
        this.form = document.querySelector("form");
        this.form.onsubmit = this.onsubmit
      }


  onsubmit(e){
    e.preventDefault();
    const {target:form} = e;
    const {journalDate, journalMood, journalConcepts, journalEntry} = form;
    const values = [journalDate.value, journalMood.value, journalConcepts.value, journalEntry.value];
    console.log(values);
    printEntry(values[0],values[1],values[2],values[3]);
    
  }
}

new formView();



