// console.log(window.location.hostname);
const globals = {
  autoPlayBots: [],
  currentPageIndex: 0,
  environment: "western",
  token: localStorage.getItem("token") || null,
  user: JSON.parse(sessionStorage.getItem("user") || "{}") || {},
  notificationOptions: {
    dir: "auto",
  },
  bet9ja: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: `http://${window.location.hostname}:3000/api/v1`,
    searchBaseUrl: "https://engine.gaim.tech",
    apiKey: "USR.Qg6bmE-oGQi9b-SxA1Vb-Sggcbw-dwlaE8-G",
  },
  white: {
    // apiBaseUrl: "https://white-api.gaim.tech/api/v1",
    apiBaseUrl: `http://${window.location.hostname}:3000/api/v1`,
    searchBaseUrl: "https://white-engine.gaim.tech",
    apiKey: "USR.cyU01p-PF1ktQ-hwhGal-2eJemM-H7Fch5-br",
  },
  western: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: `http://${window.location.hostname}:3000/api/v1`,
    searchBaseUrl: "https://western.gaim.tech",
    apiKey: "USR.Ngu4rC-VMenpv-m251tw-rYC8Om-ryx89j-c4",
  },
  western_test: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: `http://${window.location.hostname}:3000/api/v1`,
    searchBaseUrl: "https://western.gaim.tech",
    apiKey: "USR.HvumDQ-vwJY1n-euHuLb-Zz1V3G-TEST-cq",
  },
  mbg: {
    // apiBaseUrl: "https://merrybet-api.gaim.tech/api/v1",
    apiBaseUrl: `http://${window.location.hostname}:3000/api/v1`,
    searchBaseUrl: "https://western.gaim.tech",
    apiKey: "USR.JHWeFa-DNDlJf-Hh8On3-Xpaj3s-BVSDdO-n6",
  },
  ticket: {
    sourceWallet: "mainWallet",
    betSlips: [],
  },
  currentSelections: {},
  BET_TYPE_MINIMUM_SELECTION: {
    "M-6": 6,
    "M-5": 5,
    "M-4": 4,
    "M-3": 3,
    "M-2": 2,
    "M-1": 1,
    "match-1": 1,
    "match-2": 2,
    "match-3": 3,
    "match-4": 4,
    "match-5": 5,
    "match-6": 6,
    "match-7": 7,
    "match-8": 8,
    "match-9": 9,
    "match-10": 10,
    "nap-1": 1,
    "nap-2": 2,
    "nap-3": 3,
    "nap-4": 4,
    "nap-5": 5,
    "perm-1": generateRandomNumber(1, 20),
    "perm-2": generateRandomNumber(2, 20),
    "perm-3": generateRandomNumber(3, 20),
    "perm-4": generateRandomNumber(4, 20),
    "perm-5": generateRandomNumber(5, 20),
    "nap-1-t": 1,
    "nap-2-t": 2,
    "nap-3-t": 3,
    "nap-4-t": 4,
    "nap-5-t": 5,
    n6: 6,
    n7: 7,
    n8: 8,
    n9: 9,
    n10: 10,
    "perm-1-t": generateRandomNumber(1, 20),
    "perm-2-t": generateRandomNumber(2, 20),
    "perm-3-t": generateRandomNumber(3, 20),
    "perm-4-t": generateRandomNumber(4, 20),
    "perm-5-t": generateRandomNumber(5, 20),
    "nap-1-ol": 1,
    "nap-2-ol": 2,
    "nap-3-ol": 3,
    "nap-4-ol": 4,
    "nap-5-ol": 5,
    "perm-1-ol": generateRandomNumber(1, 20),
    "perm-2-ol": generateRandomNumber(2, 20),
    "perm-3-ol": generateRandomNumber(3, 20),
    "perm-4-ol": generateRandomNumber(4, 20),
    "perm-5-ol": generateRandomNumber(5, 20),
    "no-draw": 10,
    "*no-draw*": 20,
    "perfect-1": 1,
    "perfect-2": 2,
    "perfect-3": 3,
    "perfect-4": 4,
    "perfect-5": 5,
    "perfect-6": 6,
    "perfect-7": 7,
    "perfect-8": 8,
    "1-by-1": 2,
    "1-by-2": 3,
    "1-by-2-swap": 3,
    "1-by-3": generateRandomNumber(4, 20),
    "1-by-3-swap": generateRandomNumber(4, 20),
    "1-by-4": generateRandomNumber(5, 20),
    "1-by-4-swap": generateRandomNumber(5, 20),
    "2-by-1": generateRandomNumber(3, 20),
    "2-by-2": generateRandomNumber(4, 20),
    "2-by-3": generateRandomNumber(5, 20),
    "2-by-3-swap": generateRandomNumber(5, 20),
    "3-by-1": generateRandomNumber(4, 20),
    "3-by-2": generateRandomNumber(5, 20),
    "4-by-1": generateRandomNumber(5, 20),
    "1w-by-1m": generateRandomNumber(2, 20),
    "1w-by-1m-swap": generateRandomNumber(2, 20),
    "1w-by-2m": generateRandomNumber(3, 20),
    "1w-by-2m-swap": generateRandomNumber(3, 20),
    "2w-by-1m": generateRandomNumber(3, 20),
    "2w-by-2m": generateRandomNumber(4, 20),
    "2w-by-2m-swap": generateRandomNumber(4, 20),
    fnd: 5,
    "1st-box": 5,
    "2nd-box": 5,
    "center-box": 5,
    "4th-box": 5,
    "last-box": 5,
    "1st-nd": 5,
    "1st-2nd": 5,
    "1st-3nd": 5,
    "1-against": generateRandomNumber(1, 20),
    "2-against": generateRandomNumber(2, 20),
    "3-against": generateRandomNumber(3, 20),
    "4-against": generateRandomNumber(4, 20),
    "1-no-draw": 1,
    "2-no-draw": 2,
    "3-no-draw": 3,
    "4-no-draw": 4,
    "5-no-draw": 5,
    "6-no-draw": 6,
    "7-no-draw": 7,
    "8-no-draw": 8,
    "9-no-draw": 9,
    "10-no-draw": 10,
    "11-no-draw": 11,
  },
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
}

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
  // alert(JSON.stringify(dataResponse));
  responseElement.textContent =
    typeof dataResponse !== "object"
      ? dataResponse
      : JSON.stringify(dataResponse, null, 2);
};

