(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// class constructor
class formView {
  set form(form) {
    this._form = document.querySelector(form);
    this._form.onsubmit = this.onsubmit;
  }

  get form() {
    return this._form;
  }

  validateValues(valuesObj) {
    console.log(valuesObj);

    if (valuesObj.Date === "" || valuesObj.Concept === "" || valuesObj.Entry === "") {
      alert("Can't submit entry with blank fields");
    } else {
      if (valuesObj.mood === "1") {
        alert("Please pick a mood for the entry");
        return null;
      }

      let conceptRGEX = /[/~`\@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:\<\>/]/g;
      let conceptResult = conceptRGEX.test(valuesObj.concept);

      if (conceptResult === true) {
        alert("Please don't use special characters in the concept field"); // this.addInvalid("conceptName")

        return null;
      }

      let entryRGEX = /[/~`\@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:\<\>/]/g;
      let entryResult = entryRGEX.test(valuesObj.entry);

      if (entryResult === true) {
        alert("Please don't use special characters in the entry field"); // this.addInvalid("entry")

        return null;
      }

      return 1;
    }
  }

  onsubmit(e) {
    e.preventDefault();
  }

  getFormValues() {
    let formValues = {};
    $.makeArray($(".form__input")).forEach(input => {
      let value = input.name.split("l")[1];
      let normalizedValue = value.toLowerCase();
      formValues[normalizedValue] = input.value;
    });
    return formValues;
  }

}

var _default = formView;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// construct and append elements given the tag name, textNode and value to print, and element to append
const constructor = {
  constructElement(element, textNode, value, appendTo) {
    let tag = document.createElement(element);
    let text = document.createTextNode(`${textNode} ${value}`);
    tag.appendChild(text);
    appendTo.appendChild(tag);
  }

};
var _default = constructor;
exports.default = _default;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let createForm = {
  form() {
    let form = $("<form></form>").attr("onsubmit", "return false").attr("action", "").attr("class", "journal__form");
    $(form).html(`
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
  `);
    return form;
  }

};
var _default = createForm;
exports.default = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const entryAPI = {
  fetchEntries() {
    return fetch("http://localhost:8088/entries").then(entries => entries.json()).then(parsedEntries => parsedEntries);
  },

  postEntry(entryObj) {
    return fetch("http://localhost:8088/entries", {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      //make sure to serialize your JSON body
      body: JSON.stringify(entryObj)
    }).then(response => {
      //do something awesome that makes the world a better place
      console.log(response);
    });
  }

};
var _default = entryAPI;
exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

var _createForm = _interopRequireDefault(require("./createForm"));

var _captureForm = _interopRequireDefault(require("./captureForm"));

var _getEntries = _interopRequireDefault(require("./getEntries"));

var _printEntries = _interopRequireDefault(require("./printEntries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// add event listener that calls previous methods and targets "print all entries button" to print all entries
// in the database.json file and renders them to the page.
let form = _createForm.default.form();

const printDiv = $("#printDiv")[0];
$(document).on("click", "#journalPrint", function () {
  _getEntries.default.fetchEntries().then(readyToPrint => {
    _printEntries.default.printOnClick(readyToPrint);

    $("#moodFilter").removeClass("hidden");
  });
});
$(document).on("click", "#moodFilter", function (e) {
  let entries = $(".entryContainer").toArray();
  entries.forEach(entry => {
    if (entry.childNodes[1].textContent.indexOf(e.target.value) > -1) {
      $(entry).removeClass("hidden");
    } else {
      $(entry).addClass("hidden");
    }
  });
});
$(document).on("click", "#journalSubmit", function (e) {
  let formObj = mainJournalForm.getFormValues();
  console.table(formObj);

  if (mainJournalForm.validateValues(mainJournalForm.getFormValues()) === 1) {
    // post entry
    // reprint with new entry
    _getEntries.default.postEntry(mainJournalForm.getFormValues()).then(() => {
      _getEntries.default.fetchEntries().then(readyToPrint => {
        _printEntries.default.printOnClick(readyToPrint);

        $("#moodFilter").removeClass("hidden");
      });
    });

    $("form")[0].reset();
  }
});
let mainJournalForm = new _captureForm.default();
$(".journal__header")[0].after(form[0]);
mainJournalForm.form = "form";

},{"./captureForm":1,"./createForm":3,"./getEntries":4,"./printEntries":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constructor = _interopRequireDefault(require("./constructor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// target empty div to print entries to
// method to print entry which accepts the values to be printed and calls
// the constructor function to specify the formatting for each value to print.
// first 2 lines create  a container div so each entry is styled individually.
const createHTML = {
  printEntry(date, mood, concept, entry) {
    let entryContainer = document.createElement("div");
    entryContainer.className = "entryContainer";

    _constructor.default.constructElement("h3", "date:", date, entryContainer);

    _constructor.default.constructElement("h3", "mood:", mood, entryContainer);

    _constructor.default.constructElement("h4", "Concepts covered:", concept, entryContainer);

    _constructor.default.constructElement("p", "", entry, entryContainer);

    printDiv.appendChild(entryContainer);
    return entryContainer;
  },

  // capture data from getEntries and print it on click
  printOnClick(entryArray) {
    printDiv.innerHTML = "";
    let entries = [];
    entryArray.forEach(entry => {
      entries.push(createHTML.printEntry(entry.date, entry.mood, entry.concept, entry.entry));
    });
    return entries;
  }

};
var _default = createHTML;
exports.default = _default;

},{"./constructor":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2NhcHR1cmVGb3JtLmpzIiwiLi4vc2NyaXB0cy9jb25zdHJ1Y3Rvci5qcyIsIi4uL3NjcmlwdHMvY3JlYXRlRm9ybS5qcyIsIi4uL3NjcmlwdHMvZ2V0RW50cmllcy5qcyIsIi4uL3NjcmlwdHMvam91cm5hbE1haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50RW50cmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNDQTtBQUNBLE1BQU0sUUFBTixDQUFlO0FBQ2IsTUFBSSxJQUFKLENBQVMsSUFBVCxFQUFlO0FBQ2IsU0FBSyxLQUFMLEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBYjtBQUNBLFNBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsS0FBSyxRQUEzQjtBQUNEOztBQUNELE1BQUksSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLLEtBQVo7QUFDRDs7QUFFRCxFQUFBLGNBQWMsQ0FBQyxTQUFELEVBQVk7QUFDeEIsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFNBQVo7O0FBQ0EsUUFBSSxTQUFTLENBQUMsSUFBVixLQUFtQixFQUFuQixJQUF5QixTQUFTLENBQUMsT0FBVixLQUFzQixFQUEvQyxJQUFxRCxTQUFTLENBQUMsS0FBVixLQUFvQixFQUE3RSxFQUFpRjtBQUMvRSxNQUFBLEtBQUssQ0FBQyxzQ0FBRCxDQUFMO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsVUFBSSxTQUFTLENBQUMsSUFBVixLQUFtQixHQUF2QixFQUE0QjtBQUMxQixRQUFBLEtBQUssQ0FBQyxrQ0FBRCxDQUFMO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBSSxXQUFXLEdBQUcsOENBQWxCO0FBQ0EsVUFBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBUyxDQUFDLE9BQTNCLENBQXBCOztBQUNBLFVBQUksYUFBYSxLQUFLLElBQXRCLEVBQTRCO0FBQzFCLFFBQUEsS0FBSyxDQUFDLDBEQUFELENBQUwsQ0FEMEIsQ0FFMUI7O0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBSSxTQUFTLEdBQUcsOENBQWhCO0FBQ0EsVUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFTLENBQUMsS0FBekIsQ0FBbEI7O0FBQ0EsVUFBSSxXQUFXLEtBQUssSUFBcEIsRUFBMEI7QUFDeEIsUUFBQSxLQUFLLENBQUMsd0RBQUQsQ0FBTCxDQUR3QixDQUV4Qjs7QUFDQSxlQUFPLElBQVA7QUFDRDs7QUFDRCxhQUFPLENBQVA7QUFDRDtBQUNGOztBQUVELEVBQUEsUUFBUSxDQUFDLENBQUQsRUFBSTtBQUNWLElBQUEsQ0FBQyxDQUFDLGNBQUY7QUFDRDs7QUFFRCxFQUFBLGFBQWEsR0FBRztBQUNkLFFBQUksVUFBVSxHQUFHLEVBQWpCO0FBQ0EsSUFBQSxDQUFDLENBQUMsU0FBRixDQUFZLENBQUMsQ0FBQyxjQUFELENBQWIsRUFBK0IsT0FBL0IsQ0FBd0MsS0FBRCxJQUFXO0FBQ2hELFVBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixDQUFaO0FBQ0EsVUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDLFdBQU4sRUFBdEI7QUFDQSxNQUFBLFVBQVUsQ0FBQyxlQUFELENBQVYsR0FBOEIsS0FBSyxDQUFDLEtBQXBDO0FBQ0QsS0FKRDtBQUtBLFdBQU8sVUFBUDtBQUNEOztBQWhEWTs7ZUFvREEsUTs7Ozs7Ozs7OztBQ3REZjtBQUVBLE1BQU0sV0FBVyxHQUFHO0FBQ2xCLEVBQUEsZ0JBQWdCLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0IsRUFBcUM7QUFDbkQsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBVjtBQUNBLFFBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXlCLEdBQUUsUUFBUyxJQUFHLEtBQU0sRUFBN0MsQ0FBWDtBQUNBLElBQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEI7QUFDQSxJQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCO0FBQ0Q7O0FBTmlCLENBQXBCO2VBU2UsVzs7Ozs7Ozs7OztBQ1hmLElBQUksVUFBVSxHQUFHO0FBQ2YsRUFBQSxJQUFJLEdBQUc7QUFDTCxRQUFJLElBQUksR0FBRyxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLElBQW5CLENBQXdCLFVBQXhCLEVBQW9DLGNBQXBDLEVBQW9ELElBQXBELENBQXlELFFBQXpELEVBQW1FLEVBQW5FLEVBQXVFLElBQXZFLENBQTRFLE9BQTVFLEVBQXFGLGVBQXJGLENBQVg7QUFFQSxJQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUSxJQUFSLENBQ0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQURIO0FBaUNBLFdBQU8sSUFBUDtBQUNEOztBQXRDYyxDQUFqQjtlQXlDZSxVOzs7Ozs7Ozs7O0FDeENmLE1BQU0sUUFBUSxHQUFHO0FBQ2YsRUFBQSxZQUFZLEdBQUc7QUFDYixXQUFPLEtBQUssQ0FBQywrQkFBRCxDQUFMLENBQ0osSUFESSxDQUNFLE9BQUQsSUFBYSxPQUFPLENBQUMsSUFBUixFQURkLEVBRUosSUFGSSxDQUVFLGFBQUQsSUFBbUIsYUFGcEIsQ0FBUDtBQUdELEdBTGM7O0FBT2YsRUFBQSxTQUFTLENBQUMsUUFBRCxFQUFXO0FBQ2xCLFdBQU8sS0FBSyxDQUFDLCtCQUFELEVBQWtDO0FBQzVDLE1BQUEsTUFBTSxFQUFFLE1BRG9DO0FBRTVDLE1BQUEsT0FBTyxFQUFFO0FBQ1Asa0JBQVUsa0JBREg7QUFFUCx3QkFBZ0I7QUFGVCxPQUZtQztBQU81QztBQUNBLE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsUUFBZjtBQVJzQyxLQUFsQyxDQUFMLENBVUosSUFWSSxDQVVFLFFBQUQsSUFBYztBQUNsQjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxRQUFaO0FBQ0QsS0FiSSxDQUFQO0FBY0Q7O0FBdEJjLENBQWpCO2VBeUJlLFE7Ozs7OztBQ3hCZjs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUxBO0FBQ0E7QUFNQSxJQUFJLElBQUksR0FBRyxvQkFBVyxJQUFYLEVBQVg7O0FBQ0EsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFdBQUQsQ0FBRCxDQUFlLENBQWYsQ0FBakI7QUFFQSxDQUFDLENBQUMsUUFBRCxDQUFELENBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsZUFBeEIsRUFBeUMsWUFBWTtBQUNuRCxzQkFBUyxZQUFULEdBQ0csSUFESCxDQUNTLFlBQUQsSUFBa0I7QUFDdEIsMEJBQVcsWUFBWCxDQUF3QixZQUF4Qjs7QUFDQSxJQUFBLENBQUMsQ0FBQyxhQUFELENBQUQsQ0FBaUIsV0FBakIsQ0FBNkIsUUFBN0I7QUFDRCxHQUpIO0FBS0QsQ0FORDtBQVFBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWSxFQUFaLENBQWUsT0FBZixFQUF3QixhQUF4QixFQUF1QyxVQUFVLENBQVYsRUFBYTtBQUNsRCxNQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsaUJBQUQsQ0FBRCxDQUFxQixPQUFyQixFQUFkO0FBQ0EsRUFBQSxPQUFPLENBQUMsT0FBUixDQUFpQixLQUFELElBQVc7QUFDekIsUUFBSSxLQUFLLENBQUMsVUFBTixDQUFpQixDQUFqQixFQUFvQixXQUFwQixDQUFnQyxPQUFoQyxDQUF3QyxDQUFDLENBQUMsTUFBRixDQUFTLEtBQWpELElBQTBELENBQUMsQ0FBL0QsRUFBa0U7QUFDaEUsTUFBQSxDQUFDLENBQUMsS0FBRCxDQUFELENBQVMsV0FBVCxDQUFxQixRQUFyQjtBQUNELEtBRkQsTUFFTztBQUNMLE1BQUEsQ0FBQyxDQUFDLEtBQUQsQ0FBRCxDQUFTLFFBQVQsQ0FBa0IsUUFBbEI7QUFDRDtBQUNGLEdBTkQ7QUFPRCxDQVREO0FBV0EsQ0FBQyxDQUFDLFFBQUQsQ0FBRCxDQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGdCQUF4QixFQUEwQyxVQUFVLENBQVYsRUFBYTtBQUNyRCxNQUFJLE9BQU8sR0FBRyxlQUFlLENBQUMsYUFBaEIsRUFBZDtBQUNBLEVBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxPQUFkOztBQUNBLE1BQUksZUFBZSxDQUFDLGNBQWhCLENBQStCLGVBQWUsQ0FBQyxhQUFoQixFQUEvQixNQUFvRSxDQUF4RSxFQUEyRTtBQUN6RTtBQUNBO0FBQ0Esd0JBQVMsU0FBVCxDQUFtQixlQUFlLENBQUMsYUFBaEIsRUFBbkIsRUFBb0QsSUFBcEQsQ0FBeUQsTUFBTTtBQUM3RCwwQkFBUyxZQUFULEdBQ0csSUFESCxDQUNTLFlBQUQsSUFBa0I7QUFDdEIsOEJBQVcsWUFBWCxDQUF3QixZQUF4Qjs7QUFDQSxRQUFBLENBQUMsQ0FBQyxhQUFELENBQUQsQ0FBaUIsV0FBakIsQ0FBNkIsUUFBN0I7QUFDRCxPQUpIO0FBS0QsS0FORDs7QUFPQSxJQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVSxDQUFWLEVBQWEsS0FBYjtBQUNEO0FBQ0YsQ0FmRDtBQWlCQSxJQUFJLGVBQWUsR0FBRyxJQUFJLG9CQUFKLEVBQXRCO0FBQ0EsQ0FBQyxDQUFDLGtCQUFELENBQUQsQ0FBc0IsQ0FBdEIsRUFBeUIsS0FBekIsQ0FBK0IsSUFBSSxDQUFDLENBQUQsQ0FBbkM7QUFDQSxlQUFlLENBQUMsSUFBaEIsR0FBdUIsTUFBdkI7Ozs7Ozs7Ozs7QUNoREE7Ozs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBLE1BQU0sVUFBVSxHQUFHO0FBQ2pCLEVBQUEsVUFBVSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsT0FBYixFQUFzQixLQUF0QixFQUE2QjtBQUNyQyxRQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFyQjtBQUNBLElBQUEsY0FBYyxDQUFDLFNBQWYsR0FBMkIsZ0JBQTNCOztBQUNBLHlCQUFZLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DLE9BQW5DLEVBQTRDLElBQTVDLEVBQWtELGNBQWxEOztBQUNBLHlCQUFZLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DLE9BQW5DLEVBQTRDLElBQTVDLEVBQWtELGNBQWxEOztBQUNBLHlCQUFZLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DLG1CQUFuQyxFQUF3RCxPQUF4RCxFQUFpRSxjQUFqRTs7QUFDQSx5QkFBWSxnQkFBWixDQUE2QixHQUE3QixFQUFrQyxFQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxjQUE3Qzs7QUFDQSxJQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLGNBQXJCO0FBQ0EsV0FBTyxjQUFQO0FBQ0QsR0FWZ0I7O0FBYW5CO0FBQ0UsRUFBQSxZQUFZLENBQUMsVUFBRCxFQUFhO0FBQ3ZCLElBQUEsUUFBUSxDQUFDLFNBQVQsR0FBcUIsRUFBckI7QUFDQSxRQUFJLE9BQU8sR0FBRyxFQUFkO0FBQ0EsSUFBQSxVQUFVLENBQUMsT0FBWCxDQUFvQixLQUFELElBQVc7QUFDNUIsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFVBQVUsQ0FBQyxVQUFYLENBQXNCLEtBQUssQ0FBQyxJQUE1QixFQUFrQyxLQUFLLENBQUMsSUFBeEMsRUFBOEMsS0FBSyxDQUFDLE9BQXBELEVBQTZELEtBQUssQ0FBQyxLQUFuRSxDQUFiO0FBQ0QsS0FGRDtBQUdBLFdBQU8sT0FBUDtBQUNEOztBQXJCZ0IsQ0FBbkI7ZUF3QmUsVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuLy8gY2xhc3MgY29uc3RydWN0b3JcbmNsYXNzIGZvcm1WaWV3IHtcbiAgc2V0IGZvcm0oZm9ybSkge1xuICAgIHRoaXMuX2Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGZvcm0pXG4gICAgdGhpcy5fZm9ybS5vbnN1Ym1pdCA9IHRoaXMub25zdWJtaXRcbiAgfVxuICBnZXQgZm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVxuICB9XG5cbiAgdmFsaWRhdGVWYWx1ZXModmFsdWVzT2JqKSB7XG4gICAgY29uc29sZS5sb2codmFsdWVzT2JqKVxuICAgIGlmICh2YWx1ZXNPYmouRGF0ZSA9PT0gXCJcIiB8fCB2YWx1ZXNPYmouQ29uY2VwdCA9PT0gXCJcIiB8fCB2YWx1ZXNPYmouRW50cnkgPT09IFwiXCIpIHtcbiAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGVudHJ5IHdpdGggYmxhbmsgZmllbGRzXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWx1ZXNPYmoubW9vZCA9PT0gXCIxXCIpIHtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgcGljayBhIG1vb2QgZm9yIHRoZSBlbnRyeVwiKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgbGV0IGNvbmNlcHRSR0VYID0gL1svfmBcXEAjXFwkJVxcXiZcXCpcXChcXClfXFwtXFwrPVxce1xcfVxcW1xcXVxcfDs6XFw8XFw+L10vZ1xuICAgICAgbGV0IGNvbmNlcHRSZXN1bHQgPSBjb25jZXB0UkdFWC50ZXN0KHZhbHVlc09iai5jb25jZXB0KVxuICAgICAgaWYgKGNvbmNlcHRSZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgZG9uJ3QgdXNlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB0aGUgY29uY2VwdCBmaWVsZFwiKVxuICAgICAgICAvLyB0aGlzLmFkZEludmFsaWQoXCJjb25jZXB0TmFtZVwiKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgbGV0IGVudHJ5UkdFWCA9IC9bL35gXFxAI1xcJCVcXF4mXFwqXFwoXFwpX1xcLVxcKz1cXHtcXH1cXFtcXF1cXHw7OlxcPFxcPi9dL2dcbiAgICAgIGxldCBlbnRyeVJlc3VsdCA9IGVudHJ5UkdFWC50ZXN0KHZhbHVlc09iai5lbnRyeSlcbiAgICAgIGlmIChlbnRyeVJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICBhbGVydChcIlBsZWFzZSBkb24ndCB1c2Ugc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHRoZSBlbnRyeSBmaWVsZFwiKVxuICAgICAgICAvLyB0aGlzLmFkZEludmFsaWQoXCJlbnRyeVwiKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgcmV0dXJuIDFcbiAgICB9XG4gIH1cblxuICBvbnN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgZ2V0Rm9ybVZhbHVlcygpIHtcbiAgICBsZXQgZm9ybVZhbHVlcyA9IHt9XG4gICAgJC5tYWtlQXJyYXkoJChcIi5mb3JtX19pbnB1dFwiKSkuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IGlucHV0Lm5hbWUuc3BsaXQoXCJsXCIpWzFdXG4gICAgICBsZXQgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgZm9ybVZhbHVlc1tub3JtYWxpemVkVmFsdWVdID0gaW5wdXQudmFsdWVcbiAgICB9KVxuICAgIHJldHVybiBmb3JtVmFsdWVzXG4gIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBmb3JtVmlld1xuIiwiLy8gY29uc3RydWN0IGFuZCBhcHBlbmQgZWxlbWVudHMgZ2l2ZW4gdGhlIHRhZyBuYW1lLCB0ZXh0Tm9kZSBhbmQgdmFsdWUgdG8gcHJpbnQsIGFuZCBlbGVtZW50IHRvIGFwcGVuZFxuXG5jb25zdCBjb25zdHJ1Y3RvciA9IHtcbiAgY29uc3RydWN0RWxlbWVudChlbGVtZW50LCB0ZXh0Tm9kZSwgdmFsdWUsIGFwcGVuZFRvKSB7XG4gICAgbGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgJHt0ZXh0Tm9kZX0gJHt2YWx1ZX1gKVxuICAgIHRhZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICBhcHBlbmRUby5hcHBlbmRDaGlsZCh0YWcpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbnN0cnVjdG9yIiwibGV0IGNyZWF0ZUZvcm0gPSB7XG4gIGZvcm0oKSB7XG4gICAgbGV0IGZvcm0gPSAkKFwiPGZvcm0+PC9mb3JtPlwiKS5hdHRyKFwib25zdWJtaXRcIiwgXCJyZXR1cm4gZmFsc2VcIikuYXR0cihcImFjdGlvblwiLCBcIlwiKS5hdHRyKFwiY2xhc3NcIiwgXCJqb3VybmFsX19mb3JtXCIpXG5cbiAgICAkKGZvcm0pLmh0bWwoXG4gICAgICBgXG4gICAgPGZpZWxkc2V0IGNsYXNzPVwiam91cm5hbF9fZm9ybS0tZmllbGRzXCI+XG4gICAgICA8bGVnZW5kIGNsYXNzPVwiZm9ybS0tbGVnZW5kXCI+TmV3IEVudHJ5PC9sZWdlbmQ+XG4gICAgICA8ZGl2IGNsYXNzPVwiZGF0ZS1tb29kLXBhaXJcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxEYXRlXCI+RGF0ZSBvZiBFbnRyeTo8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBuYW1lPVwiam91cm5hbERhdGVcIiBpZD1cImpvdXJuYWxEYXRlXCIgY2xhc3M9XCJmb3JtX19pbnB1dFwiPlxuICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbE1vb2RcIj5Nb29kOjwvbGFiZWw+XG4gICAgICAgIDxzZWxlY3QgdHlwZT1cInNlbGVjdFwiIG5hbWU9XCJqb3VybmFsTW9vZFwiIGlkPVwiam91cm5hbE1vb2RcIiBjbGFzcz1cImZvcm1fX2lucHV0XCI+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gMSA+U2VsZWN0IGEgTW9vZDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDIgPkhhcHB5PC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gMyA+RXhjaXRlZDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDQgPlNhZDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDUgPkFueGlvdXM8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSA2ID5GcnVzdHJhdGVkPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1sYWJlbHBhaXJcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxDb25jZXB0c1wiPkNvbmNlcHRzIENvdmVyZWQ8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLS10ZXh0RW50cnkgZm9ybV9faW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJqb3VybmFsQ29uY2VwdFwiIGlkPVwiam91cm5hbENvbmNlcHRzXCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWxhYmVscGFpclwiPlxuICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbEVudHJ5XCI+Sm91cm5hbCBFbnRyeTwvbGFiZWw+XG4gICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImZvcm0tLXRleHRFbnRyeSBmb3JtX19pbnB1dFwiIHR5cGU9XCJ0ZXh0YXJlYVwiIG5hbWU9XCJqb3VybmFsRW50cnlcIiBpZD1cImpvdXJuYWxFbnRyeVwiIHBsYWNlaG9sZGVyPVwiV2hhdCdzIHVwP1wiPjwvdGV4dGFyZWE+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi0tY29udGFpbmVyXCI+XG4gICAgICAgIDxidXR0b24gIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImpvdXJuYWwtLWJ1dHRvblwiIGlkPVwiam91cm5hbFN1Ym1pdFwiPlN1Ym1pdCBFbnRyeTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uICB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJqb3VybmFsLS1idXR0b25cIiBpZD1cImpvdXJuYWxQcmludFwiPlByaW50IEFsbCBFbnRyaWVzPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICBgXG4gICAgKVxuICAgIHJldHVybiBmb3JtXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRm9ybSIsIlxuY29uc3QgZW50cnlBUEkgPSB7XG4gIGZldGNoRW50cmllcygpIHtcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvZW50cmllc1wiKVxuICAgICAgLnRoZW4oKGVudHJpZXMpID0+IGVudHJpZXMuanNvbigpKVxuICAgICAgLnRoZW4oKHBhcnNlZEVudHJpZXMpID0+IHBhcnNlZEVudHJpZXMpXG4gIH0sXG5cbiAgcG9zdEVudHJ5KGVudHJ5T2JqKSB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2VudHJpZXNcIiwge1xuICAgICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICB9LFxuXG4gICAgICAvL21ha2Ugc3VyZSB0byBzZXJpYWxpemUgeW91ciBKU09OIGJvZHlcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVudHJ5T2JqKVxuICAgIH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgLy9kbyBzb21ldGhpbmcgYXdlc29tZSB0aGF0IG1ha2VzIHRoZSB3b3JsZCBhIGJldHRlciBwbGFjZVxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVudHJ5QVBJIiwiLy8gYWRkIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgcHJldmlvdXMgbWV0aG9kcyBhbmQgdGFyZ2V0cyBcInByaW50IGFsbCBlbnRyaWVzIGJ1dHRvblwiIHRvIHByaW50IGFsbCBlbnRyaWVzXG4vLyBpbiB0aGUgZGF0YWJhc2UuanNvbiBmaWxlIGFuZCByZW5kZXJzIHRoZW0gdG8gdGhlIHBhZ2UuXG5pbXBvcnQgY3JlYXRlRm9ybSBmcm9tIFwiLi9jcmVhdGVGb3JtXCJcbmltcG9ydCBmb3JtQ2xhc3MgZnJvbSBcIi4vY2FwdHVyZUZvcm1cIlxuaW1wb3J0IGVudHJ5QVBJIGZyb20gXCIuL2dldEVudHJpZXNcIlxuaW1wb3J0IGNyZWF0ZUhUTUwgZnJvbSBcIi4vcHJpbnRFbnRyaWVzXCJcblxubGV0IGZvcm0gPSBjcmVhdGVGb3JtLmZvcm0oKVxuY29uc3QgcHJpbnREaXYgPSAkKFwiI3ByaW50RGl2XCIpWzBdXG5cbiQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjam91cm5hbFByaW50XCIsIGZ1bmN0aW9uICgpIHtcbiAgZW50cnlBUEkuZmV0Y2hFbnRyaWVzKClcbiAgICAudGhlbigocmVhZHlUb1ByaW50KSA9PiB7XG4gICAgICBjcmVhdGVIVE1MLnByaW50T25DbGljayhyZWFkeVRvUHJpbnQpXG4gICAgICAkKFwiI21vb2RGaWx0ZXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcbiAgICB9KVxufSlcblxuJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNtb29kRmlsdGVyXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGxldCBlbnRyaWVzID0gJChcIi5lbnRyeUNvbnRhaW5lclwiKS50b0FycmF5KClcbiAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeS5jaGlsZE5vZGVzWzFdLnRleHRDb250ZW50LmluZGV4T2YoZS50YXJnZXQudmFsdWUpID4gLTEpIHtcbiAgICAgICQoZW50cnkpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgICQoZW50cnkpLmFkZENsYXNzKFwiaGlkZGVuXCIpXG4gICAgfVxuICB9KVxufSlcblxuJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNqb3VybmFsU3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gIGxldCBmb3JtT2JqID0gbWFpbkpvdXJuYWxGb3JtLmdldEZvcm1WYWx1ZXMoKVxuICBjb25zb2xlLnRhYmxlKGZvcm1PYmopXG4gIGlmIChtYWluSm91cm5hbEZvcm0udmFsaWRhdGVWYWx1ZXMobWFpbkpvdXJuYWxGb3JtLmdldEZvcm1WYWx1ZXMoKSkgPT09IDEpIHtcbiAgICAvLyBwb3N0IGVudHJ5XG4gICAgLy8gcmVwcmludCB3aXRoIG5ldyBlbnRyeVxuICAgIGVudHJ5QVBJLnBvc3RFbnRyeShtYWluSm91cm5hbEZvcm0uZ2V0Rm9ybVZhbHVlcygpKS50aGVuKCgpID0+IHtcbiAgICAgIGVudHJ5QVBJLmZldGNoRW50cmllcygpXG4gICAgICAgIC50aGVuKChyZWFkeVRvUHJpbnQpID0+IHtcbiAgICAgICAgICBjcmVhdGVIVE1MLnByaW50T25DbGljayhyZWFkeVRvUHJpbnQpXG4gICAgICAgICAgJChcIiNtb29kRmlsdGVyXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXG4gICAgICAgIH0pXG4gICAgfSlcbiAgICAkKFwiZm9ybVwiKVswXS5yZXNldCgpXG4gIH1cbn0pXG5cbmxldCBtYWluSm91cm5hbEZvcm0gPSBuZXcgZm9ybUNsYXNzXG4kKFwiLmpvdXJuYWxfX2hlYWRlclwiKVswXS5hZnRlcihmb3JtWzBdKVxubWFpbkpvdXJuYWxGb3JtLmZvcm0gPSBcImZvcm1cIlxuXG5cblxuIiwiaW1wb3J0IGNvbnN0cnVjdG9yIGZyb20gXCIuL2NvbnN0cnVjdG9yXCJcblxuLy8gdGFyZ2V0IGVtcHR5IGRpdiB0byBwcmludCBlbnRyaWVzIHRvXG5cbi8vIG1ldGhvZCB0byBwcmludCBlbnRyeSB3aGljaCBhY2NlcHRzIHRoZSB2YWx1ZXMgdG8gYmUgcHJpbnRlZCBhbmQgY2FsbHNcbi8vIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBzcGVjaWZ5IHRoZSBmb3JtYXR0aW5nIGZvciBlYWNoIHZhbHVlIHRvIHByaW50LlxuLy8gZmlyc3QgMiBsaW5lcyBjcmVhdGUgIGEgY29udGFpbmVyIGRpdiBzbyBlYWNoIGVudHJ5IGlzIHN0eWxlZCBpbmRpdmlkdWFsbHkuXG5cbmNvbnN0IGNyZWF0ZUhUTUwgPSB7XG4gIHByaW50RW50cnkoZGF0ZSwgbW9vZCwgY29uY2VwdCwgZW50cnkpIHtcbiAgICBsZXQgZW50cnlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGVudHJ5Q29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZW50cnlDb250YWluZXJcIjtcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDNcIiwgXCJkYXRlOlwiLCBkYXRlLCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDNcIiwgXCJtb29kOlwiLCBtb29kLCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDRcIiwgXCJDb25jZXB0cyBjb3ZlcmVkOlwiLCBjb25jZXB0LCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwicFwiLCBcIlwiLCBlbnRyeSwgZW50cnlDb250YWluZXIpXG4gICAgcHJpbnREaXYuYXBwZW5kQ2hpbGQoZW50cnlDb250YWluZXIpO1xuICAgIHJldHVybiBlbnRyeUNvbnRhaW5lclxuICB9LFxuXG5cbi8vIGNhcHR1cmUgZGF0YSBmcm9tIGdldEVudHJpZXMgYW5kIHByaW50IGl0IG9uIGNsaWNrXG4gIHByaW50T25DbGljayhlbnRyeUFycmF5KSB7XG4gICAgcHJpbnREaXYuaW5uZXJIVE1MID0gXCJcIlxuICAgIGxldCBlbnRyaWVzID0gW11cbiAgICBlbnRyeUFycmF5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBlbnRyaWVzLnB1c2goY3JlYXRlSFRNTC5wcmludEVudHJ5KGVudHJ5LmRhdGUsIGVudHJ5Lm1vb2QsIGVudHJ5LmNvbmNlcHQsIGVudHJ5LmVudHJ5KSlcbiAgICB9KVxuICAgIHJldHVybiBlbnRyaWVzXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlSFRNTFxuXG5cblxuXG4iXX0=
