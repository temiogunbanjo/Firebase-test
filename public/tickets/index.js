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
                      <span class="ticket-value">${
                        ticket.Game?.Lottery?.category
                      }</span>
                    </p>
                    <p style="margin-top: 1.5em">
                      <div class="ticket-label" style="font-weight:600">Bet Slips:</div>
                      <div class="ticket-slip-container">${JSON.parse(
                        ticket.betSlips
                      )
                        .map((slip) => {
                          return `
                            <div class="ticket-slip">
                              ${slip.betType} / ${slip.booster} / ${
                            slip.resultType
                          } – N${slip.amount}
                              <br/>
                              ${
                                slip.selections
                                  ? slip.selections
                                      ?.split("-")
                                      .map((e) => parseInt(e, 10))
                                      .join(", ")
                                  : "N/A"
                              } => (${slip.lineCount} lines)
                            </div>
                          `;
                        })
                        .join("")}</div>
                    </p>
                  </div>

                  <div class="ticket-body-row">
                    <p class="d-flex rows align-items-center" style="justify-content:space-between">
                      <span class="ticket-label">Total Win Amount:</span>
                      <span class="ticket-value">${
                        ticket.totalWinAmount || "–"
                      }</span>
                    </p>
                    <p class="d-flex rows align-items-center" style="justify-content:space-between">
                      <span class="ticket-label">Status:</span>
                      <span class="ticket-value">
                        <span class="status-indicator" data-status=${
                          ticket.status
                        }>${ticket.status}</span>
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
  let nextBtn = null;
  let prevBtn = null;

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewTicketsHandler({ page: parseInt(page, 10), limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewTicketsHandler({ page: parseInt(page, 10), limit: 50 });
    });
  }

  viewTicketsHandler({ page: 1, limit: 50 });
});