const createMenu = async (drawerElement) => {
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
      link:
        globals.user?.isAgent === false || !!globals.user?.adminId
          ? "/transfer-funds"
          : "/#",
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
      link: "/booked-tickets",
      name: "Booked Tickets",
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
      visible: globals.user?.isAgent === true || !!globals.user?.adminId,
    },
    {
      link: "/overdraft",
      name: "Manage Overdrafts",
      id: "overdraft-tab",
      visible: globals.user?.isAgent === true || !!globals.user?.adminId,
    },
    {
      link: "/bonus",
      name: "Bonus",
      id: "bonus-tab",
      visible: globals.user?.isAgent === false,
    },
  ];

  // try {
  //   const apiUrl = `${
  //     globals[globals.environment].apiBaseUrl
  //   }/site-settings/fetch-setting-by-slug/dynamic-headings`;

  //   const response = await fetchAPI({
  //     url: apiUrl,
  //     method: "GET",
  //   });

  //   const dynamicHeadings = JSON.parse(response?.data?.data?.content || "[]");
  //   console.log(dynamicHeadings);

  //   dynamicHeadings.forEach((heading) => {
  //     menus.push({
  //       link: `/extra?slug=${heading.value}`,
  //       name: `${heading.name}`,
  //       id: "extra-tab",
  //       visible: true,
  //     });
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

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
    const result = await fetchAPI({
      url: apiUrl,
    });

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
    (async () => {
      await createMenu(drawerElement);
    })();
  }

  if (!globals.user?.userId && globals.currentPageIndex !== 0) {
    window.location.replace("/");
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

  fetchAPI({
    url: apiUrl,
    method: "get",
  })
    .then((result) => {
      try {
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

            case "winning":
              balance = data.winningBalance;
              break;

            case "main":
            default:
              balance = data.walletBalance;
              break;
          }

          containerElement.innerHTML = balance || "--";
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
  let savedBots = localStorage.getItem("bots");
  let botsPane = document.querySelector("#play-tab");

  if (savedBots && botsPane) {
    savedBots = JSON.parse(savedBots);
    // console.log(savedBots);
    globals.autoPlayBots = savedBots;

    if (savedBots.length > 0) {
      window.onload = (ev) => {
        autoPlayer(
          savedBots[0].GameOptions,
          savedBots.length,
          savedBots[0].amountPerTicket
        );
      };
    }
  }
};

async function autoPlayer(
  GameOptions = GameOptions,
  numberOfPlayers = null,
  amountPerTicket = null
) {
  const getTooltipInfo = (botProps) => {
    const totalRate = globals.autoPlayBots.reduce(function (overall, nextBot) {
      // console.log(nextBot.analytics);
      if (nextBot.analytics) {
        return overall + nextBot.analytics.successRate;
      }

      return overall;
    }, 0);

    const overallSuccessRate = totalRate / globals.autoPlayBots.length;

    return `Bot ID: ${botProps.botId}, <br>Number of Tickets: ${
      botProps.tickets.length
    }, <br/>Success: ${Number(botProps.analytics.successRate).toFixed(
      2
    )}%, <br/>Failure: ${Number(botProps.analytics.failureRate).toFixed(
      2
    )}%, <br/>Restarts: ${
      botProps.analytics.restart
    }, <br>Overall Success Rate: ${Number(overallSuccessRate).toFixed(
      2
    )}, <br>Overall Failure Rate: ${Number(100 - overallSuccessRate).toFixed(
      2
    )}`;
  };

  const generateRandomizedTicket = async (botId, botGameOptions, amount) => {
    const Patterns = {
      x_by_y_bet_type_pattern: /^(\d-by-\d)/gi,
      w_by_m_bet_type_pattern: /^(\dw-by-\dm)/gi,
    };

    // PICK RANDOM NUMBER OF SLIPS TO GENERATE
    const numberOfSlips = generateRandomNumber(1, 30);
    const betSlips = [];

    // CREATE CORRESPONDING NUMBER OF SLIPS
    for (let i = 0; i < numberOfSlips; i++) {
      // RANDOM BETYPE FROM BET OPTIONS
      const betType =
        botGameOptions.betOptions[
          generateRandomNumber(0, botGameOptions.betOptions.length - 1)
        ];
      // RANDOM BOOSTER FROM BOOSTER OPTIONS
      const booster =
        botGameOptions.boosterOptions[
          generateRandomNumber(0, botGameOptions.boosterOptions.length - 1)
        ];
      // RANDOM RESULT TYPE FROM RESULT OPTIONS
      const resultType =
        botGameOptions.resultOptions[
          generateRandomNumber(0, botGameOptions.resultOptions.length - 1)
        ];

      let selections = new Set();
      const requiredSelections =
        globals.BET_TYPE_MINIMUM_SELECTION[betType?.name] || 0;
      // ADD RANDOM NUMBERS TO SELECTIONS SET
      for (let j = 0; selections.size < requiredSelections; j++) {
        selections.add(
          generateRandomNumber(1, Number(botGameOptions.gameCount))
        );
      }

      // CONVERT SELECTION SET TO ARRAY
      let newArraySelection = Array.from(selections);

      // CONVERT SELECTIONS ARRAY IN JOIN STRING BASED ON IF BET TYPE IS SET A/B OR NOT
      if (
        !betType?.name.match(Patterns.w_by_m_bet_type_pattern) &&
        !betType?.name.match(Patterns.x_by_y_bet_type_pattern)
      ) {
        newArraySelection = newArraySelection.join("-");
      } else {
        let strippedBetype = betType?.name.replace("-swap", "");
        strippedBetype = strippedBetype.replace(/w|m/gi, "");
        const [setACount, setBCount] = strippedBetype.split("-by-");
        // console.log(strippedBetype, setACount, setBCount);

        const setA = newArraySelection.slice(0, parseInt(setACount, 10));
        const setB = newArraySelection.slice(parseInt(setACount, 10));

        newArraySelection = `${setA.join("-")}/${setB.join("-")}`;
      }

      const finalSlip = {
        betType: betType?.name || "",
        booster: booster || "",
        resultType: resultType || "",
        amount: amount / numberOfSlips,
        selections: newArraySelection,
      };

      betSlips.push(finalSlip);
    }

    // RANDOMIZE THE WINNING REDEMPTION METHOD SELECTED
    // debugger;
    const availableWRM = !globals.user.isAgent
      ? ["wallet", "bank"]
      : ["dps", "bank"];
    const indexOfWRM = generateRandomNumber(0, availableWRM.length - 1);
    const selectedWRM = availableWRM[indexOfWRM];

    console.log(selectedWRM, indexOfWRM);

    const finalTicket = {
      gameId: botGameOptions.gameId,
      lotteryId: botGameOptions.lotteryId,
      winningRedemptionMethod: selectedWRM,
      sourceWallet:
        document.querySelector(
          "#play-tab-content input[name='sourceWallet']:checked"
        )?.value || "mainWallet",
      betSlips,
    };

    if (
      finalTicket.winningRedemptionMethod === "bank" ||
      !finalTicket.winningRedemptionMethod
    ) {
      finalTicket.winningRedemptionMethod = "bank";
      finalTicket.bankDetails = JSON.stringify({
        accountNumber: "0211394434",
        accountName: "Temiloluwa ogunbanjo",
        bankCode: "058",
      });
    }

    return finalTicket;
  };

  const fetchPotentialWinningForBot = async (botId, ticket) => {
    try {
      const apiUrl = `${
        globals[globals.environment].apiBaseUrl
      }/game/ticket/get-potential-winning`;

      const result = await fetchAPI({
        url: apiUrl,
        method: "POST",
        data: ticket,
      });

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

    const body = {
      gameId: ticket.gameId,
      totalStakedAmount: ticket.totalStakedAmount,
      winningRedemptionMethod: ticket.winningRedemptionMethod,
      sourceWallet: ticket.sourceWallet,
      betSlips: JSON.stringify(ticket.betSlips),
    };
    // console.log({ cre: JSON.parse(body) });

    fetchAPI({
      url: apiUrl,
      method: "POST",
      data: body,
    })
      .then((result) => {
        try {
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
          errorHandler(error, true);
        }
      })
      .catch((error) => {
        errorHandler(error, true);
        if (globals.autoPlayBots[botId]) {
          globals.autoPlayBots[botId].analytics.failed += 1;
        }
      });

    if (globals.autoPlayBots[botId]) {
      const savedTicket = body;
      savedTicket.betSlips = JSON.parse(savedTicket.betSlips);

      if (globals.autoPlayBots[botId].tickets.length > 15) {
        globals.autoPlayBots[botId].tickets = [savedTicket];
      } else {
        globals.autoPlayBots[botId].tickets.push(savedTicket);
      }
    }
  }

  function saveBotStates() {
    localStorage.setItem("bots", JSON.stringify(globals.autoPlayBots));

    // UPDATE STORAGE EVERY 10 SECONDS
    setInterval(() => {
      localStorage.setItem("bots", JSON.stringify(globals.autoPlayBots));
    }, 10000);
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
  if (playersPane) playersPane.innerHTML = "";

  for (let i = 1; i <= numberOfPlayers; i++) {
    console.log(`Creating robot ${i}`);
    // INTERVAL TO CREATE EACH TICKET
    const botProps = {
      sourceWallet:
        document.querySelector(
          "#play-tab-content input[name='sourceWallet']:checked"
        )?.value || "mainWallet",
      botId: globals.autoPlayBots[i - 1]?.botId || i,
      amountPerTicket:
        globals.autoPlayBots[i - 1]?.amountPerTicket || amountPerTicket,
      tickets: globals.autoPlayBots[i - 1]?.tickets || [],
      analytics: {
        restart: globals.autoPlayBots[i - 1]?.analytics?.restart || 0,
        success: globals.autoPlayBots[i - 1]?.analytics?.success || 0,
        failed: globals.autoPlayBots[i - 1]?.analytics?.failed || 0,
        get successRate() {
          return (this.success / this.restart) * 100;
        },
        get failureRate() {
          return ((this.restart - this.success) / this.restart) * 100;
        },
      },
      GameOptions: globals.autoPlayBots[i - 1]?.GameOptions || GameOptions,
    };

    let botEl = document.querySelector(`#bot-${i}`);

    const interval = generateRandomNumber(
      MIN_INTERVAL_SECONDS,
      MAX_INTERVAL_SECONDS
    );

    const botClock = setInterval(() => {
      botEl = document.querySelector(`#bot-${i}`);
      if (botEl) {
        botEl.classList.toggle("active", true);
      }

      if (numberOfPlayers < 100) {
        console.log(`Bot ${i} creating Ticket`);
      }

      generateRandomizedTicket(i - 1, botProps.GameOptions, amountPerTicket)
        .then(async (botTicket) => {
          botTicket.betSlips = JSON.stringify(botTicket.betSlips);
          const data = await fetchPotentialWinningForBot(i - 1, botTicket);
          if (data) {
            // console.log(data);
            botTicket.betSlips = JSON.parse(data.betSlips);
            botTicket.totalStakedAmount = data.totalStakedAmount;

            createTicketByBot(i - 1, botTicket, true);
          }
        })
        .finally(() => {
          if (botEl) {
            botEl.ontransitionend = (ev) => {
              ev.target.classList.toggle("active", false);
            };
          }
        });

      if (globals.autoPlayBots[i - 1]) {
        // console.log(globals.autoPlayBots[i - 1]);

        if (botEl) {
          const gradientPosition = `${Number(
            globals.autoPlayBots[i - 1].analytics.successRate
          ).toFixed(2)}%`;
          botEl.style.color = "white";
          botEl.style.backgroundImage = `linear-gradient(to right, var(--user-color) ${gradientPosition}, red ${gradientPosition})`;

          document.querySelector(`#bot-${i}-tooltip`).innerHTML =
            getTooltipInfo(globals.autoPlayBots[i - 1]);
        }

        globals.autoPlayBots[i - 1].analytics.restart += 1;
      }
    }, interval * 1000);

    botProps.clock = botClock;

    // ADD OR UPDATE BOT ARRAY
    if (
      globals.autoPlayBots[i - 1] &&
      globals.autoPlayBots[i - 1].botId === i
    ) {
      globals.autoPlayBots[i - 1] = botProps;
    } else {
      globals.autoPlayBots.push(botProps);
    }

    if (playersPane && !botEl) {
      const botElement = document.createElement("SPAN");
      const innerText = document.createElement("SPAN");
      const botTooltip = document.createElement("SPAN");

      botElement.classList.add("user", "tooltip");
      botTooltip.classList.add("tooltiptext");

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

  saveBotStates();
}

async function fetchAPI(options) {
  const defaultOptions = { method: "GET", url: "" };
  options =
    typeof options === "object"
      ? { ...defaultOptions, ...options }
      : defaultOptions;

  // console.log(options);

  const response = await fetch(options.url, {
    method: options.method,
    body: JSON.stringify(options.data),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals[globals.environment].apiKey,
    },
  });

  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  globals.user = JSON.parse(sessionStorage.getItem("user"));
  console.log(globals.user);
  const drawerElement = document.querySelector("#navigation ul");
  const toggleSwitches = document.querySelectorAll(".toggle-switch");

  if (drawerElement) {
    createMenu(drawerElement);
  }

  if (toggleSwitches && toggleSwitches.length > 0) {
    toggleSwitches.forEach((tSwitch) => {
      tSwitch.addEventListener("change", (ev) => {
        console.log(ev.target.checked);
      });
    });
  }

  loadAutoPlayers();
});
