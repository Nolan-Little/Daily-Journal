(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// class constructor
class formView {
  set form(formView) {
    this._form = document.querySelector("form");
    this._form.onsubmit = this.onsubmit;
  }

  get form() {
    return this._form;
  }

  validateValues(valuesArray) {
    if (valuesArray[1] === "1") {
      alert("Please pick a mood for the entry"); // this.addInvalid("entry")

      return null;
    }

    let conceptRGEX = /^[A-Z]{1,25}$/i;
    let conceptResult = conceptRGEX.test(valuesArray[2]);

    if (conceptResult === false) {
      alert("Please enter a valid concept name"); // this.addInvalid("conceptName")

      return null;
    }

    let entryRGEX = /^[A-Z]{1,25}$/i;
    let entryResult = entryRGEX.test(valuesArray[3]);

    if (entryResult === false) {
      alert("Please enter a valid journal entry"); // this.addInvalid("entry")

      return null;
    }

    return 1;
  }

  onsubmit(e) {
    e.preventDefault();
    const {
      target: form
    } = e;
    const {
      journalDate,
      journalMood,
      journalConcepts,
      journalEntry
    } = form;
    const values = [journalDate.value, journalMood.value, journalConcepts.value, journalEntry.value]; // printEntry(values[0], values[1], values[2], values[3]);

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
          entry: values[3]
        })
      }).then(response => {
        //do something awesome that makes the world a better place
        console.log(response);
      });
      form.reset();
    }
  }

}

