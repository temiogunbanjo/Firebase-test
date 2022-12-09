const globals = {
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
});
