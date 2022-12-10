let currentPage = 1;

function createTicketCard(ticket) {
  return `
    <div class="ticket-card">
      <div class="d-flex rows align-items-center ticket-header" style="margin-bottom:1em">
        <h3 style="margin-bottom:0.5em">Ticket</h3>
        <span style="font-size:11px;">
          <i class="ticket-label">Created On:</i>
          <i class="ticket-value">${new Date(
            ticket.createdAt
          ).toDateString()}</i>
        </span>
      </div>
      <div class="d-flex cols ticket-body">
        <div class="ticket-body-row">
          <p>
            <span class="ticket-label">ID:</span>
            <span class="ticket-value">${ticket.ticketId}</span>
          </p>
          <p>
            <span class="ticket-label">Game:</span>
            <span class="ticket-value" style="text-transform: capitalize;">${
              ticket.Game?.name
            } (${
    ticket.Game?.lotteryName.toLowerCase().endsWith("lottery")
      ? ticket.Game?.lotteryName
      : ticket.Game?.lotteryName + " lottery"
  })</span>
          </p>
          <p>
            <span class="ticket-label">Category:</span>
            <span class="ticket-value">${ticket.Game?.Lottery?.category}</span>
          </p>
          <p>
            <span class="ticket-label">Total Staked:</span>
            <span class="ticket-value">${ticket.totalStakedAmount}</span>
          </p>
          <p style="margin-top: 1.5em">
            <div class="ticket-label" style="font-weight:600">Bet Slips:</div>
            <div class="ticket-slip-container">${JSON.parse(ticket.betSlips)
              .map((slip) => {
                return `
                  <div class="ticket-slip" style="line-height: 1.3">
                    ${slip.betType} / ${slip.booster} / ${slip.resultType} – N${
                  parseFloat(slip.amount).toFixed(2)
                }
                    <br/>
                    ${
                      slip.selections
                        ? slip.selections
                            ?.split("-")
                            .map((e) => parseInt(e, 10))
                            .join(", ")
                        : "N/A"
                    } => (${slip.linesCount} lines)
                    ${
                      slip.winningCombo
                        ? `<br/>winningCombo: ${slip.winningCombo}`
                        : ""
                    }
                  </div>
                `;
              })
              .join("")}</div>
          </p>
        </div>

        <div class="ticket-body-row">
          <p class="d-flex rows align-items-center" style="justify-content:space-between">
            <span class="ticket-label">Total Win Amount:</span>
            <span class="ticket-value">${ticket.totalWinAmount || "–"}</span>
          </p>
          <p class="d-flex rows align-items-center" style="justify-content:space-between">
            <span class="ticket-label">Status:</span>
            <span class="ticket-value">
              <span class="status-indicator" data-status=${ticket.status}>${
    ticket.status
  }</span>
            </span>
          </p>
          ${
            ticket.status === "ongoing"
              ? `<div class="d-flex" style="flex-direction: row;">
                  <button
                    class="w-auto flex-grow" onclick="createInstantResult(${ticket.ticketId})"
                    style="background-color: dodgerblue; color: white; border: none;padding: 14px;border-radius: 5px; margin-right: 1px">
                    Create Instant Result
                  </button>
                  <button
                    class="w-auto flex-grow" onclick="deleteTicket(${ticket.ticketId})"
                    style="background-color: red; color: white; border: none;padding: 14px;border-radius: 5px; margin-left: 1px">
                    Delete TIcket
                  </button>
                </div>`
              : ""
          }
        </div>
        
      </div>
    </div>
  `;
}

async function createInstantResult(ticketId) {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/create-instant-result`;
  try {
    const response = await fetch(apiUrl, {
      method: "post",
      body: JSON.stringify({
        ticketId,
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `Bearer ${globals.token}`,
        mode: "no-cors",
        "x-api-key": globals[globals.environment].apiKey,
      },
    });

    const result = await response.json();
    const { status } = result;

    if (result && result.data) {
      // const { data } = result;
      const data = result?.data?.data;
      console.log(data);
      viewTicketsHandler();
    }
  } catch (error) {
    console.log(error);
    const { status } = error;
    console.log(status);
  }
}

async function deleteTicket(ticketId) {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/delete-ticket/${ticketId}`;
  try {
    const response = await fetch(apiUrl, {
      method: "delete",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `Bearer ${globals.token}`,
        mode: "no-cors",
        "x-api-key": globals[globals.environment].apiKey,
      },
    });

    const result = await response.json();
    const { status } = result;

    if (result && result.data) {
      // const { data } = result;
      const data = result?.data?.data;
      console.log(data);
      viewTicketsHandler();
    }
  } catch (error) {
    console.log(error);
    const { status } = error;
    console.log(status);
  }
}

function viewTicketsHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#ticket-container");
  const nextBtn = document.querySelector(
    "#ticket-pagination #next-ticket-page"
  );
  const prevBtn = document.querySelector(
    "#ticket-pagination #prev-ticket-page"
  );
  const pageCount = document.querySelector(
    "#ticket-pagination #ticket-page-count"
  );
  const pageTotal = document.querySelector(
    "#ticket-pagination #total-ticket-pages"
  );
  // containerElement.innerHTML = "Fetching tickets...";

  if (!options) {
    options = {
      page: parseInt(nextBtn.getAttribute("data-page"), 10) - 1 || 1,
      limit: 50,
    };
  }

  if (!globals.user?.userId) {
    window.location.replace('/');
  }

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-tickets/${globals.user?.userId}?page=${options.page}&limit=${
    options.limit
  }`;

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
          const { data } = result?.data;
          // console.log(data);

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

          containerElement.innerHTML = data
            .map((ticket) => {
              return createTicketCard(ticket);
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

function searchTicketHandler(
  {
    game,
    selections,
    betType = null,
    booster = null,
    resultType = null,
    startDate = "2022-10-01",
    endDate = "2022-11-07",
  },
  options
) {
  // ev.preventDefault();
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);

  startDate = startDate || "1970-01-01";
  endDate = endDate || `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  const containerElement = document.querySelector("#ticket-container");
  const nextBtn = document.querySelector(
    "#ticket-pagination #next-ticket-page"
  );
  const prevBtn = document.querySelector(
    "#ticket-pagination #prev-ticket-page"
  );
  const pageCount = document.querySelector(
    "#ticket-pagination #ticket-page-count"
  );
  const pageTotal = document.querySelector(
    "#ticket-pagination #total-ticket-pages"
  );
  // containerElement.innerHTML = "Fetching tickets...";

  if (!options) {
    options = {
      page: parseInt(nextBtn.getAttribute("data-page"), 10) - 1 || 1,
      limit: 50,
    };
  }
  const baseUrl = "https://engine.afrilot.com" || "http://127.0.0.1:8000";
  const apiUrl = `${baseUrl}/search?game=${
    game
  }&selections=${
    selections
  }&startDate=${
    startDate
  }&endDate=${
    endDate
  }`;

  fetch(apiUrl, {
    method: "get",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      // authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      // "x-api-key": globals[globals.environment].apiKey,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        console.log(result);
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;
          console.log(data);

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

          containerElement.innerHTML = data
            .map((ticket) => {
              return createTicketCard(ticket);
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

function fetchGameOptions() {
  // ev.preventDefault();
  const betTypeDropDown = document.querySelector("#bet-type-selector");
  const boostersDropDown = document.querySelector("#booster-selector");
  const resultTypeDropDown = document.querySelector("#result-selector");

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-game-options`;

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
          const { data } = result?.data;
          console.log(data);

          const { betTypes, resultTypes, boosters } = data;

          betTypes.forEach((each, index) => {
            const option = document.createElement("option");
            option.setAttribute("value", each);
            option.textContent = each;
            // if (index === 0) {
            //   option.setAttribute("selected", true);
            // }

            betTypeDropDown.appendChild(option);
          });

          boosters.forEach((each, index) => {
            const option = document.createElement("option");
            option.setAttribute("value", each);
            option.textContent = each;
            // if (index === 0) {
            //   option.setAttribute("selected", true);
            // }

            boostersDropDown.appendChild(option);
          });

          resultTypes.forEach((each, index) => {
            const option = document.createElement("option");
            option.setAttribute("value", each);
            option.textContent = each;
            // if (index === 0) {
            //   option.setAttribute("selected", true);
            // }

            resultTypeDropDown.appendChild(option);
          });
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

function fetchAll() {
  viewTicketsHandler({ page: currentPage, limit: 50 });
  fetchGameOptions();
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(7);

  let nextBtn = document.querySelector("#ticket-pagination #next-ticket-page");
  let prevBtn = document.querySelector("#ticket-pagination #prev-ticket-page");

  let searchBtn = document.querySelector("#search-ticket-button");

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewTicketsHandler({ page: parseInt(page, 10), limit: 50 });
      currentPage = parseInt(page, 10);
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewTicketsHandler({ page: parseInt(page, 10), limit: 50 });
      currentPage = parseInt(page, 10);
    });
  }

  if (searchBtn) {
    const gameInput = document.querySelector("#game-name-input");
    const selectionInput = document.querySelector("#selections-input");

    gameInput.value = "Positive";
    selectionInput.value = "6-32-26-34-38-22"; // -32-26-34-38-22

    searchBtn.addEventListener("click", (ev) => {
      const gameInputValue = document.querySelector("#game-name-input").value;
      const selectionInputValue =
        document.querySelector("#selections-input").value;
      const betTypeDropDownValue =
        document.querySelector("#bet-type-selector").value;
      const boostersDropDownValue =
        document.querySelector("#booster-selector").value;
      const resultTypeDropDownValue =
        document.querySelector("#result-selector").value;

      const payload = {
        game: gameInputValue,
        selections: selectionInputValue,
        betType: betTypeDropDownValue,
        booster: boostersDropDownValue,
        resultType: resultTypeDropDownValue,
      };

      console.log(payload);

      searchTicketHandler(payload);
    });
  }

  fetchAll();

  setInterval(() => {
    fetchAll();
  }, (0.5 * 60 * 1000));
});