let journalForm = new formView();
var _default = journalForm;
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
const entryFetcher = {
  fetchEntries() {
    return fetch("http://localhost:8088/entries").then(entries => entries.json()).then(parsedEntries => parsedEntries);
  }

};
var _default = entryFetcher;
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
let mainJournalForm = _captureForm.default;
let h1 = $(".journal__header")[0].after(form[0]);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2NhcHR1cmVGb3JtLmpzIiwiLi4vc2NyaXB0cy9jb25zdHJ1Y3Rvci5qcyIsIi4uL3NjcmlwdHMvY3JlYXRlRm9ybS5qcyIsIi4uL3NjcmlwdHMvZ2V0RW50cmllcy5qcyIsIi4uL3NjcmlwdHMvam91cm5hbE1haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50RW50cmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNDQTtBQUNBLE1BQU0sUUFBTixDQUFlO0FBQ2IsTUFBSSxJQUFKLENBQVMsUUFBVCxFQUFtQjtBQUNqQixTQUFLLEtBQUwsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFiO0FBQ0EsU0FBSyxLQUFMLENBQVcsUUFBWCxHQUFzQixLQUFLLFFBQTNCO0FBQ0Q7O0FBQ0QsTUFBSSxJQUFKLEdBQVc7QUFDVCxXQUFPLEtBQUssS0FBWjtBQUNEOztBQUVELEVBQUEsY0FBYyxDQUFDLFdBQUQsRUFBYztBQUMxQixRQUFJLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUIsR0FBdkIsRUFBNEI7QUFDMUIsTUFBQSxLQUFLLENBQUMsa0NBQUQsQ0FBTCxDQUQwQixDQUUxQjs7QUFDQSxhQUFPLElBQVA7QUFDRDs7QUFDRCxRQUFJLFdBQVcsR0FBRyxnQkFBbEI7QUFDQSxRQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsSUFBWixDQUFpQixXQUFXLENBQUMsQ0FBRCxDQUE1QixDQUFwQjs7QUFDQSxRQUFJLGFBQWEsS0FBSyxLQUF0QixFQUE2QjtBQUMzQixNQUFBLEtBQUssQ0FBQyxtQ0FBRCxDQUFMLENBRDJCLENBRTNCOztBQUNBLGFBQU8sSUFBUDtBQUNEOztBQUNELFFBQUksU0FBUyxHQUFHLGdCQUFoQjtBQUNBLFFBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxJQUFWLENBQWUsV0FBVyxDQUFDLENBQUQsQ0FBMUIsQ0FB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LE9BQVA7QUFDRDs7QUFyQmdCLENBQW5CO2VBd0JlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcbi8vIGNsYXNzIGNvbnN0cnVjdG9yXG5jbGFzcyBmb3JtVmlldyB7XG4gIHNldCBmb3JtKGZvcm1WaWV3KSB7XG4gICAgdGhpcy5fZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpXG4gICAgdGhpcy5fZm9ybS5vbnN1Ym1pdCA9IHRoaXMub25zdWJtaXRcbiAgfVxuICBnZXQgZm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVxuICB9XG5cbiAgdmFsaWRhdGVWYWx1ZXModmFsdWVzQXJyYXkpIHtcbiAgICBpZiAodmFsdWVzQXJyYXlbMV0gPT09IFwiMVwiKSB7XG4gICAgICBhbGVydChcIlBsZWFzZSBwaWNrIGEgbW9vZCBmb3IgdGhlIGVudHJ5XCIpXG4gICAgICAvLyB0aGlzLmFkZEludmFsaWQoXCJlbnRyeVwiKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgbGV0IGNvbmNlcHRSR0VYID0gL15bQS1aXXsxLDI1fSQvaVxuICAgIGxldCBjb25jZXB0UmVzdWx0ID0gY29uY2VwdFJHRVgudGVzdCh2YWx1ZXNBcnJheVsyXSlcbiAgICBpZiAoY29uY2VwdFJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgY29uY2VwdCBuYW1lXCIpXG4gICAgICAvLyB0aGlzLmFkZEludmFsaWQoXCJjb25jZXB0TmFtZVwiKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgbGV0IGVudHJ5UkdFWCA9IC9eW0EtWl17MSwyNX0kL2lcbiAgICBsZXQgZW50cnlSZXN1bHQgPSBlbnRyeVJHRVgudGVzdCh2YWx1ZXNBcnJheVszXSlcbiAgICBpZiAoZW50cnlSZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICBhbGVydChcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGpvdXJuYWwgZW50cnlcIilcbiAgICAgIC8vIHRoaXMuYWRkSW52YWxpZChcImVudHJ5XCIpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gMVxuICB9XG5cbiAgb25zdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHsgdGFyZ2V0OiBmb3JtIH0gPSBlO1xuICAgIGNvbnN0IHsgam91cm5hbERhdGUsIGpvdXJuYWxNb29kLCBqb3VybmFsQ29uY2VwdHMsIGpvdXJuYWxFbnRyeSB9ID0gZm9ybTtcbiAgICBjb25zdCB2YWx1ZXMgPSBbam91cm5hbERhdGUudmFsdWUsIGpvdXJuYWxNb29kLnZhbHVlLCBqb3VybmFsQ29uY2VwdHMudmFsdWUsIGpvdXJuYWxFbnRyeS52YWx1ZV07XG5cbiAgICAvLyBwcmludEVudHJ5KHZhbHVlc1swXSwgdmFsdWVzWzFdLCB2YWx1ZXNbMl0sIHZhbHVlc1szXSk7XG4gICAgaWYgKGpvdXJuYWxGb3JtLnZhbGlkYXRlVmFsdWVzKHZhbHVlcykgPT09IDEpIHtcbiAgICAgIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2VudHJpZXNcIiwge1xuICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgfSxcblxuICAgICAgICAvL21ha2Ugc3VyZSB0byBzZXJpYWxpemUgeW91ciBKU09OIGJvZHlcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGRhdGU6IHZhbHVlc1swXSxcbiAgICAgICAgICBtb29kOiB2YWx1ZXNbMV0sXG4gICAgICAgICAgY29uY2VwdDogdmFsdWVzWzJdLFxuICAgICAgICAgIGVudHJ5OiB2YWx1ZXNbM10sXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAvL2RvIHNvbWV0aGluZyBhd2Vzb21lIHRoYXQgbWFrZXMgdGhlIHdvcmxkIGEgYmV0dGVyIHBsYWNlXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICB9KVxuICAgICAgZm9ybS5yZXNldCgpXG4gICAgfVxuICB9XG59XG5cbmxldCBqb3VybmFsRm9ybSA9IG5ldyBmb3JtVmlld1xuZXhwb3J0IGRlZmF1bHQgam91cm5hbEZvcm1cbiIsIi8vIGNvbnN0cnVjdCBhbmQgYXBwZW5kIGVsZW1lbnRzIGdpdmVuIHRoZSB0YWcgbmFtZSwgdGV4dE5vZGUgYW5kIHZhbHVlIHRvIHByaW50LCBhbmQgZWxlbWVudCB0byBhcHBlbmRcblxuY29uc3QgY29uc3RydWN0b3IgPSB7XG4gIGNvbnN0cnVjdEVsZW1lbnQoZWxlbWVudCwgdGV4dE5vZGUsIHZhbHVlLCBhcHBlbmRUbykge1xuICAgIGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7dGV4dE5vZGV9ICR7dmFsdWV9YClcbiAgICB0YWcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGFnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25zdHJ1Y3RvciIsImxldCBjcmVhdGVGb3JtID0ge1xuICBmb3JtKCkge1xuICAgIGxldCBmb3JtID0gJChcIjxmb3JtPjwvZm9ybT5cIikuYXR0cihcIm9uc3VibWl0XCIsIFwicmV0dXJuIGZhbHNlXCIpLmF0dHIoXCJhY3Rpb25cIiwgXCJcIikuYXR0cihcImNsYXNzXCIsIFwiam91cm5hbF9fZm9ybVwiKVxuXG4gICAgJChmb3JtKS5odG1sKFxuICAgICAgYFxuICAgIDxmaWVsZHNldCBjbGFzcz1cImpvdXJuYWxfX2Zvcm0tLWZpZWxkc1wiPlxuICAgICAgPGxlZ2VuZCBjbGFzcz1cImZvcm0tLWxlZ2VuZFwiPk5ldyBFbnRyeTwvbGVnZW5kPlxuICAgICAgPGRpdiBjbGFzcz1cImRhdGUtbW9vZC1wYWlyXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJqb3VybmFsRGF0ZVwiPkRhdGUgb2YgRW50cnk6PC9sYWJlbD5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cImpvdXJuYWxEYXRlXCIgaWQ9XCJqb3VybmFsRGF0ZVwiPlxuICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbE1vb2RcIj5Nb29kOjwvbGFiZWw+XG4gICAgICAgIDxzZWxlY3QgdHlwZT1cInNlbGVjdFwiIG5hbWU9XCJqb3VybmFsTW9vZFwiIGlkPVwiam91cm5hbE1vb2RcIj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSAxID5TZWxlY3QgYSBNb29kPC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gMiA+SGFwcHk8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPSAzID5FeGNpdGVkPC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gNCA+U2FkPC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0gNSA+QW54aW91czwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9IDYgPkZydXN0cmF0ZWQ8L29wdGlvbj5cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWxhYmVscGFpclwiPlxuICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbENvbmNlcHRzXCI+Q29uY2VwdHMgQ292ZXJlZDwvbGFiZWw+XG4gICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tLXRleHRFbnRyeVwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImpvdXJuYWxDb25jZXB0c1wiIGlkPVwiam91cm5hbENvbmNlcHRzXCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWxhYmVscGFpclwiPlxuICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbEVudHJ5XCI+Sm91cm5hbCBFbnRyeTwvbGFiZWw+XG4gICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImZvcm0tLXRleHRFbnRyeVwiIHR5cGU9XCJ0ZXh0YXJlYVwiIG5hbWU9XCJqb3VybmFsRW50cnlcIiBpZD1cImpvdXJuYWxFbnRyeVwiIHBsYWNlaG9sZGVyPVwiV2hhdCdzIHVwP1wiPjwvdGV4dGFyZWE+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi0tY29udGFpbmVyXCI+XG4gICAgICAgIDxidXR0b24gIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImpvdXJuYWwtLWJ1dHRvblwiIGlkPVwiam91cm5hbFN1Ym1pdFwiPlN1Ym1pdCBFbnRyeTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uICB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJqb3VybmFsLS1idXR0b25cIiBpZD1cImpvdXJuYWxQcmludFwiPlByaW50IEFsbCBFbnRyaWVzPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICBgXG4gICAgKVxuICAgIHJldHVybiBmb3JtXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRm9ybSIsIlxuY29uc3QgZW50cnlGZXRjaGVyID0ge1xuICBmZXRjaEVudHJpZXMoKSB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2VudHJpZXNcIilcbiAgICAgIC50aGVuKChlbnRyaWVzKSA9PiBlbnRyaWVzLmpzb24oKSlcbiAgICAgIC50aGVuKChwYXJzZWRFbnRyaWVzKSA9PiBwYXJzZWRFbnRyaWVzKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVudHJ5RmV0Y2hlciIsIi8vIGFkZCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIHByZXZpb3VzIG1ldGhvZHMgYW5kIHRhcmdldHMgXCJwcmludCBhbGwgZW50cmllcyBidXR0b25cIiB0byBwcmludCBhbGwgZW50cmllc1xuLy8gaW4gdGhlIGRhdGFiYXNlLmpzb24gZmlsZSBhbmQgcmVuZGVycyB0aGVtIHRvIHRoZSBwYWdlLlxuaW1wb3J0IGNyZWF0ZUZvcm0gZnJvbSBcIi4vY3JlYXRlRm9ybVwiXG5pbXBvcnQgZm9ybUNsYXNzIGZyb20gXCIuL2NhcHR1cmVGb3JtXCJcbmltcG9ydCBlbnRyeUZldGNoZXIgZnJvbSBcIi4vZ2V0RW50cmllc1wiXG5pbXBvcnQgY3JlYXRlSFRNTCBmcm9tIFwiLi9wcmludEVudHJpZXNcIlxuXG5sZXQgZm9ybSA9IGNyZWF0ZUZvcm0uZm9ybSgpXG5jb25zdCBwcmludERpdiA9ICQoXCIjcHJpbnREaXZcIilbMF1cblxuJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNqb3VybmFsUHJpbnRcIiwgZnVuY3Rpb24gKCkge1xuICBlbnRyeUZldGNoZXIuZmV0Y2hFbnRyaWVzKClcbiAgICAudGhlbigocmVhZHlUb1ByaW50KSA9PiB7XG4gICAgICBjcmVhdGVIVE1MLnByaW50T25DbGljayhyZWFkeVRvUHJpbnQpXG4gICAgICAkKFwiI21vb2RGaWx0ZXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIilcbiAgICB9KVxufSlcblxuJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNtb29kRmlsdGVyXCIsIGZ1bmN0aW9uIChlKSB7XG4gIGxldCBlbnRyaWVzID0gJChcIi5lbnRyeUNvbnRhaW5lclwiKS50b0FycmF5KClcbiAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeS5jaGlsZE5vZGVzWzFdLnRleHRDb250ZW50LmluZGV4T2YoZS50YXJnZXQudmFsdWUpID4gLTEpIHtcbiAgICAgICQoZW50cnkpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgICQoZW50cnkpLmFkZENsYXNzKFwiaGlkZGVuXCIpXG4gICAgfVxuICB9KVxufSlcblxubGV0IG1haW5Kb3VybmFsRm9ybSA9IGZvcm1DbGFzc1xubGV0IGgxID0gJChcIi5qb3VybmFsX19oZWFkZXJcIilbMF0uYWZ0ZXIoZm9ybVswXSlcblxuIiwiaW1wb3J0IGNvbnN0cnVjdG9yIGZyb20gXCIuL2NvbnN0cnVjdG9yXCJcblxuLy8gdGFyZ2V0IGVtcHR5IGRpdiB0byBwcmludCBlbnRyaWVzIHRvXG5cbi8vIG1ldGhvZCB0byBwcmludCBlbnRyeSB3aGljaCBhY2NlcHRzIHRoZSB2YWx1ZXMgdG8gYmUgcHJpbnRlZCBhbmQgY2FsbHNcbi8vIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBzcGVjaWZ5IHRoZSBmb3JtYXR0aW5nIGZvciBlYWNoIHZhbHVlIHRvIHByaW50LlxuLy8gZmlyc3QgMiBsaW5lcyBjcmVhdGUgIGEgY29udGFpbmVyIGRpdiBzbyBlYWNoIGVudHJ5IGlzIHN0eWxlZCBpbmRpdmlkdWFsbHkuXG5cbmNvbnN0IGNyZWF0ZUhUTUwgPSB7XG4gIHByaW50RW50cnkoZGF0ZSwgbW9vZCwgY29uY2VwdCwgZW50cnkpIHtcbiAgICBsZXQgZW50cnlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGVudHJ5Q29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZW50cnlDb250YWluZXJcIjtcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDNcIiwgXCJkYXRlOlwiLCBkYXRlLCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDNcIiwgXCJtb29kOlwiLCBtb29kLCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwiaDRcIiwgXCJDb25jZXB0cyBjb3ZlcmVkOlwiLCBjb25jZXB0LCBlbnRyeUNvbnRhaW5lcilcbiAgICBjb25zdHJ1Y3Rvci5jb25zdHJ1Y3RFbGVtZW50KFwicFwiLCBcIlwiLCBlbnRyeSwgZW50cnlDb250YWluZXIpXG4gICAgcHJpbnREaXYuYXBwZW5kQ2hpbGQoZW50cnlDb250YWluZXIpO1xuICAgIHJldHVybiBlbnRyeUNvbnRhaW5lclxuICB9LFxuXG5cbi8vIGNhcHR1cmUgZGF0YSBmcm9tIGdldEVudHJpZXMgYW5kIHByaW50IGl0IG9uIGNsaWNrXG4gIHByaW50T25DbGljayhlbnRyeUFycmF5KSB7XG4gICAgcHJpbnREaXYuaW5uZXJIVE1MID0gXCJcIlxuICAgIGxldCBlbnRyaWVzID0gW11cbiAgICBlbnRyeUFycmF5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBlbnRyaWVzLnB1c2goY3JlYXRlSFRNTC5wcmludEVudHJ5KGVudHJ5LmRhdGUsIGVudHJ5Lm1vb2QsIGVudHJ5LmNvbmNlcHQsIGVudHJ5LmVudHJ5KSlcbiAgICB9KVxuICAgIHJldHVybiBlbnRyaWVzXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlSFRNTFxuXG5cblxuXG4iXX0=
