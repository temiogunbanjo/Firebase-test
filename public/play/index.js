const globals = {
  environment: "western",
  token: localStorage.getItem("token") || null,
  bet9ja: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    apiKey: "USR.Qg6bmE-oGQi9b-SxA1Vb-Sggcbw-dwlaE8-G",
  },
  western: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    apiKey: "USR.Ngu4rC-VMenpv-m251tw-rYC8Om-ryx89j-c4",
  },
  ticket: {
    betSlips: [],
  },
  currentSelections: {},
};

const errorHandler = (error = {}) => {
  console.log("Errrrr");
  console.log(error);
  const message = error.responsemessage || error.message;
  alert(message);
};

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

const validateInputs = (inputs) => {
  let result = true;
  inputs.forEach((input) => {
    if (input.value === "") {
      input.classList.toggle("input-error", true);
      result &&= false;
    } else {
      input.classList.toggle("input-error", false);
      result &&= true;
    }
  });

  return result;
};

function saveUser(token) {
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
        }
      } catch (error) {
        errorHandler(error);
        const { status } = error;
      }
    })
    .catch((error) => {
      errorHandler(error);
    });
}

const updateSelectionArea = () => {
  const selectionsContainer = document.getElementById("selection-area");
  const slipCounter = document.getElementById("slip-counter");
  const createTicketButton = document.getElementById("create-ticket-button");

  selectionsContainer.innerHTML = `${Object.keys(globals.currentSelections)
    .map((selection) => {
      return `<span class="ball circle bg-orange" style="color: white">${selection}</span>`;
    })
    .join("")}`;

  slipCounter.textContent = `${globals.ticket.betSlips.length} Slip`;

  if (globals.ticket.betSlips.length === 0) {
    createTicketButton.setAttribute("disabled", true);
  } else {
    createTicketButton.removeAttribute("disabled");
  }
};

const updateUI = () => {
  updateSelectionArea();
};

