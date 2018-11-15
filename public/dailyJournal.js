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
    return fetch("http://localhost:8088/entries?_expand=mood").then(entries => entries.json()).then(parsedEntries => parsedEntries);
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
      entries.push(createHTML.printEntry(entry.date, entry.mood.name, entry.concept, entry.entry));
    });
    return entries;
  }

};
var _default = createHTML;
exports.default = _default;

},{"./constructor":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2NhcHR1cmVGb3JtLmpzIiwiLi4vc2NyaXB0cy9jb25zdHJ1Y3Rvci5qcyIsIi4uL3NjcmlwdHMvY3JlYXRlRm9ybS5qcyIsIi4uL3NjcmlwdHMvZ2V0RW50cmllcy5qcyIsIi4uL3NjcmlwdHMvam91cm5hbE1haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50RW50cmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNDQTtBQUNBLE1BQU0sUUFBTixDQUFlO0FBRWIsTUFBSSxJQUFKLENBQVMsSUFBVCxFQUFlO0FBQ2IsU0FBSyxLQUFMLEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBYjtBQUNBLFNBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsS0FBSyxRQUEzQjtBQUNEOztBQUNELE1BQUksSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLLEtBQVo7QUFDRDs7QUFFRCxFQUFBLGNBQWMsQ0FBQyxTQUFELEVBQVk7QUFDeEIsUUFBSSxTQUFTLENBQUMsSUFBVixLQUFtQixFQUFuQixJQUF5QixTQUFTLENBQUMsT0FBVixLQUFzQixFQUEvQyxJQUFxRCxTQUFTLENBQUMsS0FBVixLQUFvQixFQUE3RSxFQUFpRjtBQUMvRSxNQUFBLEtBQUssQ0FBQyxzQ0FBRCxDQUFMO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsVUFBSSxTQUFTLENBQUMsSUFBVixLQUFtQixRQUF2QixFQUFpQztBQUMvQixRQUFBLEtBQUssQ0FBQyxrQ0FBRCxDQUFMO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBSSxXQUFXLEdBQUcsOENBQWxCO0FBQ0EsVUFBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBUyxDQUFDLE9BQTNCLENBQXBCOztBQUNBLFVBQUksYUFBYSxLQUFLLElBQXRCLEVBQTRCO0FBQzFCLFFBQUEsS0FBSyxDQUFDLDBEQUFE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LGNBQWxEOztBQUNBLHlCQUFZLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DLG1CQUFuQyxFQUF3RCxPQUF4RCxFQUFpRSxjQUFqRTs7QUFDQSx5QkFBWSxnQkFBWixDQUE2QixHQUE3QixFQUFrQyxFQUFsQyxFQUFzQyxLQUF0QyxFQUE2QyxjQUE3Qzs7QUFDQSxJQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLGNBQXJCO0FBQ0EsV0FBTyxjQUFQO0FBQ0QsR0FWZ0I7O0FBYW5CO0FBQ0UsRUFBQSxZQUFZLENBQUMsVUFBRCxFQUFhO0FBQ3ZCLElBQUEsUUFBUSxDQUFDLFNBQVQsR0FBcUIsRUFBckI7QUFDQSxRQUFJLE9BQU8sR0FBRyxFQUFkO0FBQ0EsSUFBQSxVQUFVLENBQUMsT0FBWCxDQUFvQixLQUFELElBQVc7QUFDNUIsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFVBQVUsQ0FBQyxVQUFYLENBQXNCLEtBQUssQ0FBQyxJQUE1QixFQUFrQyxLQUFLLENBQUMsSUFBTixDQUFXLElBQTdDLEVBQW1ELEtBQUssQ0FBQyxPQUF6RCxFQUFrRSxLQUFLLENBQUMsS0FBeEUsQ0FBYjtBQUNELEtBRkQ7QUFHQSxXQUFPLE9BQVA7QUFDRDs7QUFyQmdCLENBQW5CO2VBd0JlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcbi8vIGNsYXNzIGNvbnN0cnVjdG9yXG5jbGFzcyBmb3JtVmlldyB7XG5cbiAgc2V0IGZvcm0oZm9ybSkge1xuICAgIHRoaXMuX2Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGZvcm0pXG4gICAgdGhpcy5fZm9ybS5vbnN1Ym1pdCA9IHRoaXMub25zdWJtaXRcbiAgfVxuICBnZXQgZm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVxuICB9XG5cbiAgdmFsaWRhdGVWYWx1ZXModmFsdWVzT2JqKSB7XG4gICAgaWYgKHZhbHVlc09iai5EYXRlID09PSBcIlwiIHx8IHZhbHVlc09iai5Db25jZXB0ID09PSBcIlwiIHx8IHZhbHVlc09iai5FbnRyeSA9PT0gXCJcIikge1xuICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZW50cnkgd2l0aCBibGFuayBmaWVsZHNcIilcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbHVlc09iai5tb29kID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgIGFsZXJ0KFwiUGxlYXNlIHBpY2sgYSBtb29kIGZvciB0aGUgZW50cnlcIilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIGxldCBjb25jZXB0UkdFWCA9IC9bL35gXFxAI1xcJCVcXF4mXFwqXFwoXFwpX1xcLVxcKz1cXHtcXH1cXFtcXF1cXHw7OlxcPFxcPi9dL2dcbiAgICAgIGxldCBjb25jZXB0UmVzdWx0ID0gY29uY2VwdFJHRVgudGVzdCh2YWx1ZXNPYmouY29uY2VwdClcbiAgICAgIGlmIChjb25jZXB0UmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICAgIGFsZXJ0KFwiUGxlYXNlIGRvbid0IHVzZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gdGhlIGNvbmNlcHQgZmllbGRcIilcbiAgICAgICAgLy8gdGhpcy5hZGRJbnZhbGlkKFwiY29uY2VwdE5hbWVcIilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIGxldCBlbnRyeVJHRVggPSAvWy9+YFxcQCNcXCQlXFxeJlxcKlxcKFxcKV9cXC1cXCs9XFx7XFx9XFxbXFxdXFx8OzpcXDxcXD4vXS9nXG4gICAgICBsZXQgZW50cnlSZXN1bHQgPSBlbnRyeVJHRVgudGVzdCh2YWx1ZXNPYmouZW50cnkpXG4gICAgICBpZiAoZW50cnlSZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgZG9uJ3QgdXNlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB0aGUgZW50cnkgZmllbGRcIilcbiAgICAgICAgLy8gdGhpcy5hZGRJbnZhbGlkKFwiZW50cnlcIilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIHJldHVybiAxXG4gICAgfVxuICB9XG5cbiAgb25zdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgZ2V0Rm9ybVZhbHVlcygpIHtcbiAgICBsZXQgZm9ybVZhbHVlcyA9IHt9XG4gICAgJC5tYWtlQXJyYXkoJChcIi5mb3JtX19pbnB1dFwiKSkuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IGlucHV0Lm5hbWUuc3BsaXQoXCJsXCIpWzFdXG4gICAgICBsZXQgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgZm9ybVZhbHVlc1tub3JtYWxpemVkVmFsdWVdID0gaW5wdXQudmFsdWVcbiAgICB9KVxuICAgIHJldHVybiBmb3JtVmFsdWVzXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9ybVZpZXdcbiIsIi8vIGNvbnN0cnVjdCBhbmQgYXBwZW5kIGVsZW1lbnRzIGdpdmVuIHRoZSB0YWcgbmFtZSwgdGV4dE5vZGUgYW5kIHZhbHVlIHRvIHByaW50LCBhbmQgZWxlbWVudCB0byBhcHBlbmRcblxuY29uc3QgY29uc3RydWN0b3IgPSB7XG4gIGNvbnN0cnVjdEVsZW1lbnQoZWxlbWVudCwgdGV4dE5vZGUsIHZhbHVlLCBhcHBlbmRUbykge1xuICAgIGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7dGV4dE5vZGV9ICR7dmFsdWV9YClcbiAgICB0YWcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGFnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25zdHJ1Y3RvciIsImxldCBjcmVhdGVGb3JtID0ge1xuICBmb3JtKCkge1xuICAgIGxldCBmb3JtID0gJChcIjxmb3JtPjwvZm9ybT5cIikuYXR0cihcIm9uc3VibWl0XCIsIFwicmV0dXJuIGZhbHNlXCIpLmF0dHIoXCJhY3Rpb25cIiwgXCJcIikuYXR0cihcImNsYXNzXCIsIFwiam91cm5hbF9fZm9ybVwiKVxuXG4gICAgJChmb3JtKS5odG1sKFxuICAgICAgYFxuICAgIDxmaWVsZHNldCBjbGFzcz1cImpvdXJuYWxfX2Zvcm0tLWZpZWxkc1wiPlxuICAgICAgPGxlZ2VuZCBjbGFzcz1cImZvcm0tLWxlZ2VuZFwiPk5ldyBFbnRyeTwvbGVnZW5kPlxuICAgICAgPGRpdiBjbGFzcz1cImRhdGUtbW9vZC1wYWlyXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsRGF0ZVwiPkRhdGUgb2YgRW50cnk6PC9sYWJlbD5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cImpvdXJuYWxEYXRlXCIgaWQ9XCJqb3VybmFsRGF0ZVwiIGNsYXNzPVwiZm9ybV9faW5wdXRcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxNb29kXCI+TW9vZDo8L2xhYmVsPlxuICAgICAgICA8c2VsZWN0IHR5cGU9XCJzZWxlY3RcIiBuYW1lPVwiam91cm5hbE1vb2RcIiBpZD1cImpvdXJuYWxNb29kXCIgY2xhc3M9XCJmb3JtX19pbnB1dFwiPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IFwic2VsZWN0XCIgPlNlbGVjdCBhIE1vb2Q8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSAxID5IYXBweTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDIgPkV4Y2l0ZWQ8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSAzID5TYWQ8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSA0ID5Bbnhpb3VzPC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gNSA+RnJ1c3RyYXRlZDwvb3B0aW9uPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tbGFiZWxwYWlyXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsQ29uY2VwdHNcIj5Db25jZXB0cyBDb3ZlcmVkPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS0tdGV4dEVudHJ5IGZvcm1fX2lucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwiam91cm5hbENvbmNlcHRcIiBpZD1cImpvdXJuYWxDb25jZXB0c1wiPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1sYWJlbHBhaXJcIj5cbiAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxFbnRyeVwiPkpvdXJuYWwgRW50cnk8L2xhYmVsPlxuICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJmb3JtLS10ZXh0RW50cnkgZm9ybV9faW5wdXRcIiB0eXBlPVwidGV4dGFyZWFcIiBuYW1lPVwiam91cm5hbEVudHJ5XCIgaWQ9XCJqb3VybmFsRW50cnlcIiBwbGFjZWhvbGRlcj1cIldoYXQncyB1cD9cIj48L3RleHRhcmVhPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tLWNvbnRhaW5lclwiPlxuICAgICAgICA8YnV0dG9uICB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJqb3VybmFsLS1idXR0b25cIiBpZD1cImpvdXJuYWxTdWJtaXRcIj5TdWJtaXQgRW50cnk8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiAgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiam91cm5hbC0tYnV0dG9uXCIgaWQ9XCJqb3VybmFsUHJpbnRcIj5QcmludCBBbGwgRW50cmllczwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9maWVsZHNldD5cbiAgYFxuICAgIClcbiAgICByZXR1cm4gZm9ybVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZvcm0iLCJcbmNvbnN0IGVudHJ5QVBJID0ge1xuICBmZXRjaEVudHJpZXMoKSB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2VudHJpZXM/X2V4cGFuZD1tb29kXCIpXG4gICAgICAudGhlbigoZW50cmllcykgPT4gZW50cmllcy5qc29uKCkpXG4gICAgICAudGhlbigocGFyc2VkRW50cmllcykgPT4gcGFyc2VkRW50cmllcylcbiAgfSxcblxuICBwb3N0RW50cnkoZW50cnlPYmopIHtcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvZW50cmllc1wiLCB7XG4gICAgICBtZXRob2Q6IFwicG9zdFwiLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgIH0sXG5cbiAgICAgIC8vbWFrZSBzdXJlIHRvIHNlcmlhbGl6ZSB5b3VyIEpTT04gYm9keVxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZW50cnlPYmopXG4gICAgfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAvL2RvIHNvbWV0aGluZyBhd2Vzb21lIHRoYXQgbWFrZXMgdGhlIHdvcmxkIGEgYmV0dGVyIHBsYWNlXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZW50cnlBUEkiLCIvLyBhZGQgZXZlbnQgbGlzdGVuZXIgdGhhdCBjYWxscyBwcmV2aW91cyBtZXRob2RzIGFuZCB0YXJnZXRzIFwicHJpbnQgYWxsIGVudHJpZXMgYnV0dG9uXCIgdG8gcHJpbnQgYWxsIGVudHJpZXNcbi8vIGluIHRoZSBkYXRhYmFzZS5qc29uIGZpbGUgYW5kIHJlbmRlcnMgdGhlbSB0byB0aGUgcGFnZS5cbmltcG9ydCBjcmVhdGVGb3JtIGZyb20gXCIuL2NyZWF0ZUZvcm1cIlxuaW1wb3J0IGZvcm1DbGFzcyBmcm9tIFwiLi9jYXB0dXJlRm9ybVwiXG5pbXBvcnQgZW50cnlBUEkgZnJvbSBcIi4vZ2V0RW50cmllc1wiXG5pbXBvcnQgY3JlYXRlSFRNTCBmcm9tIFwiLi9wcmludEVudHJpZXNcIlxuXG5sZXQgZm9ybSA9IGNyZWF0ZUZvcm0uZm9ybSgpXG5jb25zdCBwcmludERpdiA9ICQoXCIjcHJpbnREaXZcIilbMF1cblxuJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNqb3VybmFsUHJpbnRcIiwgZnVuY3Rpb24gKCkge1xuICBlbnRyeUFQSS5mZXRjaEVudHJpZXMoKVxuICAgIC50aGVuKChyZWFkeVRvUHJpbnQpID0+IHtcbiAgICAgIGNyZWF0ZUhUTUwucHJpbnRPbkNsaWNrKHJlYWR5VG9QcmludClcbiAgICAgICQoXCIjbW9vZEZpbHRlclwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKVxuICAgIH0pXG59KVxuXG4kKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiI21vb2RGaWx0ZXJcIiwgZnVuY3Rpb24gKGUpIHtcbiAgbGV0IGVudHJpZXMgPSAkKFwiLmVudHJ5Q29udGFpbmVyXCIpLnRvQXJyYXkoKVxuICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgaWYgKGVudHJ5LmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnQuaW5kZXhPZihlLnRhcmdldC52YWx1ZSkgPiAtMSkge1xuICAgICAgJChlbnRyeSkucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcbiAgICB9IGVsc2Uge1xuICAgICAgJChlbnRyeSkuYWRkQ2xhc3MoXCJoaWRkZW5cIilcbiAgICB9XG4gIH0pXG59KVxuXG4kKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiI2pvdXJuYWxTdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgbGV0IGZvcm1PYmogPSBtYWluSm91cm5hbEZvcm0uZ2V0Rm9ybVZhbHVlcygpXG4gIGNvbnNvbGUudGFibGUoZm9ybU9iailcbiAgaWYgKG1haW5Kb3VybmFsRm9ybS52YWxpZGF0ZVZhbHVlcyhtYWluSm91cm5hbEZvcm0uZ2V0Rm9ybVZhbHVlcygpKSA9PT0gMSkge1xuICAgIC8vIHBvc3QgZW50cnlcbiAgICAvLyByZXByaW50IHdpdGggbmV3IGVudHJ5XG4gICAgZW50cnlBUEkucG9zdEVudHJ5KG1haW5Kb3VybmFsRm9ybS5nZXRGb3JtVmFsdWVzKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgZW50cnlBUEkuZmV0Y2hFbnRyaWVzKClcbiAgICAgICAgLnRoZW4oKHJlYWR5VG9QcmludCkgPT4ge1xuICAgICAgICAgIGNyZWF0ZUhUTUwucHJpbnRPbkNsaWNrKHJlYWR5VG9QcmludClcbiAgICAgICAgICAkKFwiI21vb2RGaWx0ZXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcbiAgICAgICAgfSlcbiAgICB9KVxuICAgICQoXCJmb3JtXCIpWzBdLnJlc2V0KClcbiAgfVxufSlcblxubGV0IG1haW5Kb3VybmFsRm9ybSA9IG5ldyBmb3JtQ2xhc3NcbiQoXCIuam91cm5hbF9faGVhZGVyXCIpWzBdLmFmdGVyKGZvcm1bMF0pXG5tYWluSm91cm5hbEZvcm0uZm9ybSA9IFwiZm9ybVwiXG5cbiIsImltcG9ydCBjb25zdHJ1Y3RvciBmcm9tIFwiLi9jb25zdHJ1Y3RvclwiXG5cbi8vIHRhcmdldCBlbXB0eSBkaXYgdG8gcHJpbnQgZW50cmllcyB0b1xuXG4vLyBtZXRob2QgdG8gcHJpbnQgZW50cnkgd2hpY2ggYWNjZXB0cyB0aGUgdmFsdWVzIHRvIGJlIHByaW50ZWQgYW5kIGNhbGxzXG4vLyB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gc3BlY2lmeSB0aGUgZm9ybWF0dGluZyBmb3IgZWFjaCB2YWx1ZSB0byBwcmludC5cbi8vIGZpcnN0IDIgbGluZXMgY3JlYXRlICBhIGNvbnRhaW5lciBkaXYgc28gZWFjaCBlbnRyeSBpcyBzdHlsZWQgaW5kaXZpZHVhbGx5LlxuXG5jb25zdCBjcmVhdGVIVE1MID0ge1xuICBwcmludEVudHJ5KGRhdGUsIG1vb2QsIGNvbmNlcHQsIGVudHJ5KSB7XG4gICAgbGV0IGVudHJ5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBlbnRyeUNvbnRhaW5lci5jbGFzc05hbWUgPSBcImVudHJ5Q29udGFpbmVyXCI7XG4gICAgY29uc3RydWN0b3IuY29uc3RydWN0RWxlbWVudChcImgzXCIsIFwiZGF0ZTpcIiwgZGF0ZSwgZW50cnlDb250YWluZXIpXG4gICAgY29uc3RydWN0b3IuY29uc3RydWN0RWxlbWVudChcImgzXCIsIFwibW9vZDpcIiwgbW9vZCwgZW50cnlDb250YWluZXIpXG4gICAgY29uc3RydWN0b3IuY29uc3RydWN0RWxlbWVudChcImg0XCIsIFwiQ29uY2VwdHMgY292ZXJlZDpcIiwgY29uY2VwdCwgZW50cnlDb250YWluZXIpXG4gICAgY29uc3RydWN0b3IuY29uc3RydWN0RWxlbWVudChcInBcIiwgXCJcIiwgZW50cnksIGVudHJ5Q29udGFpbmVyKVxuICAgIHByaW50RGl2LmFwcGVuZENoaWxkKGVudHJ5Q29udGFpbmVyKTtcbiAgICByZXR1cm4gZW50cnlDb250YWluZXJcbiAgfSxcblxuXG4vLyBjYXB0dXJlIGRhdGEgZnJvbSBnZXRFbnRyaWVzIGFuZCBwcmludCBpdCBvbiBjbGlja1xuICBwcmludE9uQ2xpY2soZW50cnlBcnJheSkge1xuICAgIHByaW50RGl2LmlubmVySFRNTCA9IFwiXCJcbiAgICBsZXQgZW50cmllcyA9IFtdXG4gICAgZW50cnlBcnJheS5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgZW50cmllcy5wdXNoKGNyZWF0ZUhUTUwucHJpbnRFbnRyeShlbnRyeS5kYXRlLCBlbnRyeS5tb29kLm5hbWUsIGVudHJ5LmNvbmNlcHQsIGVudHJ5LmVudHJ5KSlcbiAgICB9KVxuICAgIHJldHVybiBlbnRyaWVzXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlSFRNTFxuXG5cblxuXG4iXX0=
