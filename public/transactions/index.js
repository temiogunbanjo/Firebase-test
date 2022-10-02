function viewTransactionsHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#results-container");
  const nextBtn = document.querySelector(
    "#results-pagination #next-results-page"
  );
  const prevBtn = document.querySelector(
    "#results-pagination #prev-results-page"
  );
  const pageCount = document.querySelector("#results-pagination #page-count");
  const pageTotal = document.querySelector("#results-pagination #total-pages");

  // containerElement.innerHTML = "Fetching results...";
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/fetch-history?page=${options.page}&limit=${
    options.limit
  }&order=createdAt:DESC`;

  fetch(apiUrl, {
    method: "get",
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
          // const categoryObject = {};
          pageCount.innerHTML = options.page;
          pageTotal.innerHTML = Math.ceil(
            result.data.totalCount / options.limit
          );
          if (options.page === 1) {
            prevBtn.setAttribute("disabled", true);
          } else {
            prevBtn.removeAttribute("disabled");
          }

          nextBtn.setAttribute("data-page", options.page + 1);
          prevBtn.setAttribute("data-page", options.page - 1);

          console.log(result.data);
          const { data } = result?.data;

          containerElement.innerHTML = data
            .map((result, index) => {
              return `<div class="d-flex rows result-entry">
              <h3 class="" style="margin: 10px 20px 10px 10px;">${
                index + 1
              }.</h3>

              <div class="d-flex cols flex-grow">
                <div class="d-flex rows space-between align-items-center">
                  <h3 style="margin: 10px 20px 0 0;">${
                    result.narration.length > 35
                      ? `${result.narration.slice(0, 35)}...`
                      : result.narration
                  }</h3>
                  <span class="status-indicator" data-status=${(() => {
                    switch (result.status) {
                      case "success":
                        return "won";

                      case "failed":
                        return "lost";

                      default:
                        return "";
                    }
                  })()}>${result.status}</span>
                </div>  

                <div class="d-flex rows space-between">
                  <h5 style="margin-bottom: 10px; margin-top: 5px; color: #444444; text-transform: uppercase">${
                    result.transactionId
                  }</h5>
                </div>

                <div class="d-flex rows space-between">
                  <span>Ref: ${result.referenceId}</span>
                  <span class="fw-600" style="margin-left: 20px; margin-bottom: 3px">${
                    result.transactionType
                  } / ${result.provider} / ${result.transactionSource}</span>
                </div>

                <div class="d-flex rows space-between">
                  <span>Amount: <b style="color: #444444">${
                    result.amount
                  }</b></span>
                  <span class="fw-400" style="margin-left: 20px; font-size: 13px">${new Date(
                    result.createdAt
                  ).toUTCString()}</span>
                </div>
              </div>
            </div>`;
            })
            .join("");
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(containerElement, error, "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(4);

  let nextBtn = document.querySelector("#results-pagination #next-results-page");
  let prevBtn = document.querySelector("#results-pagination #prev-results-page");

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewTransactionsHandler({ page: parseInt(page, 10), limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewTransactionsHandler({ page: parseInt(page, 10), limit: 50 });
    });
  }

  viewTransactionsHandler({ page: 1, limit: 50 });
});
