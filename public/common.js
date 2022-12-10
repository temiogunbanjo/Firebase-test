const globals = {
  autoPlayBots: [],
  currentPageIndex: 0,
  environment: "white",
  token: localStorage.getItem("token") || null,
  user: JSON.parse(sessionStorage.getItem("user") || "{}") || {},
  notificationOptions: {
    dir: "auto",
  },
  bet9ja: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    searchBaseUrl: "https://engine.gaim.tech",
    apiKey: "USR.Qg6bmE-oGQi9b-SxA1Vb-Sggcbw-dwlaE8-G",
  },
  white: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    searchBaseUrl: "https://white-engine.gaim.tech",
    apiKey: "USR.cyU01p-PF1ktQ-hwhGal-2eJemM-H7Fch5-br",
  },
  western: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    searchBaseUrl: "https://white-engine.gaim.tech",
    apiKey: "USR.Ngu4rC-VMenpv-m251tw-rYC8Om-ryx89j-c4",
  },
  ticket: {
    sourceWallet: "mainWallet",
    betSlips: [],
  },
  currentSelections: {},
  BET_TYPE_MINIMUM_SELECTION: {
    'match-1': 1,
    'match-2': 2,
    'match-3': 3,
    'match-4': 4,
    'match-5': 5,
    'match-6': 6,
    'match-7': 7,
    'match-8': 8,
    'match-9': 9,
    'match-10': 10,
    'nap-1': 1,
    'nap-2': 2,
    'nap-3': 3,
    'nap-4': 4,
    'nap-5': 5,
    'perm-1': 1,
    'perm-2': 2,
    'perm-3': 3,
    'perm-4': 4,
    'perm-5': 5,
    'no-draw': 10,
    'perfect-1': 1,
    'perfect-2': 2,
    'perfect-3': 3,
    'perfect-4': 4,
    'perfect-5': 5,
    'perfect-6': 6,
    'perfect-7': 7,
    'perfect-8': 8,
  }
};

const errorHandler = (error = {}, byBot = false) => {
  console.info("Errrrr");
  console.error(error);
  const message = error.responsemessage || error.message;
  if (!byBot) alert(message);
  else console.error(message);
};

function generateRandomNumber(min = 0, max = 1) {
  return Math.round(Math.random() * (max - min)) + min;
};

function createQuery(queryParams = {}) {
  let queryString = "";

  if (Object.keys(queryParams).length > 0) {
    queryString = "?";

    Object.keys(queryParams).forEach((key, index) => {
      queryString +=
        index === 0
          ? `${key}=${queryParams[key]}`
          : `&${key}=${queryParams[key]}`;
    });
  }
  return queryString;
}

const updateResponsePane = (responseElement, dataResponse, status) => {
  responseElement.textContent =
    typeof dataResponse !== "object"
      ? dataResponse
      : JSON.stringify(dataResponse, null, 2);
};

const createMenu = (drawerElement) => {
  const menus = [
    {
      link: "/",
      name: "Authentication",
      id: "auth-tab",
      visible: true,
    },
    {
      link: "/profile",
      name: "My Profile",
      id: "profile-tab",
      visible: true,
    },
    {
      link: "/token",
      name: "Token Management",
      id: "token-management-tab",
      visible: true,
    },
    {
      link: "/withdrawal",
      name: "Withdrawals",
      id: "withdraw-tab",
      visible: true,
    },
    {
      link: "/transfer-funds",
      name: "Transfers",
      id: "transfer-tab",
      visible: true,
    },
    {
      link: "/transactions",
      name: "Transactions",
      id: "transaction-tab",
      visible: true,
    },
    {
      link: "/games",
      name: "Games",
      id: "view-games-tab",
      visible: true,
    },
    {
      link: "/tickets",
      name: "Tickets",
      id: "view-tickets-tab",
      visible: true,
    },
    {
      link: "/results",
      name: "Game Results",
      id: "view-results-tab",
      visible: true,
    },
    {
      link: "/reports",
      name: "My Reports",
      id: "view-reports-tab",
      visible: globals.user?.isAgent === true || globals.user?.adminId,
    },
    {
      link: "/overdraft",
      name: "Manage Overdrafts",
      id: "overdraft-tab",
      visible: globals.user?.isAgent === true || globals.user?.adminId,
    },
    {
      link: "/bonus",
      name: "Bonus",
      id: "bonus-tab",
      visible: true,
    },
  ];

  const content = menus
    .filter((eachMenu) => {
      return !!eachMenu.visible;
    })
    .map((eachMenu, index) => {
      return `<li id=${eachMenu.id}><a ${
        globals.currentPageIndex === index ? "class='active'" : ""
      } href=${eachMenu.link}>${eachMenu.name}</a></li>`;
    });

  // `<li id="auth-tab"><a href="/">Authentication</a></li>
  // <li id="token-management-tab">
  //   <a href="/token">Token Management</a>
  // </li>
  // <li id="withdraw-tab"><a href="/withdrawal">Withdrawals</a></li>
  // <li id="transfer-tab"><a href="/transfer-funds">Transfers</a></li>
  // <li id="view-games-tab"><a class="active" href="/games">Games</a></li>
  // <li id="view-tickets-tab"><a href="/tickets">View Tickets</a></li>
  // <li id="view-results-tab"><a href="/results">Game Results</a></li>`;

  drawerElement.innerHTML = content.join("");
};

