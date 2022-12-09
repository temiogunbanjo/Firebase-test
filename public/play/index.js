const GameOptions = {};

const autoPlayBots = [];

const errorHandler = (error = {}, byBot = false) => {
  console.log("Errrrr");
  console.log(error);
  const message = error.responsemessage || error.message;
  if (!byBot) alert(message);
  else console.log(message);
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

function fetchAndSaveUser(token) {
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
  // debugger;
  const ballContainer = document.getElementById("ball-container");
  const gameTitle = document.getElementById("game-name");
  const poolBarSection = document.getElementById("pool-bar-section");
  const betTypeSelectionMenu = document.getElementById("bet-type-selector");
  const boosterSelectionMenu = document.getElementById("booster-selector");
  const resultTypeSelectionMenu = document.getElementById("result-selector");
  const overSelectionMenu = document.getElementById("over-type-selector");
  const underSelectionMenu = document.getElementById("under-type-selector");

  const { name, lotteryId, gameId, currentPoolAmount, totalFundPool } = game;
  const { gameCount, category } = game.Lottery;
  let {
    betOptions = "[]",
    boosterOptions = "[]",
    resultOptions = "[]",
    overOptions = "[]",
    underOptions = "[]",
  } = game.Lottery;

  betOptions = JSON.parse(betOptions);
  boosterOptions = JSON.parse(boosterOptions);
  resultOptions = JSON.parse(resultOptions);
  overOptions = JSON.parse(overOptions);
  underOptions = JSON.parse(underOptions);

  // SAVE GAME INFO
  GameOptions.lotteryId = lotteryId;
  GameOptions.gameId = gameId;
  GameOptions.betOptions = betOptions;
  GameOptions.boosterOptions = boosterOptions;
  GameOptions.resultOptions = resultOptions;
  GameOptions.overOptions = overOptions;
  GameOptions.underOptions = underOptions;
  GameOptions.gameCount = gameCount;

  const poolProgressPercent = totalFundPool
    ? (Number(currentPoolAmount) / Number(totalFundPool)) * 100
    : null;

  gameTitle.innerHTML = `<span>Game: ${name}</span> <span class="status-indicator">${category}</span>`;
  poolBarSection.innerHTML = poolProgressPercent !== null
    && poolProgressPercent >= 0
      ? `<progress value='${poolProgressPercent}' max="100" style="width: 96%; margin: 0 auto; display: block">
  ${poolProgressPercent}%
</progress>`
      : "";

  const balls = [];
  for (let i = 1; i <= gameCount; i++) {
    balls.push(i);
  }

  ballContainer.innerHTML = '';
  betTypeSelectionMenu.innerHTML = '';
  boosterSelectionMenu.innerHTML = '';
  resultTypeSelectionMenu.innerHTML = '';
  overSelectionMenu.innerHTML = '';
  underSelectionMenu.innerHTML = '';

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

  betOptions.forEach((each, index) => {
    const option = document.createElement("option");
    option.setAttribute("value", each.name);
    option.textContent = each.name;
    if (index === 0) {
      option.setAttribute("selected", true);
    }

    betTypeSelectionMenu.appendChild(option);
  });

  boosterOptions.forEach((each, index) => {
    const option = document.createElement("option");
    option.setAttribute("value", each);
    option.textContent = each;
    if (index === 0) {
      option.setAttribute("selected", true);
    }

    boosterSelectionMenu.appendChild(option);
  });

  resultOptions.forEach((each, index) => {
    const option = document.createElement("option");
    option.setAttribute("value", each);
    option.textContent = each;
    if (index === 0) {
      option.setAttribute("selected", true);
    }

    resultTypeSelectionMenu.appendChild(option);
  });

  overOptions.forEach((each) => {
    const option = document.createElement("option");
    option.setAttribute("value", each);
    option.textContent = each;

    overSelectionMenu.appendChild(option);
  });

  underOptions.forEach((each) => {
    const option = document.createElement("option");
    option.setAttribute("value", each);
    option.textContent = each;

    underSelectionMenu.appendChild(option);
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

function createTicket(ticket, byBot = false) {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/create-ticket`;

  const body = JSON.stringify({
    gameId: ticket.gameId,
    totalStakedAmount: ticket.totalStakedAmount,
    winningRedemptionMethod: ticket.winningRedemptionMethod || "wallet",
    sourceWallet: ticket.sourceWallet,
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
              gameId: globals.ticket.gameId,
              lotteryId: globals.ticket.lotteryId,
              betSlips: [],
            };
            updateUI();
            if (!byBot) alert("Ticket created succesfully");
            else {
              console.log("Ticket created succesfully");
            }
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

function start() {
  const mainBalanceElement = document.querySelector("#wallet-balance");
  // const commissionBalanceElement = document.querySelector("#commission-balance");

  const queryString = window.location.search.replace("?", "");
  if (!globals.token || !queryString) {
    window.location.replace("/");
  } else {
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

  fetchUserBalance(mainBalanceElement, "main");
}

async function autoPlayer() {
  const playersPane = document.querySelector("#play-tab");

  const generateRandomizedTicket = async (botId, amount) => {
    const numberOfSlips = generateRandomNumber(1, 5);
    const betSlips = [];

    for (let i = 0; i < numberOfSlips; i++) {
      const betType =
        GameOptions.betOptions[
          generateRandomNumber(0, GameOptions.betOptions.length - 1)
        ];
      const booster =
        GameOptions.boosterOptions[
          generateRandomNumber(0, GameOptions.boosterOptions.length - 1)
        ];
      const resultType =
        GameOptions.resultOptions[
          generateRandomNumber(0, GameOptions.resultOptions.length - 1)
        ];
      let selections = new Set();

      // console.log(globals.BET_TYPE_MINIMUM_SELECTION[betType?.name]);

      for (
        let j = 1;
        j <= (globals.BET_TYPE_MINIMUM_SELECTION[betType?.name] || 0);
        j++
      ) {
        selections.add(generateRandomNumber(1, Number(GameOptions.gameCount)));
      }

      betSlips.push({
        betType: betType?.name || "",
        booster: booster || "",
        resultType: resultType || "",
        amount: amount / numberOfSlips,
        selections: Array.from(selections).join("-"),
      });
    }

    const retTicket = {
      gameId: GameOptions.gameId,
      lotteryId: GameOptions.lotteryId,
      winningRedemptionMethod: !globals.user.isAgent ? "wallet" : "dps",
      sourceWallet: "mainWallet",
      betSlips,
    };

    // console.log(retTicket, globals.user);

    return retTicket;
  };

  const fetchPotentialWinningForBot = async (ticket) => {
    try {
      const apiUrl = `${
        globals[globals.environment].apiBaseUrl
      }/game/ticket/get-potential-winning`;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(ticket),
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
        const { data } = result?.data;

        return data;
      } else {
        errorHandler(result, true);
        return null;
      }
    } catch (error) {
      errorHandler(error, true);
      return null;
    }
  };

  let numberOfPlayers = prompt("Enter number of players:");
  let amountPerTicket = prompt("Enter amount per ticket:");

  // console.log({
  //   numberOfPlayers,
  //   amountPerTicket,
  //   GameOptions,
  // });

  numberOfPlayers = numberOfPlayers || 1;
  amountPerTicket = amountPerTicket || 10;

  numberOfPlayers = parseInt(numberOfPlayers);
  amountPerTicket = parseInt(amountPerTicket);

  const MIN_INTERVAL_SECONDS = 20;
  const MAX_INTERVAL_SECONDS = 60;

  playersPane.innerHTML = '';

  for (let i = 1; i <= numberOfPlayers; i++) {
    console.log(`Creating robot ${i}`);
    // INTERVAL TO CREATE EACH TICKET
    const botProps = {
      ticket: globals.ticket,
    };

    const interval = generateRandomNumber(
      MIN_INTERVAL_SECONDS,
      MAX_INTERVAL_SECONDS
    );

    const botClock = setInterval(() => {
      console.log(`Bot ${i} creating Ticket`);
      document.querySelector(`#bot-${i}`).classList.toggle('active', true);

      generateRandomizedTicket(i, amountPerTicket).then(async (botTicket) => {
        botTicket.betSlips = JSON.stringify(botTicket.betSlips);
        const data = await fetchPotentialWinningForBot(botTicket);
        if (data) {
          // console.log(data);
          botTicket.betSlips = JSON.parse(data.betSlips);
          botTicket.totalStakedAmount = data.totalStakedAmount;

          createTicket(botTicket, true);
        }
      }).finally(() => {
        document.querySelector(`#bot-${i}`).ontransitionend = (ev) => {
          ev.target.classList.toggle('active', false);
        };
      });
    }, interval * 1000);

    botProps.clock = botClock;
    autoPlayBots.push(botProps);
    // <span class="user">B1</span>
    const botElement = document.createElement('SPAN');
    botElement.classList.add('user');
    botElement.textContent = `B${i}`;
    botElement.id = `bot-${i}`;

    playersPane.appendChild(botElement);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // debugger;
  const addSlipButton = document.getElementById("add-slip");
  const autoplaySwitch = document.getElementById("autoplay-switch");
  const createTicketButton = document.getElementById("create-ticket-button");

  const betTypeSelectionMenu = document.getElementById("bet-type-selector");
  const boosterSelectionMenu = document.getElementById("booster-selector");
  const resultTypeSelectionMenu = document.getElementById("result-selector");
  const overSelectionMenu = document.getElementById("over-type-selector");
  const underSelectionMenu = document.getElementById("under-type-selector");
  const amountInput = document.getElementById("amount-input");

  autoplaySwitch.addEventListener("change", async (ev) => {
    console.log(ev.target.checked);
    if (ev.target.checked) await autoPlayer();
    else {
      autoPlayBots.forEach((bot, index) => {
        console.log(`Stopping bot ${index + 1}`);
        clearInterval(bot.clock);
      });

      const countToRemove = autoPlayBots.length;
      for (i = 0; i < countToRemove; i++) {
        console.log(`Destroying bot ${i + 1}`);
        autoPlayBots.pop();
      }
    }
  });

  addSlipButton.addEventListener("click", (ev) => {
    if (
      (validateInputs([betTypeSelectionMenu, amountInput]) &&
        Object.keys(globals.currentSelections).length > 0) ||
      validateInputs([overSelectionMenu, amountInput]) ||
      validateInputs([underSelectionMenu, amountInput])
    ) {
      const slip = {
        amount: amountInput.value,
        selections: Object.keys(globals.currentSelections).join("-"),
        betType:
          overSelectionMenu.value !== "" || underSelectionMenu.value !== ""
            ? ""
            : betTypeSelectionMenu.value,
        booster: boosterSelectionMenu.value,
        resultType: resultTypeSelectionMenu.value,
        overUnder: (() => {
          if (overSelectionMenu.value !== "") {
            return {
              over: overSelectionMenu.value,
            };
          } else if (underSelectionMenu.value !== "") {
            return {
              under: underSelectionMenu.value,
            };
          } else {
            return null;
          }
        })(),
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
    const walletSelector = document.querySelector(
      "#play-tab-content input[name='sourceWallet']:checked"
    );
    const wrmSelector = document.querySelector(
      "#play-tab-content input[name='winningRedemptionMethod']:checked"
    );
    globals.ticket.sourceWallet = walletSelector.value;
    globals.ticket.winningRedemptionMethod = wrmSelector.value;

    createTicket(globals.ticket);
  });

  start();

  setInterval(() => {
    start();
  }, 20 * 1000);
});
