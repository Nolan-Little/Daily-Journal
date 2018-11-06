let createForm = () => {
  let form = document.createElement("form")
  form.setAttribute("onsubmit", "return false")
  form.setAttribute("action", "")
  form.setAttribute("class", "journal__form")
  let h1 = document.querySelector(".journal__header")

  form.innerHTML =
    `
    <fieldset class="journal__form--fields">
      <legend class="form--legend">New Entry</legend>
      <div class="date-mood-pair">
        <label for="journalDate">Date of Entry:</label>
        <input type="date" name="journalDate" id="journalDate">
        <label for="journalMood">Mood:</label>
        <select type="select" name="journalMood" id="journalMood">
          <option value= 1 >Select a Mood</option>
          <option value= 2 >Happy</option>
          <option value= 3 >Excited</option>
          <option value= 4 >Sad</option>
          <option value= 5 >Anxious</option>
          <option value= 6 >Frustrated</option>
        </select>
      </div>
      <div class="form-labelpair">
        <label for="journalConcepts">Concepts Covered</label>
        <input class="form--textEntry" type="text" name="journalConcepts" id="journalConcepts">
      </div>
      <div class="form-labelpair">
        <label for="journalEntry">Journal Entry</label>
        <textarea class="form--textEntry" type="textarea" name="journalEntry" id="journalEntry" placeholder="What's up?"></textarea>
      </div>

      <div class="button--container">
        <button  type="submit" class="journal--button" id="journalSubmit">Submit Entry</button>
        <button  type="button" class="journal--button" id="journalPrint">Print All Entries</button>
      </div>
    </fieldset>
  `
}

export default createForm