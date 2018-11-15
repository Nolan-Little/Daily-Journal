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
    if (valuesObj.Date === "" || valuesObj.Concept === "" || valuesObj.Entry === "") {
      alert("Can't submit entry with blank fields");
    } else {
      if (valuesObj.mood === "select") {
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

      if (value === "moodId") {
        formValues[value] = Number(input.value);
      } else {
        formValues[value] = input.value;
      }
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
        <input type="date" name="journaldate" id="journalDate" class="form__input">
        <label for="journalMood">Mood:</label>
        <select type="select" name="journalmoodId" id="journalMood" class="form__input">
          <option value= "select" >Select a Mood</option>
          <option value= 1 >Happy</option>
          <option value= 2 >Excited</option>
          <option value= 3 >Sad</option>
          <option value= 4 >Anxious</option>
          <option value= 5 >Frustrated</option>
        </select>
      </div>
      <div class="form-labelpair">
        <label for="journalConcepts">Concepts Covered</label>
        <input class="form--textEntry form__input" type="text" name="journalconcept" id="journalConcepts">
      </div>
      <div class="form-labelpair">
        <label for="journalEntry">Journal Entry</label>
        <textarea class="form--textEntry form__input" type="textarea" name="journalentry" id="journalEntry" placeholder="What's up?"></textarea>
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
    return fetch("http://localhost:8088/entries?_expand=mood").then(entries => entries.json()).then(parsedEntries => parsedEntries);
  },

  fetchMoodEntries(moodId) {
    return fetch(`http://localhost:8088/entries?moodId=${moodId}&_expand=mood`).then(entries => entries.json()).then(parsedEntries => parsedEntries);
  },

  fetchMoods() {
    return fetch("http://localhost:8088/moods").then(entries => entries.json()).then(parsedEntries => parsedEntries);
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
  let moodVal = e.target.value;

  _getEntries.default.fetchMoods().then(response => {
    let moodId;
    response.forEach(mood => {
      if (moodVal === mood.name) {
        moodId = mood.id;
      }
    });
    return moodId;
  }).then(moodId => {
    _getEntries.default.fetchMoodEntries(moodId).then(readyToPrint => {
      _printEntries.default.printOnClick(readyToPrint);

      $("#moodFilter").removeClass("hidden");
      console.log(readyToPrint);
    });
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
      entries.push(createHTML.printEntry(entry.date, entry.mood.name, entry.concept, entry.entry));
    });
    return entries;
  }

};
var _default = createHTML;
exports.default = _default;

},{"./constructor":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2NhcHR1cmVGb3JtLmpzIiwiLi4vc2NyaXB0cy9jb25zdHJ1Y3Rvci5qcyIsIi4uL3NjcmlwdHMvY3JlYXRlRm9ybS5qcyIsIi4uL3NjcmlwdHMvZ2V0RW50cmllcy5qcyIsIi4uL3NjcmlwdHMvam91cm5hbE1haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50RW50cmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNDQTtBQUNBLE1BQU0sUUFBTixDQUFlO0FBRWIsTUFBSSxJQUFKLENBQVMsSUFBVCxFQUFlO0FBQ2IsU0FBSyxLQUFMLEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBYjtBQUNBLFNBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsS0FBSyxRQUEzQjtBQUNEOztBQUNELE1BQUksSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLLEtBQVo7QUFDRDs7QUFFRCxFQUFBLGNBQWMsQ0FBQyxTQUFELEVBQVk7QUFDeEIsUUFBSSxTQUFTLENBQUMsSUFBVixLQUFtQixFQUFuQixJQUF5QixTQUFTLENBQUMsT0FBVixLQUFzQixFQUEvQyxJQUFxRCxTQUFTLENBQUMsS0FBVixLQUFvQixFQUE3RSxFQUFpRjtBQUMvRSxNQUFBLEtBQUssQ0FBQyxzQ0FBRCxDQUFMO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsVUFBSSxTQUFTLENBQUMsSUFBVixLQUFtQixRQUF2QixFQUFpQztBQUMvQixRQUFBLEtBQUssQ0FBQyxrQ0FBRCxDQUFMO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBSSxXQUFXLEdBQUcsOENBQWxCO0FBQ0EsVUFBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBUyxDQUFDLE9BQTNCLENBQXBCOztBQUNBLFVBQUksYUFBYSxLQUFLLElBQXRCLEVBQTRCO0FBQzFCLFFBQUEsS0FBSyxDQUFDLDBEQUFELENBQUwsQ0FEMEIsQ0FFMUI7O0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBSSxTQUFTLEdBQUcsOENBQWhCO0FBQ0EsVUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFTLENBQUMsS0FBekIsQ0FBbEI7O0FBQ0EsVUFBSSxXQUFXLEtBQUssSUFBcEIsRUFBMEI7QUFDeEIsUUFBQSxLQUFLLENBQUMsd0RBQUQsQ0FBTCxDQUR3QixDQUV4Qjs7QUFDQSxlQUFPLElBQVA7QUFDRDs7QUFDRCxhQUFPLENBQVA7QUFDRDtBQUNGOztBQUVELEVBQUEsUUFBUSxDQUFDLENBQUQsRUFBSTtBQUNWLElBQUEsQ0FBQyxDQUFDLGNBQUY7QUFDRDs7QUFFRCxFQUFBLGFBQWEsR0FBRztBQUNkLFFBQUksVUFBVSxHQUFHLEVBQWpCO0FBQ0EsSUFBQSxDQUFDLENBQUMsU0FBRixDQUFZLENBQUMsQ0FBQyxjQUFELENBQWIsRUFBK0IsT0FBL0IsQ0FBd0MsS0FBRCxJQUFXO0FBQ2hELFVBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixDQUFaOztBQUNBLFVBQUcsS0FBSyxLQUFLLFFBQWIsRUFBc0I7QUFDcEIsUUFBQSxVQUFVLENBQUMsS0FBRCxDQUFWLEdBQW9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBUCxDQUExQjtBQUNELE9BRkQsTUFFTTtBQUNKLFFBQUEsVUFBVSxDQUFDLEtBQUQsQ0FBVixHQUFvQixLQUFLLENBQUMsS0FBMUI7QUFDRDtBQUNGLEtBUEQ7QUFRQSxXQUFPLFVBQVA7QUFDRDs7QUFuRFk7O2VBc0RBLFE7Ozs7Ozs7Ozs7QUN4RGY7QUFFQSxNQUFNLFdBQVcsR0FBRztBQUNsQixFQUFBLGdCQUFnQixDQUFDLE9BQUQsRUFBVSxRQUFWLEVBQW9CLEtBQXBCLEVBQTJCLFFBQTNCLEVBQXFDO0FBQ25ELFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLENBQVY7QUFDQSxRQUFJLElBQUksR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF5QixHQUFFLFFBQVMsSUFBRyxLQUFNLEVBQTdDLENBQVg7QUFDQSxJQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCO0FBQ0EsSUFBQSxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQjtBQUNEOztBQU5pQixDQUFwQjtlQVNlLFc7Ozs7Ozs7Ozs7QUNYZixJQUFJLFVBQVUsR0FBRztBQUNmLEVBQUEsSUFBSSxHQUFHO0FBQ0wsUUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQixJQUFuQixDQUF3QixVQUF4QixFQUFvQyxjQUFwQyxFQUFvRCxJQUFwRCxDQUF5RCxRQUF6RCxFQUFtRSxFQUFuRSxFQUF1RSxJQUF2RSxDQUE0RSxPQUE1RSxFQUFxRixlQUFyRixDQUFYO0FBRUEsSUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVEsSUFBUixDQUNHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FESDtBQWlDQSxXQUFPLElBQVA7QUFDRDs7QUF0Q2MsQ0FBakI7ZUF5Q2UsVTs7Ozs7Ozs7OztBQ3hDZixNQUFNLFFBQVEsR0FBRztBQUNmLEVBQUEsWUFBWSxHQUFHO0FBQ2IsV0FBTyxLQUFLLENBQUMsNENBQUQsQ0FBTCxDQUNKLElBREksQ0FDRSxPQUFELElBQWEsT0FBTyxDQUFDLElBQVIsRUFEZCxFQUVKLElBRkksQ0FFRSxhQUFELElBQW1CLGFBRnBCLENBQVA7QUFHRCxHQUxjOztBQU9mLEVBQUEsZ0JBQWdCLENBQUMsTUFBRCxFQUFTO0FBQ3ZCLFdBQU8sS0FBSyxDQUFFLHdDQUF1QyxNQUFPLGVBQWhELENBQUwsQ0FDSixJQURJLENBQ0UsT0FBRCxJQUFhLE9BQU8sQ0FBQyxJQUFSLEVBRGQsRUFFSixJQUZJLENBRUUsYUFBRCxJQUFtQixhQUZwQixDQUFQO0FBR0QsR0FYYzs7QUFhZixFQUFBLFVBQVUsR0FBRztBQUNYLFdBQU8sS0FBSyxDQUFDLDZCQUFELENBQUwsQ0FDSixJQURJLENBQ0UsT0FBRCxJQUFhLE9BQU8sQ0FBQyxJQUFSLEVBRGQsRUFFSixJQUZJLENBRUUsYUFBRCxJQUFtQixhQUZwQixDQUFQO0FBR0QsR0FqQmM7O0FBbUJmLEVBQUEsU0FBUyxDQUFDLFFBQUQsRUFBVztBQUNsQixXQUFPLEtBQUssQ0FBQywrQkFBRCxFQUFrQztBQUM1QyxNQUFBLE1BQU0sRUFBRSxNQURvQztBQUU1QyxNQUFBLE9BQU8sRUFBRTtBQUNQLGtCQUFVLGtCQURIO0FBRVAsd0JBQWdCO0FBRlQsT0FGbUM7QUFPNUM7QUFDQSxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLFFBQWY7QUFSc0MsS0FBbEMsQ0FBTCxDQVVKLElBVkksQ0FVRSxRQUFELElBQWM7QUFDbEI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWjtBQUNELEtBYkksQ0FBUDtBQWNEOztBQWxDYyxDQUFqQjtlQXFDZSxROzs7Ozs7QUNwQ2Y7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFMQTtBQUNBO0FBTUEsSUFBSSxJQUFJLEdBQUcsb0JBQVcsSUFBWCxFQUFYOztBQUNBLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxXQUFELENBQUQsQ0FBZSxDQUFmLENBQWpCO0FBRUEsQ0FBQyxDQUFDLFFBQUQsQ0FBRCxDQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGVBQXhCLEVBQXlDLFlBQVk7QUFDbkQsc0JBQVMsWUFBVCxHQUNHLElBREgsQ0FDUyxZQUFELElBQWtCO0FBQ3RCLDBCQUFXLFlBQVgsQ0FBd0IsWUFBeEI7O0FBQ0EsSUFBQSxDQUFDLENBQUMsYUFBRCxDQUFELENBQWlCLFdBQWpCLENBQTZCLFFBQTdCO0FBQ0QsR0FKSDtBQUtELENBTkQ7QUFRQSxDQUFDLENBQUMsUUFBRCxDQUFELENBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsYUFBeEIsRUFBdUMsVUFBVSxDQUFWLEVBQWE7QUFDbEQsTUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUF2Qjs7QUFDQSxzQkFBUyxVQUFULEdBQXNCLElBQXRCLENBQTRCLFFBQUQsSUFBYztBQUN2QyxRQUFJLE1BQUo7QUFDQSxJQUFBLFFBQVEsQ0FBQyxPQUFULENBQWtCLElBQUQsSUFBVTtBQUN6QixVQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBckIsRUFBMkI7QUFDekIsUUFBQSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQWQ7QUFDRDtBQUNGLEtBSkQ7QUFLQSxXQUFPLE1BQVA7QUFDRCxHQVJELEVBUUcsSUFSSCxDQVFTLE1BQUQsSUFBWTtBQUNsQix3QkFBUyxnQkFBVCxDQUEwQixNQUExQixFQUNHLElBREgsQ0FDUyxZQUFELElBQWtCO0FBQ3RCLDRCQUFXLFlBQVgsQ0FBd0IsWUFBeEI7O0FBQ0EsTUFBQSxDQUFDLENBQUMsYUFBRCxDQUFELENBQWlCLFdBQWpCLENBQTZCLFFBQTdCO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVo7QUFDRCxLQUxIO0FBTUQsR0FmRDtBQWdCRCxDQWxCRDtBQW9CQSxDQUFDLENBQUMsUUFBRCxDQUFELENBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsZ0JBQXhCLEVBQTBDLFVBQVUsQ0FBVixFQUFhO0FBQ3JELE1BQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxhQUFoQixFQUFkO0FBQ0EsRUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLE9BQWQ7O0FBQ0EsTUFBSSxlQUFlLENBQUMsY0FBaEIsQ0FBK0IsZUFBZSxDQUFDLGFBQWhCLEVBQS9CLE1BQW9FLENBQXhFLEVBQTJFO0FBQ3pFO0FBQ0E7QUFDQSx3QkFBUyxTQUFULENBQW1CLGVBQWUsQ0FBQyxhQUFoQixFQUFuQixFQUFvRCxJQUFwRCxDQUF5RCxNQUFNO0FBQzdELDBCQUFTLFlBQVQsR0FDRyxJQURILENBQ1MsWUFBRCxJQUFrQjtBQUN0Qiw4QkFBVyxZQUFYLENBQXdCLFlBQXhCOztBQUNBLFFBQUEsQ0FBQyxDQUFDLGFBQUQsQ0FBRCxDQUFpQixXQUFqQixDQUE2QixRQUE3QjtBQUNELE9BSkg7QUFLRCxLQU5EOztBQU9BLElBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVLENBQVYsRUFBYSxLQUFiO0FBQ0Q7QUFDRixDQWZEO0FBaUJBLElBQUksZUFBZSxHQUFHLElBQUksb0JBQUosRUFBdEI7QUFDQSxDQUFDLENBQUMsa0JBQUQsQ0FBRCxDQUFzQixDQUF0QixFQUF5QixLQUF6QixDQUErQixJQUFJLENBQUMsQ0FBRCxDQUFuQztBQUNBLGVBQWUsQ0FBQyxJQUFoQixHQUF1QixNQUF2Qjs7Ozs7Ozs7OztBQ3pEQTs7OztBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUEsTUFBTSxVQUFVLEdBQUc7QUFDakIsRUFBQSxVQUFVLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxPQUFiLEVBQXNCLEtBQXRCLEVBQTZCO0FBQ3JDLFFBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQXJCO0FBQ0EsSUFBQSxjQUFjLENBQUMsU0FBZixHQUEyQixnQkFBM0I7O0FBQ0EseUJBQVksZ0JBQVosQ0FBNkIsSUFBN0IsRUFBbUMsT0FBbkMsRUFBNEMsSUFBNUMsRUFBa0QsY0FBbEQ7O0FBQ0EseUJBQVksZ0JBQVosQ0FBNkIsSUFBN0IsRUFBbUMsT0FBbkMsRUFBNEMsSUFBNUMsRUFBa0QsY0FBbEQ7O0FBQ0EseUJBQVksZ0JBQVosQ0FBNkIsSUFBN0IsRUFBbUMsbUJBQW5DLEVBQXdELE9BQXhELEVBQWlFLGNBQWpFOztBQUNBLHlCQUFZLGdCQUFaLENBQTZCLEdBQTdCLEVBQWtDLEVBQWxDLEVBQXNDLEtBQXRDLEVBQTZDLGNBQTdDOztBQUNBLElBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsY0FBckI7QUFDQSxXQUFPLGNBQVA7QUFDRCxHQVZnQjs7QUFhbkI7QUFDRSxFQUFBLFlBQVksQ0FBQyxVQUFELEVBQWE7QUFDdkIsSUFBQSxRQUFRLENBQUMsU0FBVCxHQUFxQixFQUFyQjtBQUNBLFFBQUksT0FBTyxHQUFHLEVBQWQ7QUFDQSxJQUFBLFVBQVUsQ0FBQyxPQUFYLENBQW9CLEtBQUQsSUFBVztBQUM1QixNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsS0FBSyxDQUFDLElBQTVCLEVBQWtDLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBN0MsRUFBbUQsS0FBSyxDQUFDLE9BQXpELEVBQWtFLEtBQUssQ0FBQyxLQUF4RSxDQUFiO0FBQ0QsS0FGRDtBQUdBLFdBQU8sT0FBUDtBQUNEOztBQXJCZ0IsQ0FBbkI7ZUF3QmUsVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuLy8gY2xhc3MgY29uc3RydWN0b3JcbmNsYXNzIGZvcm1WaWV3IHtcblxuICBzZXQgZm9ybShmb3JtKSB7XG4gICAgdGhpcy5fZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZm9ybSlcbiAgICB0aGlzLl9mb3JtLm9uc3VibWl0ID0gdGhpcy5vbnN1Ym1pdFxuICB9XG4gIGdldCBmb3JtKCkge1xuICAgIHJldHVybiB0aGlzLl9mb3JtXG4gIH1cblxuICB2YWxpZGF0ZVZhbHVlcyh2YWx1ZXNPYmopIHtcbiAgICBpZiAodmFsdWVzT2JqLkRhdGUgPT09IFwiXCIgfHwgdmFsdWVzT2JqLkNvbmNlcHQgPT09IFwiXCIgfHwgdmFsdWVzT2JqLkVudHJ5ID09PSBcIlwiKSB7XG4gICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBlbnRyeSB3aXRoIGJsYW5rIGZpZWxkc1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsdWVzT2JqLm1vb2QgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgcGljayBhIG1vb2QgZm9yIHRoZSBlbnRyeVwiKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgbGV0IGNvbmNlcHRSR0VYID0gL1svfmBcXEAjXFwkJVxcXiZcXCpcXChcXClfXFwtXFwrPVxce1xcfVxcW1xcXVxcfDs6XFw8XFw+L10vZ1xuICAgICAgbGV0IGNvbmNlcHRSZXN1bHQgPSBjb25jZXB0UkdFWC50ZXN0KHZhbHVlc09iai5jb25jZXB0KVxuICAgICAgaWYgKGNvbmNlcHRSZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgZG9uJ3QgdXNlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB0aGUgY29uY2VwdCBmaWVsZFwiKVxuICAgICAgICAvLyB0aGlzLmFkZEludmFsaWQoXCJjb25jZXB0TmFtZVwiKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgbGV0IGVudHJ5UkdFWCA9IC9bL35gXFxAI1xcJCVcXF4mXFwqXFwoXFwpX1xcLVxcKz1cXHtcXH1cXFtcXF1cXHw7OlxcPFxcPi9dL2dcbiAgICAgIGxldCBlbnRyeVJlc3VsdCA9IGVudHJ5UkdFWC50ZXN0KHZhbHVlc09iai5lbnRyeSlcbiAgICAgIGlmIChlbnRyeVJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICBhbGVydChcIlBsZWFzZSBkb24ndCB1c2Ugc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHRoZSBlbnRyeSBmaWVsZFwiKVxuICAgICAgICAvLyB0aGlzLmFkZEludmFsaWQoXCJlbnRyeVwiKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgcmV0dXJuIDFcbiAgICB9XG4gIH1cblxuICBvbnN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICBnZXRGb3JtVmFsdWVzKCkge1xuICAgIGxldCBmb3JtVmFsdWVzID0ge31cbiAgICAkLm1ha2VBcnJheSgkKFwiLmZvcm1fX2lucHV0XCIpKS5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gaW5wdXQubmFtZS5zcGxpdChcImxcIilbMV1cbiAgICAgIGlmKHZhbHVlID09PSBcIm1vb2RJZFwiKXtcbiAgICAgICAgZm9ybVZhbHVlc1t2YWx1ZV0gPSBOdW1iZXIoaW5wdXQudmFsdWUpXG4gICAgICB9ZWxzZSB7XG4gICAgICAgIGZvcm1WYWx1ZXNbdmFsdWVdID0gaW5wdXQudmFsdWVcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtVmFsdWVzXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9ybVZpZXdcbiIsIi8vIGNvbnN0cnVjdCBhbmQgYXBwZW5kIGVsZW1lbnRzIGdpdmVuIHRoZSB0YWcgbmFtZSwgdGV4dE5vZGUgYW5kIHZhbHVlIHRvIHByaW50LCBhbmQgZWxlbWVudCB0byBhcHBlbmRcblxuY29uc3QgY29uc3RydWN0b3IgPSB7XG4gIGNvbnN0cnVjdEVsZW1lbnQoZWxlbWVudCwgdGV4dE5vZGUsIHZhbHVlLCBhcHBlbmRUbykge1xuICAgIGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7dGV4dE5vZGV9ICR7dmFsdWV9YClcbiAgICB0YWcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGFnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25zdHJ1Y3RvciIsImxldCBjcmVhdGVGb3JtID0ge1xuICBmb3JtKCkge1xuICAgIGxldCBmb3JtID0gJChcIjxmb3JtPjwvZm9ybT5cIikuYXR0cihcIm9uc3VibWl0XCIsIFwicmV0dXJuIGZhbHNlXCIpLmF0dHIoXCJhY3Rpb25cIiwgXCJcIikuYXR0cihcImNsYXNzXCIsIFwiam91cm5hbF9fZm9ybVwiKVxuXG4gICAgJChmb3JtKS5odG1sKFxuICAgICAgYFxuICAgIDxmaWVsZHNldCBjbGFzcz1cImpvdXJuYWxfX2Zvcm0tLWZpZWxkc1wiPlxuICAgICAgPGxlZ2VuZCBjbGFzcz1cImZvcm0tLWxlZ2VuZFwiPk5ldyBFbnRyeTwvbGVnZW5kPlxuICAgICAgPGRpdiBjbGFzcz1cImRhdGUtbW9vZC1wYWlyXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsRGF0ZVwiPkRhdGUgb2YgRW50cnk6PC9sYWJlbD5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cImpvdXJuYWxkYXRlXCIgaWQ9XCJqb3VybmFsRGF0ZVwiIGNsYXNzPVwiZm9ybV9faW5wdXRcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxNb29kXCI+TW9vZDo8L2xhYmVsPlxuICAgICAgICA8c2VsZWN0IHR5cGU9XCJzZWxlY3RcIiBuYW1lPVwiam91cm5hbG1vb2RJZFwiIGlkPVwiam91cm5hbE1vb2RcIiBjbGFzcz1cImZvcm1fX2lucHV0XCI+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gXCJzZWxlY3RcIiA+U2VsZWN0IGEgTW9vZDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDEgPkhhcHB5PC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gMiA+RXhjaXRlZDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDMgPlNhZDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDQgPkFueGlvdXM8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSA1ID5GcnVzdHJhdGVkPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1sYWJlbHBhaXJcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxDb25jZXB0c1wiPkNvbmNlcHRzIENvdmVyZWQ8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLS10ZXh0RW50cnkgZm9ybV9faW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJqb3VybmFsY29uY2VwdFwiIGlkPVwiam91cm5hbENvbmNlcHRzXCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWxhYmVscGFpclwiPlxuICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbEVudHJ5XCI+Sm91cm5hbCBFbnRyeTwvbGFiZWw+XG4gICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImZvcm0tLXRleHRFbnRyeSBmb3JtX19pbnB1dFwiIHR5cGU9XCJ0ZXh0YXJlYVwiIG5hbWU9XCJqb3VybmFsZW50cnlcIiBpZD1cImpvdXJuYWxFbnRyeVwiIHBsYWNlaG9sZGVyPVwiV2hhdCdzIHVwP1wiPjwvdGV4dGFyZWE+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi0tY29udGFpbmVyXCI+XG4gICAgICAgIDxidXR0b24gIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImpvdXJuYWwtLWJ1dHRvblwiIGlkPVwiam91cm5hbFN1Ym1pdFwiPlN1Ym1pdCBFbnRyeTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uICB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJqb3VybmFsLS1idXR0b25cIiBpZD1cImpvdXJuYWxQcmludFwiPlByaW50IEFsbCBFbnRyaWVzPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICBgXG4gICAgKVxuICAgIHJldHVybiBmb3JtXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRm9ybSIsIlxuY29uc3QgZW50cnlBUEkgPSB7XG4gIGZldGNoRW50cmllcygpIHtcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvZW50cmllcz9fZXhwYW5kPW1vb2RcIilcbiAgICAgIC50aGVuKChlbnRyaWVzKSA9PiBlbnRyaWVzLmpzb24oKSlcbiAgICAgIC50aGVuKChwYXJzZWRFbnRyaWVzKSA9PiBwYXJzZWRFbnRyaWVzKVxuICB9LFxuXG4gIGZldGNoTW9vZEVudHJpZXMobW9vZElkKSB7XG4gICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvZW50cmllcz9tb29kSWQ9JHttb29kSWR9Jl9leHBhbmQ9bW9vZGApXG4gICAgICAudGhlbigoZW50cmllcykgPT4gZW50cmllcy5qc29uKCkpXG4gICAgICAudGhlbigocGFyc2VkRW50cmllcykgPT4gcGFyc2VkRW50cmllcylcbiAgfSxcblxuICBmZXRjaE1vb2RzKCkge1xuICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9tb29kc1wiKVxuICAgICAgLnRoZW4oKGVudHJpZXMpID0+IGVudHJpZXMuanNvbigpKVxuICAgICAgLnRoZW4oKHBhcnNlZEVudHJpZXMpID0+IHBhcnNlZEVudHJpZXMpXG4gIH0sXG5cbiAgcG9zdEVudHJ5KGVudHJ5T2JqKSB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2VudHJpZXNcIiwge1xuICAgICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICB9LFxuXG4gICAgICAvL21ha2Ugc3VyZSB0byBzZXJpYWxpemUgeW91ciBKU09OIGJvZHlcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVudHJ5T2JqKVxuICAgIH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgLy9kbyBzb21ldGhpbmcgYXdlc29tZSB0aGF0IG1ha2VzIHRoZSB3b3JsZCBhIGJldHRlciBwbGFjZVxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVudHJ5QVBJIiwiLy8gYWRkIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgcHJldmlvdXMgbWV0aG9kcyBhbmQgdGFyZ2V0cyBcInByaW50IGFsbCBlbnRyaWVzIGJ1dHRvblwiIHRvIHByaW50IGFsbCBlbnRyaWVzXG4vLyBpbiB0aGUgZGF0YWJhc2UuanNvbiBmaWxlIGFuZCByZW5kZXJzIHRoZW0gdG8gdGhlIHBhZ2UuXG5pbXBvcnQgY3JlYXRlRm9ybSBmcm9tIFwiLi9jcmVhdGVGb3JtXCJcbmltcG9ydCBmb3JtQ2xhc3MgZnJvbSBcIi4vY2FwdHVyZUZvcm1cIlxuaW1wb3J0IGVudHJ5QVBJIGZyb20gXCIuL2dldEVudHJpZXNcIlxuaW1wb3J0IGNyZWF0ZUhUTUwgZnJvbSBcIi4vcHJpbnRFbnRyaWVzXCJcblxubGV0IGZvcm0gPSBjcmVhdGVGb3JtLmZvcm0oKVxuY29uc3QgcHJpbnREaXYgPSAkKFwiI3ByaW50RGl2XCIpWzBdXG5cbiQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjam91cm5hbFByaW50XCIsIGZ1bmN0aW9uICgpIHtcbiAgZW50cnlBUEkuZmV0Y2hFbnRyaWVzKClcbiAgICAudGhlbigocmVhZHlUb1ByaW50KSA9PiB7XG4gICAgICBjcmVhdGVIVE1MLnByaW50T25DbGljayhyZWFkeVRvUHJpbnQpXG4gICAgICAkKFwiI21vb2RGaWx0ZXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcbiAgICB9KVxufSlcblxuJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNtb29kRmlsdGVyXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGxldCBtb29kVmFsID0gZS50YXJnZXQudmFsdWVcbiAgZW50cnlBUEkuZmV0Y2hNb29kcygpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgbGV0IG1vb2RJZFxuICAgIHJlc3BvbnNlLmZvckVhY2goKG1vb2QpID0+IHtcbiAgICAgIGlmIChtb29kVmFsID09PSBtb29kLm5hbWUpIHtcbiAgICAgICAgbW9vZElkID0gbW9vZC5pZFxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIG1vb2RJZFxuICB9KS50aGVuKChtb29kSWQpID0+IHtcbiAgICBlbnRyeUFQSS5mZXRjaE1vb2RFbnRyaWVzKG1vb2RJZClcbiAgICAgIC50aGVuKChyZWFkeVRvUHJpbnQpID0+IHtcbiAgICAgICAgY3JlYXRlSFRNTC5wcmludE9uQ2xpY2socmVhZHlUb1ByaW50KVxuICAgICAgICAkKFwiI21vb2RGaWx0ZXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcbiAgICAgICAgY29uc29sZS5sb2cocmVhZHlUb1ByaW50KVxuICAgICAgfSlcbiAgfSlcbn0pXG5cbiQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjam91cm5hbFN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICBsZXQgZm9ybU9iaiA9IG1haW5Kb3VybmFsRm9ybS5nZXRGb3JtVmFsdWVzKClcbiAgY29uc29sZS50YWJsZShmb3JtT2JqKVxuICBpZiAobWFpbkpvdXJuYWxGb3JtLnZhbGlkYXRlVmFsdWVzKG1haW5Kb3VybmFsRm9ybS5nZXRGb3JtVmFsdWVzKCkpID09PSAxKSB7XG4gICAgLy8gcG9zdCBlbnRyeVxuICAgIC8vIHJlcHJpbnQgd2l0aCBuZXcgZW50cnlcbiAgICBlbnRyeUFQSS5wb3N0RW50cnkobWFpbkpvdXJuYWxGb3JtLmdldEZvcm1WYWx1ZXMoKSkudGhlbigoKSA9PiB7XG4gICAgICBlbnRyeUFQSS5mZXRjaEVudHJpZXMoKVxuICAgICAgICAudGhlbigocmVhZHlUb1ByaW50KSA9PiB7XG4gICAgICAgICAgY3JlYXRlSFRNTC5wcmludE9uQ2xpY2socmVhZHlUb1ByaW50KVxuICAgICAgICAgICQoXCIjbW9vZEZpbHRlclwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxuICAgICAgICB9KVxuICAgIH0pXG4gICAgJChcImZvcm1cIilbMF0ucmVzZXQoKVxuICB9XG59KVxuXG5sZXQgbWFpbkpvdXJuYWxGb3JtID0gbmV3IGZvcm1DbGFzc1xuJChcIi5qb3VybmFsX19oZWFkZXJcIilbMF0uYWZ0ZXIoZm9ybVswXSlcbm1haW5Kb3VybmFsRm9ybS5mb3JtID0gXCJmb3JtXCJcblxuIiwiaW1wb3J0IGNvbnN0cnVjdG9yIGZyb20gXCIuL2NvbnN0cnVjdG9yXCJcblxuLy8gdGFyZ2V0IGVtcHR5IGRpdiB0byBwcmludCBlbnRyaWVzIHRvXG5cbi8vIG1ldGhvZCB0byBwcmludCBlbnRyeSB3aGljaCBhY2NlcHRzIHRoZSB2YWx1ZXMgdG8gYmUgcHJpbnRlZCBhbmQgY2FsbHNcbi8vIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBzcGVjaWZ5IHRoZSBmb3JtYXR0aW5nIGZvciBlYWNoIHZhbHVlIHRvIHByaW50LlxuLy8gZmlyc3QgMiBsaW5lcyBjcmVhdGUgIGEgY29udGFpbmVyIGRpdiBzbyBlYWNoIGVudHJ5IGlzIHN0eWxlZCBpbmRpdmlkdWFsbHkuXG5cbmNvbnN0IGNyZWF0ZUhUTUwgPSB7XG4gIHByaW50RW50cnkoZGF0ZSwgbW9vZCwgY29uY2VwdCwgZW50cnkpIHtcbiAgICBsZXQgZW50cnlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGVudHJ5Q29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZW50cnlDb250YWluZXJcIjtcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDNcIiwgXCJkYXRlOlwiLCBkYXRlLCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDNcIiwgXCJtb29kOlwiLCBtb29kLCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDRcIiwgXCJDb25jZXB0cyBjb3ZlcmVkOlwiLCBjb25jZXB0LCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwicFwiLCBcIlwiLCBlbnRyeSwgZW50cnlDb250YWluZXIpXG4gICAgcHJpbnREaXYuYXBwZW5kQ2hpbGQoZW50cnlDb250YWluZXIpO1xuICAgIHJldHVybiBlbnRyeUNvbnRhaW5lclxuICB9LFxuXG5cbi8vIGNhcHR1cmUgZGF0YSBmcm9tIGdldEVudHJpZXMgYW5kIHByaW50IGl0IG9uIGNsaWNrXG4gIHByaW50T25DbGljayhlbnRyeUFycmF5KSB7XG4gICAgcHJpbnREaXYuaW5uZXJIVE1MID0gXCJcIlxuICAgIGxldCBlbnRyaWVzID0gW11cbiAgICBlbnRyeUFycmF5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBlbnRyaWVzLnB1c2goY3JlYXRlSFRNTC5wcmludEVudHJ5KGVudHJ5LmRhdGUsIGVudHJ5Lm1vb2QubmFtZSwgZW50cnkuY29uY2VwdCwgZW50cnkuZW50cnkpKVxuICAgIH0pXG4gICAgcmV0dXJuIGVudHJpZXNcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVIVE1MXG5cblxuXG5cbiJdfQ==