async function fetchUserById(userId) {
  console.log(globals[globals.environment]);

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-user/${userId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `Bearer ${globals.token}`,
        "x-api-key": globals[globals.environment].apiKey,
      },
    });
    const result = await response.json();

    if (result && result.data) {
      const { data } = result;
      const user = data?.data;
      console.log(user);
      return user;
    } else {
      return Promise.reject(result);
    }
  } catch (error) {
    console.log(error);
  }
}

function saveUser(user, output = null) {
  console.log(globals[globals.environment]);
  const responseElement = output;
  
  if (responseElement) {
    responseElement.innerHTML =
      responseElement.innerHTML + "<br>Saving user...";
  }

  try {
    if (user) {
      console.log(user);
      globals.user = user;
      sessionStorage.setItem("user", JSON.stringify(user));

      if (responseElement) {
        responseElement.innerHTML =
          responseElement.innerHTML + "<br>User saved successfully!";
      }
    } else if (responseElement) {
      responseElement.innerHTML =
        responseElement.innerHTML + "<br>User saving failed!";
    }
  } catch (error) {
    console.log(error);
    const { status } = error;
    if (responseElement) {
      responseElement.innerHTML =
        responseElement.innerHTML + `<br>User saving failed:${status}!`;
    }
  }
}

const setPageIndex = (newIndex) => {
  const drawerElement = document.querySelector("#navigation ul");
  globals.currentPageIndex = newIndex;

  if (drawerElement) {
    createMenu(drawerElement);
  }

  if (globals.user?.status === false) {
    const notice = document.querySelector("#notice");
    if (notice) {
      notice.classList.toggle("hide", false);
      notice.textContent = "Account has been suspended";
    }
  }
};

