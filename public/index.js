function showHideDiv(divId, show) {
  const div = document.querySelector("#" + divId);
  if (show) {
    div.style = "display: visible";
  } else {
    div.style = "display: none";
  }
}

// Add a message to the messages element.
function appendMessage(payload) {
  console.log(payload);
  const messagesElement = document.querySelector("#messages");
  console.log(messagesElement);
  const dataHeaderElement = document.createElement("h5");
  const dataElement = document.createElement("pre");
  dataElement.style = "margin-left: 0; max-width: unset; width: 100%";
  dataElement.classList.add("response-pane");
  dataHeaderElement.textContent = "Received message:";
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderElement);
  messagesElement.appendChild(dataElement);
}

// Clear the messages element of all children.
function clearMessages() {
  const messagesElement = document.querySelector("#messages");
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
}

function showTabContent(tabId, cb = () => {}) {
  document.querySelectorAll(".navigation-content").forEach((content) => {
    if (content.id && content.id.includes(tabId)) {
      content.classList.toggle("hide", false);
    } else {
      content.classList.toggle("hide", true);
    }
  });

  cb();
}

const updateResponsePane = (responseElement, dataResponse, status) => {
  responseElement.textContent =
    typeof dataResponse !== "object"
      ? dataResponse
      : JSON.stringify(dataResponse, null, 2);
};

async function subscribeToNotification(deviceId) {
  try {
    console.log("Subscribing to notification...");
    // console.log(globals);
    const generalHeaders = {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals[globals.environment].apiKey,
      mode: "no-cors",
    };

    if (!globals.token) {
      return false;
    }
    const subcribeResponse = await fetch(
      `${globals[globals.environment].apiBaseUrl}/auth/notifications/subcribe`,
      {
        method: "POST",
        body: JSON.stringify({
          deviceRegToken: deviceId,
        }),
        headers: {
          ...generalHeaders,
          authorization: `Bearer ${globals.token}`,
        },
      }
    );

    let tokenData = await subcribeResponse.json();
    return tokenData;
  } catch (error) {
    return error;
  }
}

async function unsubscribeToNotification(deviceId) {
  try {
    console.log("Unsubscribing from notification...");
    // console.log(globals);
    const generalHeaders = {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals[globals.environment].apiKey,
      mode: "no-cors",
    };

    if (!globals.token) {
      return false;
    }
    const subcribeResponse = await fetch(
      `${globals[globals.environment].apiBaseUrl}/auth/notifications/subcribe`,
      {
        method: "POST",
        body: JSON.stringify({
          deviceRegToken: deviceId,
        }),
        headers: {
          ...generalHeaders,
          authorization: `Bearer ${globals.token}`,
        },
      }
    );

    let tokenData = await subcribeResponse.json();
    if (tokenData?.data) {
      console.log("Subbbbing");
    }

    console.log(tokenData);
  } catch (error) {
    return error;
  }
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

function saveUser(token) {
  console.log(globals[globals.environment]);
  const responseElement = document.querySelector("#login-form .response");
  responseElement.innerHTML = responseElement.innerHTML + "<br>Saving user...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/auth/validate-token?token=${token}`;
  fetch(apiUrl, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals[globals.environment].apiKey,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          const user = data?.data;
          console.log(user);
          globals.user = user;
          sessionStorage.setItem("user", JSON.stringify(user));
          responseElement.innerHTML =
            responseElement.innerHTML + "<br>User saved successfully!";
        } else {
          responseElement.innerHTML =
            responseElement.innerHTML + "<br>User saving failed!";
        }
      } catch (error) {
        console.log(error);
        const { status } = error;
        responseElement.innerHTML =
          responseElement.innerHTML + `<br>User saving failed:${status}!`;
      }
    })
    .catch((error) => {
      console.log(error);
      responseElement.innerHTML =
        responseElement.innerHTML + "<br>User saving failed!";
    });
}

function loginHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#login-form .response");
  const emailField = document.querySelector("#login-form input[name='email']");
  const passwordField = document.querySelector(
    "#login-form input[name='password']"
  );

  responseElement.innerHTML = "Logging in...";

  const payload = {
    email: emailField.value,
    password: passwordField.value,
  };

  const apiUrl = `${globals[globals.environment].apiBaseUrl}/auth/login`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
    // mode: "no-cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      // mode: "no-cors",
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          const { token } = data?.data;

          globals.token = token;
          localStorage.setItem("token", token);

          updateResponsePane(responseElement, data, status);
          saveUser(token);
        } else {
          updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        console.log(error);
        const { status } = error;
        updateResponsePane(responseElement, error, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

function withdrawalHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#withdrawal-form .response");
  const amountField = document.querySelector(
    "#withdrawal-form input[name='amount']"
  );
  const paymentMethodInput = document.querySelector(
    "#withdrawal-form input[name='paymentMethod']:checked"
  );

  responseElement.innerHTML = "Making withdrawal in...";
  const payload = {
    amount: amountField?.value || 0,
    paymentMethod: paymentMethodInput?.value || null,
  };

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/bank-withdrawal/initialize`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
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

function transferHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#transfer-form .response");
  const amountField = document.querySelector(
    "#transfer-form input[name='amount']"
  );
  const receipientInput = document.querySelector(
    "#transfer-form input[name='receipientId']"
  );

  const transactionPinInput = document.querySelector(
    "#transfer-form input[name='transactionPin']"
  );

  responseElement.innerHTML = "Making transfer...";
  const payload = {
    amount: amountField?.value || 0,
    transactionPin: transactionPinInput?.value || "",
    receipientId: receipientInput?.value || "",
  };

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/transfer-fund-to-user`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
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

function viewTicketsHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#ticket-container");
  const nextBtn = document.querySelector("#ticket-pagination #next-ticket-page");
  const prevBtn = document.querySelector("#ticket-pagination #prev-ticket-page");
  const pageCount = document.querySelector("#ticket-pagination #ticket-page-count");
  const pageTotal = document.querySelector("#ticket-pagination #total-ticket-pages");
  // containerElement.innerHTML = "Fetching tickets...";

  if (!options) {
    options = {
      page: parseInt(nextBtn.getAttribute("data-page"), 10) - 1 || 1,
      limit: 50
    };
  }

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-tickets/${globals.user?.userId}?page=${options.page}&limit=${options.limit}`;

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
          pageTotal.innerHTML = Math.ceil(result.data.totalCount / options.limit);
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
                  </div>
                  ${
                    ticket.status === "ongoing"
                      ? `<div class="ticket-body-row">
                          <button
                            class="w-full" onclick="createInstantResult(${ticket.ticketId})"
                            style="background-color: dodgerblue; color: white; border: none;padding: 10px;border-radius: 5px">
                            Create Instant Result
                          </button>
                        </div>`
                      : ""
                  }
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

function viewGamesHandler(ev) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#games-container");

  // containerElement.innerHTML = "Fetching tickets...";
  const d = new Date();
  const currentTime = d.toLocaleTimeString();
  const currentWeekDay = d.getDay();
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-current-game?page=1&limit=100&currentWeekDay=${currentWeekDay}`;

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
          const categoryObject = {};

          const { data } = result?.data;

          data.forEach((game) => {
            if (!categoryObject[game.Lottery.category]) {
              categoryObject[game.Lottery.category] = [game];
            } else {
              categoryObject[game.Lottery.category].push(game);
            }
          });

          console.log(categoryObject);

          containerElement.innerHTML = Object.keys(categoryObject)
            .map((category) => {
              return `<div class="game-category-container">
              <h3 class="game-category-head">${category}</h3>
              <div class="game-category-body d-flex rows">
                ${categoryObject[category]
                  .map((game) => {
                    return `
                    <div class="game-card">
                      <div class="d-flex rows align-items-center ticket-header">
                        <h3 style="margin-bottom: 0.5em">Game</h3>
                        <span
                          class="status-indicator"
                          data-status="${game.status === true ? 'won' : 'lost'}"
                        >o</span>
                      </div>
                      <small class="status-indicator" style="margin-bottom: 1em;font-weight: 600">
                        ${game.startTime} - ${game.endTime}
                      </small>

                      <div class="d-flex cols ticket-body">
                        <div class="ticket-body-row">
                          <p>
                            <span class="ticket-label">Game ID:</span>
                            <span class="ticket-value">${game.gameId}</span>
                          </p>
                          <p>
                            <span class="ticket-label">Game:</span>
                            <span
                              class="ticket-value"
                              style="text-transform: capitalize"
                            >${game.name}</span>
                          </p>
                        </div>

                        <div class="d-flex rows ticket-body-row align-items-center">
                          <a href="/play?gameId=${game.gameId}" class="custom-button">Play Game</a>
                        </div>
                      </div>
                    </div>
                    `;
                  })
                  .join("")}
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

function viewResultsHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#results-container");
  const nextBtn = document.querySelector("#results-pagination #next-results-page");
  const prevBtn = document.querySelector("#results-pagination #prev-results-page");
  const pageCount = document.querySelector("#results-pagination #page-count");
  const pageTotal = document.querySelector("#results-pagination #total-pages");

  // containerElement.innerHTML = "Fetching results...";
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-result-history?page=${options.page}&limit=${options.limit}&order=S_N:DESC`;

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
          pageTotal.innerHTML = Math.ceil(result.data.totalCount / options.limit);
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
              <div class="d-flex cols">
                <h5 class="" style="margin: 0">${result.drawName}</h5>
                <div class="d-flex rows space-between">
                  <span class="">${result.results.replace(/-/gi, ", ")}</span>
                  <span class="" style="margin-left: 20px">${
                    result.raffle
                  }</span>
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
  const navTabs = document.querySelectorAll("#navigation ul li");
  const loginForm = document.querySelector("#login-form");
  const withdrawalForm = document.querySelector("#withdrawal-form");
  const transferForm = document.querySelector("#transfer-form");
  const unsubscribeButton = document.querySelector("#unsubscribe-token");

  navTabs.forEach((tab) => {
    console.log(tab);
    tab.addEventListener("click", (ev) => {
      let cb = () => {};
      let nextBtn = null;
      let prevBtn = null;

      switch (true) {
        case ev.target.id === "view-tickets-tab":
          cb = viewTicketsHandler;
          nextBtn = document.querySelector("#ticket-pagination #next-ticket-page");
          prevBtn = document.querySelector("#ticket-pagination #prev-ticket-page");
          break;

        case ev.target.id === "view-games-tab":
          cb = viewGamesHandler;
          break;

        case ev.target.id === "view-results-tab":
          cb = viewResultsHandler;
          nextBtn = document.querySelector("#results-pagination #next-results-page");
          prevBtn = document.querySelector("#results-pagination #prev-results-page");
          break;

        default:
          break;
      }

      if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", (ev) => {
          const page = ev.target.getAttribute("data-page");
          cb({ page: parseInt(page, 10), limit: 50 });
        });

        prevBtn.addEventListener("click", (ev) => {
          const page = ev.target.getAttribute("data-page");
          cb({ page: parseInt(page, 10), limit: 50 });
        });
      }

      showTabContent(ev.currentTarget.id, cb);
    });
  });

  loginForm.addEventListener("submit", loginHandler);
  withdrawalForm.addEventListener("submit", withdrawalHandler);
  transferForm.addEventListener("submit", transferHandler);

  unsubscribeButton.addEventListener("click", () => {
    console.log("Unsubscribing...");
    // subscribeToNotification();
  });
});
