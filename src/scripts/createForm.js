let createForm = {
  form() {
    let form = $("<form></form>").attr("onsubmit", "return false").attr("action", "").attr("class", "journal__form")

    $(form).html(
      `
    <fieldset class="journal__form--fields">
      <legend class="form--legend">New Entry</legend>
      <div class="date-mood-pair">
        <label for="journalDate">Date of Entry:</label>
        <input type="date" name="journalDate" id="journalDate" class="form__input">
        <label for="journalMood">Mood:</label>
        <select type="select" name="journalMood" id="journalMood" class="form__input">
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
        <input class="form--textEntry form__input" type="text" name="journalConcept" id="journalConcepts">
      </div>
      <div class="form-labelpair">
        <label for="journalEntry">Journal Entry</label>
        <textarea class="form--textEntry form__input" type="textarea" name="journalEntry" id="journalEntry" placeholder="What's up?"></textarea>
      </div>

      <div class="button--container">
        <button  type="submit" class="journal--button" id="journalSubmit">Submit Entry</button>
        <button  type="button" class="journal--button" id="journalPrint">Print All Entries</button>
      </div>
    </fieldset>
  `
    )
    return form
  }
}

export default createForm