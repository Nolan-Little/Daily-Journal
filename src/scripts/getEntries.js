
const entryFetcher = {
  fetchEntries() {
    return fetch("http://localhost:8088/entries")
      .then((entries) => entries.json())
      .then((parsedEntries) => parsedEntries)
  }
}

export default entryFetcher