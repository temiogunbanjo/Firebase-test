const GameOptions = {};

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

  fetchAPI({
    url: apiUrl,
  })
    .then(async (result) => {
      try {
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
  const saveTicketButton = document.getElementById("save-ticket-button");

  selectionsContainer.innerHTML = `${Object.entries(globals.currentSelections)
    .map(([eventId, { betType }]) => {
      return `<span class="ball circle bg-orange" style="color: white">${betType}</span>`;
    })
    .join("")}`;

  slipCounter.textContent = `${globals.ticket.betSlips.length} Slip`;

  if (globals.ticket.betSlips.length === 0) {
    createTicketButton.setAttribute("disabled", true);
    saveTicketButton.setAttribute("disabled", true);
  } else {
    createTicketButton.removeAttribute("disabled");
    saveTicketButton.removeAttribute("disabled");
  }
};

const updateUI = () => {
  updateSelectionArea();
};

function populateEventArea(events) {
  const ballContainer = document.getElementById("event-container");
  const gameTitle = document.getElementById("game-name");
  const poolBarSection = document.getElementById("pool-bar-section");
  const betTypeSelectionMenu = document.getElementById("bet-type-selector");
  const boosterSelectionMenu = document.getElementById("booster-selector");
  const resultTypeSelectionMenu = document.getElementById("result-selector");
  const overSelectionMenu = document.getElementById("over-type-selector");
  const underSelectionMenu = document.getElementById("under-type-selector");

  // const { gameCount, category } = events.Lottery;
  // let {
  //   betOptions = "[]",
  //   boosterOptions = "[]",
  //   resultOptions = "[]",
  //   overOptions = "[]",
  //   underOptions = "[]",
  // } = event.Lottery;

  // betOptions = JSON.parse(betOptions);
  // boosterOptions = JSON.parse(boosterOptions);
  // resultOptions = JSON.parse(resultOptions);
  // overOptions = JSON.parse(overOptions);
  // underOptions = JSON.parse(underOptions);

  // SAVE GAME INFO
  // GameOptions.lotteryId = lotteryId;
  // GameOptions.gameId = gameId;
  // GameOptions.betOptions = betOptions.filter((each) => each !== "");
  // GameOptions.boosterOptions = boosterOptions.filter((each) => each !== "");
  // GameOptions.resultOptions = resultOptions.filter((each) => each !== "");
  // GameOptions.overOptions = overOptions.filter((each) => each !== "");
  // GameOptions.underOptions = underOptions.filter((each) => each !== "");
  // GameOptions.gameCount = gameCount;

  // const poolProgressPercent = totalFundPool
  //   ? (Number(currentPoolAmount) / Number(totalFundPool)) * 100
  //   : null;

  //   gameTitle.innerHTML = `<span>Game: ${name}</span> <span class="status-indicator">${category}</span>`;
  //   poolBarSection.innerHTML =
  //     poolProgressPercent !== null && poolProgressPercent >= 0
  //       ? `<progress value='${poolProgressPercent}' max="100" style="width: 96%; margin: 0 auto; display: block">
  //   ${poolProgressPercent}%
  // </progress>`
  //       : "";

  // const balls = [];
  // for (let i = 1; i <= gameCount; i++) {
  //   balls.push(i);
  // }

  // ballContainer.innerHTML = "";
  betTypeSelectionMenu.innerHTML = "";
  boosterSelectionMenu.innerHTML = "";
  resultTypeSelectionMenu.innerHTML = "";
  overSelectionMenu.innerHTML = "";
  underSelectionMenu.innerHTML = "";

  events.forEach((each) => {
    let { EventOptions } = each;
    EventOptions = deepMerge(EventOptions[0], EventOptions[1] || {});

    const aBallElement = document.createElement("DIV");
    const titleWrapElement = document.createElement("DIV");
    const titleElement = document.createElement("h3");
    const timeContainer = document.createElement("span");
    const leagueNameElement = document.createElement("DIV");
    const optionsContainer = document.createElement("DIV");

    titleElement.textContent = `${each?.HomeTeam?.alias?.toUpperCase()} vs ${each?.AwayTeam?.alias?.toUpperCase()}`;
    leagueNameElement.textContent = `${each?.HomeTeam?.League?.name}`;
    timeContainer.textContent = `Starts on ${new Date(
      each?.eventDate
    ).toLocaleString()}`;

    aBallElement.classList.add("event");
    titleWrapElement.classList.add(
      "d-flex",
      "rows",
      "space-between",
      "align-items-center"
    );
    timeContainer.classList.add("status-indicator");
    timeContainer.setAttribute("data-status", "none");
    timeContainer.style.fontSize = "14px";
    aBallElement.style.color = "black";
    titleElement.style.marginBottom = "0px";
    titleElement.style.marginTop = "0px";
    titleElement.style.marginRight = "10px";
    titleWrapElement.style.paddingTop = "1em";
    leagueNameElement.style.margin = "5px 0 10px";
    leagueNameElement.style.fontSize = "14px";
    aBallElement.style.padding = "20px";

    Object.entries(EventOptions).forEach(([key, value]) => {
      // console.log(key, value);
      const isValidKey = ![
        "id",
        "eventOptionId",
        "eventId",
        "category",
        "status",
        "deleted",
        "createdAt",
        "updatedAt",
      ].includes(key);

      if (isValidKey && value) {
        const optionBtn = document.createElement("button");
        optionBtn.setAttribute("data-event", each.eventId);
        optionBtn.setAttribute("data-key", key);
        optionBtn.setAttribute("data-value", value);
        optionBtn.textContent = key;

        optionBtn.addEventListener("click", (ev) => {
          const eventId = ev.currentTarget.getAttribute("data-event");
          const betType = ev.currentTarget.getAttribute("data-key");
          // const betTypeValue = ev.currentTarget.getAttribute("data-value");

          if (!globals.currentSelections[eventId]) {
            ev.currentTarget.classList.add("selected");
            globals.currentSelections[eventId] = {
              betType,
            };
          } else {
            document
              .querySelectorAll(`button[data-event="${eventId}"]`)
              .forEach((el) => el.classList.remove("selected"));
            ev.currentTarget.classList.remove("selected");
            delete globals.currentSelections[eventId];
          }

          console.log(globals.currentSelections);
          updateSelectionArea();
        });

        optionsContainer.appendChild(optionBtn);
      }
    });

    titleWrapElement.appendChild(titleElement);
    titleWrapElement.appendChild(timeContainer);
    aBallElement.appendChild(titleWrapElement);
    aBallElement.appendChild(leagueNameElement);
    aBallElement.appendChild(optionsContainer);

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
  // debugger;

  // betOptions.unshift("");
  // betOptions.forEach((each, index) => {
  //   const option = document.createElement("option");
  //   option.setAttribute("value", each.name);
  //   option.textContent = each.name;
  //   if (index === 1) {
  //     option.setAttribute("selected", true);
  //   }

  //   betTypeSelectionMenu.appendChild(option);
  // });

  // boosterOptions.unshift("");
  // boosterOptions.forEach((each, index) => {
  //   const option = document.createElement("option");
  //   option.setAttribute("value", each);
  //   option.textContent = each;
  //   if (index === 1) {
  //     option.setAttribute("selected", true);
  //   }

  //   boosterSelectionMenu.appendChild(option);
  // });

  // resultOptions.unshift("");
  // resultOptions.forEach((each, index) => {
  //   const option = document.createElement("option");
  //   option.setAttribute("value", each);
  //   option.textContent = each;
  //   if (index === 1) {
  //     option.setAttribute("selected", true);
  //   }

  //   resultTypeSelectionMenu.appendChild(option);
  // });

  // overOptions.unshift("");
  // overOptions.forEach((each) => {
  //   const name = typeof each === "object" ? each?.name : each;
  //   const value = typeof each === "object" ? each?.value : each;
  //   const formattedNamePrefix =
  //     name.split(" ")?.[1]?.replace(/[)(]/gi, "") || "";

  //   const option = document.createElement("option");
  //   option.setAttribute("value", value);
  //   option.setAttribute("data-prefix", formattedNamePrefix);
  //   option.textContent = name;

  //   overSelectionMenu.appendChild(option);
  // });

  // underOptions.unshift("");
  // underOptions.forEach((each) => {
  //   const name = typeof each === "object" ? each?.name : each;
  //   const value = typeof each === "object" ? each?.value : each;
  //   const formattedNamePrefix =
  //     name.split(" ")?.[1]?.replace(/[)(]/gi, "") || "";

  //   const option = document.createElement("option");
  //   option.setAttribute("value", value);
  //   option.setAttribute("data-prefix", formattedNamePrefix);
  //   option.textContent = name;

  //   underSelectionMenu.appendChild(option);
  // });
}

function fetchEvents() {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-events?timeline=upcoming&eventType=real-sport&order=eventDate:DESC`;

  fetchAPI({
    url: apiUrl,
    method: "get",
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;
          console.log(data);
          // globals.ticket.eventId = data.eventId;
          // globals.ticket.lotteryId = data.lotteryId;
          populateEventArea(data);
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
  }/ticket/create-ticket`;

  const body = {
    productId: ticket.productId,
    totalStakedAmount: ticket.totalStakedAmount,
    winningRedemptionMethod: ticket.winningRedemptionMethod || "wallet",
    sourceWallet: ticket.sourceWallet,
    bookingCode: ticket.bookingCode,
    betSlips: JSON.stringify(ticket.betSlips),
    paymentConfigs: JSON.stringify(ticket.paymentConfigs),
  };

  console.log({ cre: body });

  fetchAPI({
    url: apiUrl,
    method: "POST",
    data: body,
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;

          // totalPotValueElement.textContent = data.totalPotentialWinning;
          // totalStkValueElement.textContent = data.totalStakedAmount;

          // globals.ticket.betSlips = JSON.parse(data.betSlips);

          console.log({ createTicketResponse: data, ticket: globals.ticket });
          if (data?.ticketId) {
            globals.ticket = {
              productId: globals.ticket.productId,
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
          // populateEventArea(data);
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

function saveTicket(ticket, byBot = false) {
  const apiUrl = `${globals[globals.environment].apiBaseUrl}/game/save-ticket`;

  const body = {
    gameId: ticket.gameId,
    totalStakedAmount: ticket.totalStakedAmount,
    winningRedemptionMethod: ticket.winningRedemptionMethod || "wallet",
    sourceWallet: ticket.sourceWallet,
    betSlips: JSON.stringify(ticket.betSlips),
  };

  console.log({ cre: body });

  fetchAPI({
    url: apiUrl,
    method: "POST",
    data: body,
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;

          // totalPotValueElement.textContent = data.totalPotentialWinning;
          // totalStkValueElement.textContent = data.totalStakedAmount;

          // globals.ticket.betSlips = JSON.parse(data.betSlips);

          console.log({ saveTicketResponse: data, ticket: globals.ticket });

          if (data?.ticketId) {
            globals.ticket = {
              gameId: globals.ticket.gameId,
              lotteryId: globals.ticket.lotteryId,
              betSlips: [],
            };

            updateUI();

            if (!byBot) {
              alert(
                `Ticket saved succesfully.Use booking code: ${data.bookingCode}`
              );
            } else {
              console.log("Ticket saved succesfully");
            }
          }
        }
      } catch (error) {
        errorHandler(error);
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
  const amountInput = document.getElementById("amount-input");
  const totalPotValueElement = document.getElementById("total-potential-value");
  const totalStkValueElement = document.getElementById(
    "total-staked-amount-value"
  );

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/ticket/fetch-potential-winning`;

  const body = {
    totalStakedAmount: Number(amountInput.value),
    eventCount: ticket.eventCount,
    betSlips: JSON.stringify(ticket.betSlips),
  };
  console.log(body);

  totalStkValueElement.textContent = amountInput.value;

  fetchAPI({
    url: apiUrl,
    method: "POST",
    data: body,
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;

          const paymentConfigs = JSON.parse(data.paymentConfigs);
          totalPotValueElement.textContent = paymentConfigs?.[0]?.potentialWinAmount;

          globals.ticket.paymentConfigs = paymentConfigs;
          globals.ticket.totalStakedAmount = body.totalStakedAmount;

          console.log({ ticket: globals.ticket });
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

  // const queryString = window.location.search.replace("?", "");
  if (!globals.token) {
    window.location.replace("/sports/tickets");
  } else {
    //   const queryParams = getQueryParams(queryString);
    //   if (queryParams.eventId) {
    fetchEvents();
    //   } else {
    //     alert("No event ID");
    //   }
  }

  fetchUserBalance(mainBalanceElement, "main");
  setInterval(() => {
    fetchUserBalance(mainBalanceElement, "main");
  }, 20 * 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  // debugger;
  const addSlipButton = document.getElementById("add-slip");
  const autoplaySwitch = document.getElementById("autoplay-switch");
  const createTicketButton = document.getElementById("create-ticket-button");
  const saveTicketButton = document.getElementById("save-ticket-button");

  const betTypeSelectionMenu = document.getElementById("bet-type-selector");
  const boosterSelectionMenu = document.getElementById("booster-selector");
  const resultTypeSelectionMenu = document.getElementById("result-selector");
  const overSelectionMenu = document.getElementById("over-type-selector");
  const underSelectionMenu = document.getElementById("under-type-selector");
  const amountInput = document.getElementById("amount-input");

  if (localStorage.getItem("bots")) {
    let savedBots = JSON.parse(localStorage.getItem("bots"));
    if (savedBots.length > 0) {
      autoplaySwitch.checked = true;
    }
  }

  autoplaySwitch.addEventListener("change", async (ev) => {
    console.log(ev.target.checked);
    if (ev.target.checked) await autoPlayer(GameOptions);
    else {
      globals.autoPlayBots.forEach((bot, index) => {
        console.log(`Stopping bot ${index + 1}`);
        clearInterval(bot.clock);
      });

      globals.autoPlayBots = [];
      localStorage.removeItem("bots");
    }
  });

  addSlipButton.addEventListener("click", (ev) => {
    if (
      validateInputs([amountInput]) &&
      Object.keys(globals.currentSelections).length > 0
    ) {
      const slips = Object.entries(globals.currentSelections).map(
        ([eventId, { betType }]) => ({
          amount: amountInput.value,
          eventId,
          betType,
        })
      );

      console.log("slopppp", slips);

      globals.ticket.betSlips = globals.ticket.betSlips.concat(slips);
      globals.ticket.eventCount = globals.ticket.betSlips.length;
      // reset Options
      globals.currentSelections = {};
      document
        .querySelectorAll("#event-container .selected")
        .forEach((ball) => {
          ball.classList.toggle("selected", false);
        });

      fetchPotentialWinning(globals.ticket);
      // console.log("glogggg", globals.ticket);
    }

    updateUI();
  });

  createTicketButton.addEventListener("click", (ev) => {
    const walletSelector = document.querySelector(
      "#play-tab-content input[name='sourceWallet']:checked"
    );
    const wrmSelector = document.querySelector(
      "#play-tab-content input[name='winningRedemptionMethod']:checked"
    );
    const bookingCodeInput = document.querySelector(
      "#play-tab-content input[name='bookingCode']"
    );
    globals.ticket.sourceWallet = walletSelector.value;
    globals.ticket.bookingCode = bookingCodeInput.value || null;
    globals.ticket.winningRedemptionMethod = wrmSelector.value;

    createTicket(globals.ticket);
  });

  saveTicketButton.addEventListener("click", (ev) => {
    const walletSelector = document.querySelector(
      "#play-tab-content input[name='sourceWallet']:checked"
    );
    const wrmSelector = document.querySelector(
      "#play-tab-content input[name='winningRedemptionMethod']:checked"
    );
    globals.ticket.sourceWallet = walletSelector.value;
    globals.ticket.winningRedemptionMethod = wrmSelector.value;

    saveTicket(globals.ticket);
  });

  start();
});