function populateGameArea(game) {
  const ballContainer = document.getElementById("ball-container");
  const gameTitle = document.getElementById("game-name");
  const betTypeSelectionMenu = document.getElementById("bet-type-selector");
  const boosterSelectionMenu = document.getElementById("booster-selector");
  const resultTypeSelectionMenu = document.getElementById("result-selector");

  const { name } = game;
  const { gameCount, resultCount, category } = game.Lottery;
  let {
    betOptions = "[]",
    boosterOptions = "[]",
    resultOptions = "[]",
  } = game.Lottery;

  betOptions = JSON.parse(betOptions);
  boosterOptions = JSON.parse(boosterOptions);
  resultOptions = JSON.parse(resultOptions);

  gameTitle.innerHTML = `<span>Game: ${name}</span> <span class="status-indicator">${category}</span>`;

  const balls = [];
  for (let i = 1; i <= gameCount; i++) {
    balls.push(i);
  }

  balls.forEach((each) => {
    const aBallElement = document.createElement("SPAN");
    aBallElement.classList.add("ball", "circle", "bg-blue");
    aBallElement.style.color = "white";
    aBallElement.setAttribute("data-value", each);
    aBallElement.textContent = each;

    aBallElement.addEventListener("click", (ev) => {
      const ballNumber = ev.currentTarget.getAttribute("data-value");
      if (!globals.currentSelections[ballNumber]) {
        ev.currentTarget.classList.add("selected");
        globals.currentSelections[ballNumber] = ballNumber;
      } else {
        ev.currentTarget.classList.remove("selected");
        delete globals.currentSelections[ballNumber];
      }

      // console.log(globals.currentSelections);
      updateSelectionArea();
    });

    ballContainer.appendChild(aBallElement);
  });

  // console.log(globals.ticket);
  // console.log({
  //   name,
  //   gameCount,
  //   resultCount,
  //   category,
  //   betOptions,
  //   boosterOptions,
  //   resultOptions,
  // });

  betOptions.forEach((each) => {
    const option = document.createElement("option");
    option.setAttribute("value", each.name);
    option.textContent = each.name;

    betTypeSelectionMenu.appendChild(option);
  });

  boosterOptions.forEach((each) => {
    const option = document.createElement("option");
    option.setAttribute("value", each);
    option.textContent = each;

    boosterSelectionMenu.appendChild(option);
  });

  resultOptions.forEach((each) => {
    const option = document.createElement("option");
    option.setAttribute("value", each);
    option.textContent = each;

    resultTypeSelectionMenu.appendChild(option);
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
  }/game/fetch-current-game?page=1&limit=100&endTime=${currentTime}&currentWeekDay=${currentWeekDay}`;
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

          // console.log(categoryObject);

          containerElement.innerHTML = Object.keys(categoryObject)
            .map((category) => {
              return `<div class="game-category-container">
                <h3 class="game-category-head">${category}</h3>
                <div class="game-category-body d-flex rows">
                  ${categoryObject[category]
                    .map((game) => {
                      return `
                      <div class="game-card">
                      <div
                        class="d-flex rows align-items-center ticket-header"
                        style="margin-bottom: 1em"
                      >
                        <h3 style="margin-bottom: 0.5em">Game</h3>
                        <span
                          class="status-indicator"
                          data-status="${game.status === true ? "won" : "lost"}"
                          >o</span
                        >
                      </div>
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
                              >${game.name}</span
                            >
                          </p>
                        </div>
    
                        <div class="d-flex rows ticket-body-row align-items-center">
                            <button>Play Game</button>
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

function fetchGameData(gameId) {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-game/${gameId}`;
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
          globals.ticket.gameId = data.gameId;
          globals.ticket.lotteryId = data.lotteryId;
          populateGameArea(data);
        }
      } catch (error) {
        errorHandler(error);
        // const { responsemessage, status } = error;
        // updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      errorHandler(error);
      // updateResponsePane(containerElement, error, "error");
    });
}

function createTicket(ticket) {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/create-ticket`;
  const body = JSON.stringify({
    gameId: ticket.gameId,
    totalStakedAmount: ticket.totalStakedAmount,
    winningRedemptionMethod: "wallet",
    sourceWallet: "mainWallet",
    betSlips: JSON.stringify(ticket.betSlips),
  });

  console.log({ cre: JSON.parse(body) });

  fetch(apiUrl, {
    method: "POST",
    body,
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

          // totalPotValueElement.textContent = data.totalPotentialWinning;
          // totalStkValueElement.textContent = data.totalStakedAmount;

          // globals.ticket.betSlips = JSON.parse(data.betSlips);

          console.log({ createTicketResponse: data, ticket: globals.ticket });
          if (data?.ticketId) {
            globals.ticket = {
              betSlips: [],
            };
            updateUI();
            alert("Ticket created succesfully");
          }

          // globals.ticket.gameId = data.gameId;
          // globals.ticket.lotteryId = data.lotteryId;
          // populateGameArea(data);
        }
      } catch (error) {
        errorHandler(error);
        // const { responsemessage, status } = error;
        // updateResponsePane(containerElement, responsemessage, status);
      } finally {
        updateUI();
      }
    })
    .catch((error) => {
      errorHandler(error);
      // updateResponsePane(containerElement, error, "error");
    });
}

function fetchPotentialWinning(ticket) {
  const totalPotValueElement = document.getElementById("total-potential-value");
  const totalStkValueElement = document.getElementById(
    "total-staked-amount-value"
  );

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/ticket/get-potential-winning`;
  const body = JSON.stringify({
    lotteryId: ticket.lotteryId,
    betSlips: JSON.stringify(ticket.betSlips),
  });
  console.log(body);

  fetch(apiUrl, {
    method: "POST",
    body,
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

          totalPotValueElement.textContent = data.totalPotentialWinning;
          totalStkValueElement.textContent = data.totalStakedAmount;

          globals.ticket.betSlips = JSON.parse(data.betSlips);
          globals.ticket.totalStakedAmount = data.totalStakedAmount;

          console.log({ potentialWinningData: data, ticket: globals.ticket });
        } else {
          errorHandler(result);
        }
      } catch (error) {
        errorHandler(error);
        // const { responsemessage, status } = error;
        // updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      errorHandler(error);
      // updateResponsePane(containerElement, error, "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const addSlipButton = document.getElementById("add-slip");
  const createTicketButton = document.getElementById("create-ticket-button");
  const betTypeSelectionMenu = document.getElementById("bet-type-selector");
  const boosterSelectionMenu = document.getElementById("booster-selector");
  const resultTypeSelectionMenu = document.getElementById("result-selector");
  const amountInput = document.getElementById("amount-input");

  addSlipButton.addEventListener("click", (ev) => {
    if (
      validateInputs([
        betTypeSelectionMenu,
        // boosterSelectionMenu,
        // resultTypeSelectionMenu,
        amountInput,
      ]) &&
      Object.keys(globals.currentSelections).length > 0
    ) {
      const slip = {
        amount: amountInput.value,
        selections: Object.keys(globals.currentSelections).join("-"),
        betType: betTypeSelectionMenu.value,
        booster: boosterSelectionMenu.value,
        resultType: resultTypeSelectionMenu.value,
      };

      globals.ticket.betSlips.push(slip);

      // reset Options
      globals.currentSelections = {};
      document.querySelectorAll("#ball-container .ball").forEach((ball) => {
        ball.classList.toggle("selected", false);
      });
    }

    fetchPotentialWinning(globals.ticket);
    console.log(globals.ticket);
    updateUI();
  });

  createTicketButton.addEventListener("click", (ev) => {
    createTicket(globals.ticket);
  });

  const queryString = window.location.search.replace("?", "");
  if (!globals.token || !queryString) {
    window.location.replace("/");
  } else {
    saveUser(globals.token);
    const queryParams = {};
    queryString.split("&").forEach((each) => {
      const [key, value] = each.split("=");
      queryParams[key] = value;
    });

    console.log({ query: queryParams });
    if (queryParams.gameId) {
      fetchGameData(queryParams.gameId);
    } else {
      alert("No game ID");
    }
  }
});
