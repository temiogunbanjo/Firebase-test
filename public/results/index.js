let page = 1;
function viewResultsHandler(options = { page: 1, limit: 50 }) {
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
  }/game/fetch-result-history?page=${options.page}&limit=${
    options.limit
  }&order=S_N:DESC`;

  console.log(apiUrl);

  fetchAPI({
    url: apiUrl,
    method: "GET",
  })
    .then(async (result) => {
      try {
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
            .map((result) => {
              return `<div class="d-flex rows result-entry align-items-center">
              <h3 class="" style="margin: 10px 20px 10px 10px;">${
                result.S_N
              }</h3>
              <div class="d-flex cols flex-grow">
                <div class="d-flex rows space-between" style="align-items: flex-start;margin-bottom: 5px;">
                  <div class="d-flex cols">
                    <h5 class="" style="margin: 0">${result.drawName}</h5>
                    <span style="font-size: 10px; font-weight: 600">Game: ${result?.Game?.name} (${result?.category})</span>
                  </div>
                  <span class="status-indicator" data-status="${
                    result.status === 'active' ? 'won' : 'pending'
                  }">${result.status}</span>
                </div>
                
                <div class="d-flex rows space-between">
                  <span class="">${result.results.replace(/-/gi, ", ")}</span>
                  <h5 class="" style="margin: 0;margin-left: 20px;margin-right: 4px;letter-spacing: 2px">${
                    result.raffle
                  }</h5>
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
  setPageIndex(9);

  let nextBtn = document.querySelector(
    "#results-pagination #next-results-page"
  );
  let prevBtn = document.querySelector(
    "#results-pagination #prev-results-page"
  );

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      page = ev.target.getAttribute("data-page");
      page = parseInt(page, 10);
      viewResultsHandler({ page, limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      page = ev.target.getAttribute("data-page");
      page = parseInt(page, 10);
      viewResultsHandler({ page, limit: 50 });
    });
  }

  viewResultsHandler({ page, limit: 50 });

  setInterval(() => {
    viewResultsHandler({ page, limit: 50 });
  }, 0.333 * 60 * 1000);
});
