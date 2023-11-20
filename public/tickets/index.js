let currentPage = 1;

const bankNameTable = {
  "058": "Guaranty Trust Bank",
  "044": "Access Bank",
};

const showResults = (results, category) => {
  const numberColors = {
    'six49': {
      ballCount: 49,
      colors: ["red", "yellow", "blue"],
      getBallColor(number) {
        if (number === this.ballCount) return "black";
        let b = 1;
        const a = Array.from({ length: this.ballCount - 1 }, () => b++);

        for (let i = 0; i < a.length; i++) {
          const element = a[i];
          const overShoot = Math.floor(i / this.colors.length);
          const colorIndex = overShoot >= 1 ? i - this.colors.length * overShoot : i;
          if (element === number) return this.colors[colorIndex];
        };
      }
    },
    'lotto-continental': {
      ballCount: 90,
      colors: ["red", "blue", "purple", "green", "crimson", "gold", "cyan", "rebeccapurple"],
      getBallColor(_, i) {
        switch (true) {
          case i >= 0 && i < 5:
            return this.colors[0];

          case i >= 5 && i < 10:
            return this.colors[1];

          case i >= 10 && i < 15:
            return this.colors[2];

          case i >= 15 && i < 20:
            return this.colors[3];

          case i >= 20 && i < 25:
            return this.colors[4];

          case i >= 25 && i < 30:
            return this.colors[5];

          case i >= 30 && i < 35:
            return this.colors[6];

          case i >= 35 && i < 40:
            return this.colors[7];
        
          default:
            return this.colors[i];
        }
      }
    },
    '5of90': {
      ballCount: 90,
      colors: ["red", "cyan", "blue", "green", "crimson", "gold"],
      getBallColor(_, i) {
        switch (true) {
          case i >= 0 && i < 5:
            return this.colors[0];

          case i >= 5 && i < 10:
            return this.colors[1];

          case i >= 10 && i < 15:
            return this.colors[2];

          case i >= 15 && i < 20:
            return this.colors[3];

          case i >= 20 && i < 25:
            return this.colors[4];
        
          default:
            return this.colors[i];
        }
      }
    }
  }

  results = results.split("-").map((e, i) => {
    const color = numberColors?.[category]?.getBallColor(Number(e), i);
    return `<span style="font-size: 28px; font-weight: 800; color: ${color}; text-shadow: 1px 1px 3px #999">${e}</span>`;
  });

  console.log(results, category);
  const content = document.createElement("div");
  content.setAttribute("style", "font-size: 28px; font-weight: 700; padding: 10px; display: flex; flex-direction: row; justify-content: center; align-items:center; flex-wrap: wrap; max-width: 100%")
  content.innerHTML = results.join("-");
  createModal(content);
};

function createTicketCard(ticket) {
  const bankDetails = ticket.details ? JSON.parse(ticket.details) : {};
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
          <p>
            <span class="ticket-label">W.R.M.:</span>
            <span class="ticket-value">${ticket.winningRedemptionMethod.toUpperCase()}</span>
          </p>
          ${
            ticket.winningRedemptionMethod === "bank"
              ? `
              <details style="margin-top: 0.6em; font-size: 14px">
                <summary style="color: dodgerblue">Bank Info</summary>
                <p class="d-flex cols" style="background-color: dodgerblue; color: white; padding: 10px;border-radius: 5px;">
                  <span>Bank Code: ${
                    bankNameTable[bankDetails?.bankCode] ||
                    bankDetails?.bankCode ||
                    "--"
                  }</span>
                  <span>Account Number: ${bankDetails?.accountNumber}</span>
                  <span>Account Name: ${bankDetails?.accountName}</span>
                </p>
              </details>
              `
              : ""
          }
          <p style="margin-top: 1.5em">
            <div class="ticket-label" style="font-weight:600">Bet Slips:</div>
            <div class="ticket-slip-container">${JSON.parse(ticket.betSlips)
              .map((slip) => {
                const slipWinStatusClass = (() => {
                  if (slip.hasWon === true) {
                    return "won";
                  }

                  if (slip.hasWon === false) {
                    return "lost";
                  }

                  return "";
                })();

                return `
                  <div class="ticket-slip ${slipWinStatusClass}" style="line-height: 1.3">
                    ${slip.betType} / ${slip.booster} / ${
                  slip.resultType
                } – N${parseFloat(slip.amount).toFixed(2)}
                    <br/>
                    ${
                      slip.selections
                        ? slip.selections
                            ?.split("-")
                            .map(
                              (e) =>
                                `<span style="${
                                  !!ticket.Gameresult?.results &&
                                  ticket.Gameresult?.results
                                    .split("-")
                                    .map((a) => parseInt(a, 10))
                                    .includes(parseInt(e, 10))
                                    ? "font-size: 16px; font-weight: 700; color: orange"
                                    : ""
                                }">${e}</span>`
                            )
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
          ${
            !!ticket.unclaimedWinning
              ? `
              <details style="margin-top: 0.6em; font-size: 14px">
                <summary style="color: dodgerblue">Bank Info</summary>
                <p class="d-flex cols" style="background-color: dodgerblue; color: white; padding: 10px;border-radius: 5px;">
                  <span>Unclaimed DPS Winning: ${
                    ticket.unclaimedWinning || "--"
                  }</span>
                </p>
              </details>
              `
              : ""
          }
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
          ${
            !!ticket.Gameresult
              ? `<div class="d-flex bg-orange" style="flex-direction: column; border-radius: 8px; padding: 10px; color: white" onclick="showResults('${ticket.Gameresult?.results}', '${ticket.Game?.Lottery?.category}')">
                  <div class="fw-700" style="line-height: 1.5">Results:</div>
                  <div>${ticket.Gameresult?.results}</div>
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
    const result = await fetchAPI({
      url: apiUrl,
      method: "post",
      data: {
        ticketId,
      },
    });

    const { status } = result;

    if (result && result.data) {
      // const { data } = result;
      const data = result?.data?.data;
      console.log(data);
      viewTicketsHandler({ page: currentPage });
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
    const result = await fetchAPI({
      url: apiUrl,
      method: "delete",
    });

    // const result = await response.json();
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
  } else {
    options = {
      page: 1,
      limit: 50,
      ...options,
    };
  }

  if (!globals.user?.userId) {
    window.location.replace("/");
  }

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-tickets/${globals.user?.userId}?page=${options.page}&limit=${
    options.limit
  }`;

  fetchAPI({
    url: apiUrl,
    method: "GET",
  })
    .then(async (result) => {
      try {
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
  const apiUrl = `${baseUrl}/search?game=${game}&selections=${selections}&startDate=${startDate}&endDate=${endDate}`;

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

  fetchAPI({
    url: apiUrl,
    method: "GET",
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;
          // console.log(data);

          const { betTypes = [], resultTypes = [], boosters = [] } = data;

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
        // const { responsemessage, status } = error;
        // updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      // updateResponsePane(containerElement, error, "error");
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
  }, 0.5 * 60 * 1000);
});
