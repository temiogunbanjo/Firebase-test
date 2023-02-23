function viewBonusHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#bonus-container");
  containerElement.innerHTML = "Fetching bonuses...";

  if (!options) {
    options = {
      page: 1,
      limit: 50,
    };
  }

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/bonus/fetch-all-bonuses?page=${options.page}&limit=${options.limit}`;

  fetchAPI({
    url: apiUrl,
    method: "GET"
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;
          console.log(data);

          containerElement.innerHTML = data
            .map((bonus) => {
              return `
              <div class="ticket-card bonus">
                <div class="d-flex cols align-items-center ticket-header" style="margin-bottom:1em">
                  <h3 style="margin-bottom:0.5em; margin-top:0.5em">${
                    bonus.title
                  }</h3>
                  <span style="font-size:11px;">
                    <i class="ticket-label">Created On:</i>
                    <i class="ticket-value">${new Date(
                      bonus.createdAt
                    ).toDateString()}</i>
                  </span>
                  <span class="status-indicator round" data-status=${
                    bonus.status ? "won" : "lost"
                  } style="position: absolute; top: -5px; right: -5px"></span>
                </div>
                <div class="d-flex cols ticket-body">
                  <div class="ticket-body-row">
                    <p>
                      <span class="ticket-label">ID:</span>
                      <span class="ticket-value">${bonus.bonusId}</span>
                    </p>
                    <p>
                      <span class="ticket-label">Description:</span>
                      <span class="ticket-value">${
                        bonus.description || "-"
                      }</span>
                    </p>
                  </div>

                  <div class="ticket-body-row">
                    <p class="d-flex rows align-items-center" style="justify-content:space-between">
                      <span class="ticket-label">Qualification:</span>
                      <span class="ticket-value">N ${bonus.minimumDeposit || '0.00'} | ${bonus.depositRound} deposit </span>
                    </p>
                    <p class="d-flex rows align-items-center" style="justify-content:space-between">
                      <span class="ticket-label">Win Criteria:</span>
                      <span class="ticket-value">${bonus.gameType} | ${bonus.betType} | ${bonus.winCount} </span>
                    </p>
                  </div>

                  <div class="ticket-body-row">
                    <p class="d-flex rows align-items-center" style="justify-content:space-between">
                      <span class="ticket-label">Prize:</span>
                      <span class="ticket-value">${bonus.prize || "-"}</span>
                    </p>
                    ${
                      bonus.status
                        ? `<div class="d-flex" style="flex-direction: row; margin-bottom: 20px">
                            <button
                              class="w-auto flex-grow" onclick="applyForBonus('${bonus.bonusId}')"
                              style="background-color: dodgerblue; color: white; border: none;padding: 14px;border-radius: 5px; margin-left: 1px">
                              Apply Now
                            </button>
                          </div>`
                        : ""
                    }
                  </div>
                  
                </div>
              </div>
            `;
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

const fetchAllData = () => {
  const balanceElement = document.querySelector("#bonus-balance");
  viewBonusHandler({ page: 1, limit: 50 });
  fetchUserBalance(balanceElement, 'bonus');
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(12);
  // fetchAllData();

  const queryString = window.location.search.replace("?", "");
  const queryParams = {};
  queryString.split("&").forEach((each) => {
    const [key, value] = each.split("=");
    queryParams[key] = value;
  });

  console.log(queryParams);
});
