
const entryAPI = {
  fetchEntries() {
    return fetch("http://localhost:8088/entries?_expand=mood")
      .then((entries) => entries.json())
      .then((parsedEntries) => parsedEntries)
  },

  fetchMoodEntries(moodId) {
    return fetch(`http://localhost:8088/entries?moodId=${moodId}&_expand=mood`)
      .then((entries) => entries.json())
      .then((parsedEntries) => parsedEntries)
  },

  fetchMoods() {
    return fetch("http://localhost:8088/moods")
      .then((entries) => entries.json())
      .then((parsedEntries) => parsedEntries)
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
    })
      .then((response) => {
        //do something awesome that makes the world a better place
        console.log(response);
      })
  }
}

export default entryAPI