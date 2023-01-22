function viewReports() {
  const responseElement = document.querySelector(".response");

  responseElement.innerHTML = "Fetching reports...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/agent/fetch-sales-report?interval=weekly`;

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals[globals.environment].apiKey,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          updateResponsePane(responseElement, data, status);
        } else {
          updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(responseElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(9);
  viewReports();
});
