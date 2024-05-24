function viewReports() {
  const responseElement = document.querySelector(".response");

  responseElement.innerHTML = "Fetching reports...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/agent/fetch-sales-report?interval=weekly`;

  fetchAPI({
    url: apiUrl,
    method: "GET"
  })
    .then(async (result) => {
      try {
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

function viewVAgentReports() {
  const responseElement = document.querySelector(".response");

  responseElement.innerHTML = "Fetching reports...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-virtual-agent-sales-report?interval=weekly`;

  fetchAPI({
    url: apiUrl,
    method: "GET"
  })
    .then(async (result) => {
      try {
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
  setPageIndex(10);
  if (globals.user?.role === 'virtualagent') {
    viewVAgentReports();
  } else {
    viewReports();
  }
});