function fetchUserBalance(containerElement, type = "main") {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-authenticated-user`;

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

          console.log(result.data);
          const { data } = result?.data;
          let balance = 0;

          switch (type) {
            case "bonus":
              balance = data.bonusBalance;
              containerElement.style.color = ((status) => {
                if (status === "matured") return "green";
                if (status === "pending") return "orange";
                return "darkgrey";
              })(data.bonusStatus);
              break;

            case "commission":
              balance = data.commissionBalance;
              break;

            case "main":
            default:
              balance = data.walletBalance;
              break;
          }

          containerElement.innerHTML = balance;
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

const loadAutoPlayers = () => {
  let savedBots = localStorage.getItem('bots');
  if (savedBots) {
    savedBots = JSON.parse(savedBots);
    console.log(savedBots);
    globals.autoPlayBots = savedBots;
    window.onload = (ev) => {
      autoPlayer(savedBots[0].GameOptions, savedBots.length, savedBots[0].amountPerTicket);
    }
  }
}

async function autoPlayer(GameOptions, numberOfPlayers = null, amountPerTicket = null) {
  const getTooltipInfo = (botProps) => {
    return `Bot ID: ${
      botProps.botId
    }, <br>Number of Tickets: ${
      botProps.tickets.length
    }, <br/>Success: ${
      botProps.analytics.successRate
    }, <br/>Failure: ${
      botProps.analytics.failureRate
    }, <br/>Restarts: ${
      botProps.analytics.restart
    }`;
  };

  const generateRandomizedTicket = async (botId, botGameOptions, amount) => {
    const numberOfSlips = generateRandomNumber(1, 5);
    const betSlips = [];

    for (let i = 0; i < numberOfSlips; i++) {
      const betType =
        botGameOptions.betOptions[
          generateRandomNumber(0, botGameOptions.betOptions.length - 1)
        ];
      const booster =
        botGameOptions.boosterOptions[
          generateRandomNumber(0, botGameOptions.boosterOptions.length - 1)
        ];
      const resultType =
        botGameOptions.resultOptions[
          generateRandomNumber(0, botGameOptions.resultOptions.length - 1)
        ];
      let selections = new Set();

      // console.log(globals.BET_TYPE_MINIMUM_SELECTION[betType?.name]);

      for (
        let j = 1;
        j <= (globals.BET_TYPE_MINIMUM_SELECTION[betType?.name] || 0);
        j++
      ) {
        selections.add(generateRandomNumber(1, Number(botGameOptions.gameCount)));
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
      gameId: botGameOptions.gameId,
      lotteryId: botGameOptions.lotteryId,
      winningRedemptionMethod: !globals.user.isAgent ? "wallet" : "dps",
      sourceWallet: "mainWallet",
      betSlips,
    };

    // console.log(retTicket, globals.user);

    return retTicket;
  };

  const fetchPotentialWinningForBot = async (botId, ticket) => {
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
        if (globals.autoPlayBots[botId]) {
          globals.autoPlayBots[botId].analytics.failed += 1;
        }
        return null;
      }
    } catch (error) {
      errorHandler(error, true);
      if (globals.autoPlayBots[botId]) {
        globals.autoPlayBots[botId].analytics.failed += 1;
      }
      return null;
    }
  };

  function createTicketByBot(botId, ticket, byBot = false) {
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
  
    if (globals.autoPlayBots[botId]) {
      globals.autoPlayBots[botId].tickets.push(JSON.parse(body));
    }
    // console.log({ cre: JSON.parse(body) });
  
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
  
            // console.log({ createTicketResponse: data, ticket: globals.ticket });
            if (data?.ticketId) {
              // updateUI();
              if (!byBot) alert("Ticket created succesfully");
              else {
                console.log("Ticket created succesfully");
              }

              if (globals.autoPlayBots[botId]) {
                globals.autoPlayBots[botId].analytics.success += 1;
              }
            }
          }
        } catch (error) {
          if (globals.autoPlayBots[botId]) {
            globals.autoPlayBots[botId].analytics.failed += 1;
          }
          errorHandler(error);
        }
      })
      .catch((error) => {
        errorHandler(error);
        if (globals.autoPlayBots[botId]) {
          globals.autoPlayBots[botId].analytics.failed += 1;
        }
      });
  }

  numberOfPlayers = numberOfPlayers || prompt("Enter number of players:");
  amountPerTicket = amountPerTicket || prompt("Enter amount per ticket:");

  numberOfPlayers = numberOfPlayers || 1;
  amountPerTicket = amountPerTicket || 10;

  numberOfPlayers = parseInt(numberOfPlayers);
  amountPerTicket = parseInt(amountPerTicket);

  const MIN_INTERVAL_SECONDS = 25;
  const MAX_INTERVAL_SECONDS = 60;

  const playersPane = document.querySelector("#play-tab");
  if (playersPane) playersPane.innerHTML = '';

  for (let i = 1; i <= numberOfPlayers; i++) {
    console.log(`Creating robot ${i}`);
    // INTERVAL TO CREATE EACH TICKET
    const botProps = {
      botId: globals.autoPlayBots[i - 1]?.botId || i,
      amountPerTicket: globals.autoPlayBots[i - 1]?.amountPerTicket || amountPerTicket,
      tickets: globals.autoPlayBots[i - 1]?.tickets || [],
      analytics: {
        restart: globals.autoPlayBots[i - 1]?.analytics?.restart || 0,
        success: globals.autoPlayBots[i - 1]?.analytics?.success || 0,
        failed: globals.autoPlayBots[i - 1]?.analytics?.failed || 0,
        get successRate () {
          return `${Number((this.success / this.restart) * 100).toFixed(2)}%`
        },
        get failureRate () {
          return `${Number(((this.restart - this.success) / this.restart) * 100).toFixed(2)}%`
        },
      },
      GameOptions: globals.autoPlayBots[i - 1]?.GameOptions || GameOptions
    };

    let botEl = document.querySelector(`#bot-${i}`);

    const interval = generateRandomNumber(
      MIN_INTERVAL_SECONDS,
      MAX_INTERVAL_SECONDS
    );

    const botClock = setInterval(() => {
      botEl = document.querySelector(`#bot-${i}`);
      if (botEl) {
        botEl.classList.toggle('active', true);
      }
      
      console.log(`Bot ${i} creating Ticket`);
      generateRandomizedTicket(i - 1, botProps.GameOptions, amountPerTicket)
        .then(async (botTicket) => {
          botTicket.betSlips = JSON.stringify(botTicket.betSlips);
          const data = await fetchPotentialWinningForBot(i - 1, botTicket);
          if (data) {
            // console.log(data);
            botTicket.betSlips = JSON.parse(data.betSlips);
            botTicket.totalStakedAmount = data.totalStakedAmount;

            createTicketByBot(i, botTicket, true);
          }
        }).finally(() => {
          if (botEl) {
            botEl.ontransitionend = (ev) => {
              ev.target.classList.toggle('active', false);
            };
          }
        });

      if (globals.autoPlayBots[i - 1]) {
        console.log(globals.autoPlayBots[i - 1]);

        if (botEl) {
          botEl.style.color = 'white';
          botEl.style.backgroundImage = `linear-gradient(to right, var(--user-color) ${
            globals.autoPlayBots[i - 1].analytics.successRate
          }, red ${
            globals.autoPlayBots[i - 1].analytics.successRate
          })`;

          document.querySelector(`#bot-${i}-tooltip`).innerHTML = getTooltipInfo(globals.autoPlayBots[i - 1]);
        }

        globals.autoPlayBots[i - 1].analytics.restart += 1;
      }
    }, interval * 1000);

    botProps.clock = botClock;

    // ADD OR UPDATE BOT ARRAY
    if (globals.autoPlayBots[i - 1] && globals.autoPlayBots[i - 1].botId === i) {
      globals.autoPlayBots[i - 1] = botProps;
    } else {
      globals.autoPlayBots.push(botProps);
    }
    
    if (playersPane && !botEl) {
      const botElement = document.createElement('SPAN');
      const innerText = document.createElement('SPAN');
      const botTooltip = document.createElement('SPAN');

      botElement.classList.add('user', 'tooltip');
      botTooltip.classList.add('tooltiptext');
  
      botElement.id = `bot-${i}`;
      botTooltip.id = `bot-${i}-tooltip`;

      innerText.textContent = `B${i}`;
      
      if (globals.autoPlayBots[i - 1]) {
        botTooltip.innerHTML = getTooltipInfo(globals.autoPlayBots[i - 1]);
      }

      botElement.appendChild(innerText);
      botElement.appendChild(botTooltip);
  
      playersPane.appendChild(botElement);
    }
  }

  // UPDATE STORAGE EVERY 10 SECONDS
  setInterval(() => {
    localStorage.setItem('bots', JSON.stringify(globals.autoPlayBots));
  }, 10000);
}

document.addEventListener("DOMContentLoaded", () => {
  globals.user = JSON.parse(sessionStorage.getItem("user"));
  console.log(globals.user);
  const drawerElement = document.querySelector("#navigation ul");
  const toggleSwitches = document.querySelectorAll('.toggle-switch');

  if (drawerElement) {
    createMenu(drawerElement);
  }

  if (toggleSwitches && toggleSwitches.length > 0) {
    toggleSwitches.forEach((tSwitch) => {
      tSwitch.addEventListener('change', (ev) => {
        console.log(ev.target.checked);
      });
    });
  }

  loadAutoPlayers();
});
