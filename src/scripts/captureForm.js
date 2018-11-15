
// class constructor
class formView {

  set form(form) {
    this._form = document.querySelector(form)
    this._form.onsubmit = this.onsubmit
  }
  get form() {
    return this._form
  }

  validateValues(valuesObj) {
    if (valuesObj.Date === "" || valuesObj.Concept === "" || valuesObj.Entry === "") {
      alert("Can't submit entry with blank fields")
    } else {
      if (valuesObj.mood === "select") {
        alert("Please pick a mood for the entry")
        return null
      }
      let conceptRGEX = /[/~`\@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:\<\>/]/g
      let conceptResult = conceptRGEX.test(valuesObj.concept)
      if (conceptResult === true) {
        alert("Please don't use special characters in the concept field")
        // this.addInvalid("conceptName")
        return null
      }
      let entryRGEX = /[/~`\@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:\<\>/]/g
      let entryResult = entryRGEX.test(valuesObj.entry)
      if (entryResult === true) {
        alert("Please don't use special characters in the entry field")
        // this.addInvalid("entry")
        return null
      }
      return 1
    }
  }

  onsubmit(e) {
    e.preventDefault()
  }

  getFormValues() {
    let formValues = {}
    $.makeArray($(".form__input")).forEach((input) => {
      let value = input.name.split("l")[1]
      let normalizedValue = value.toLowerCase()
      formValues[normalizedValue] = input.value
    })
    return formValues
  }
}

export default formView
