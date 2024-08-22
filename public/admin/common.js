const globals = {
  autoPlayBots: [],
  currentPageIndex: 0,
  environment: localStorage.getItem("environment") || "western",
  token: localStorage.getItem("token") || null,
  user: JSON.parse(sessionStorage.getItem("admin") || "{}") || {},
  notificationOptions: {
    dir: "auto",
  },
  bet9ja: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    searchBaseUrl: "https://engine.gaim.tech",
    apiKey: "ADM.Qg6bmE-oGQi9b-SxA1Vb-Sggcbw-dwlaE8-G",
  },
  white: {
    // apiBaseUrl: "https://white-api.gaim.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    searchBaseUrl: "https://white-engine.gaim.tech",
    apiKey: "ADM.t6CliW-jkIsim-VzwV11-Ca8BNx-qgHEWf-RX",
    // apiKey: "ADM.t6CliW-jkIsim-VzwV11-Ca8BNx-qgHEWf-RX",
  },
  western: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    searchBaseUrl: "https://white-engine.gaim.tech",
    apiKey: "ADM.3R5rwY-o8MiQz-A8GwwW-bri0sH-UCxayX-",
  },
  mbg: {
    // apiBaseUrl: "https://merrybet-api.gaim.tech/api/v1",
    apiBaseUrl: `http://${window.location.hostname}:3000/api/v1`,
    searchBaseUrl: "https://merry.gaim.tech",
    apiKey: "ADM.JHWeFa-DNDlJf-Hh8On3-Xpaj3s-BVSDdO-n6",
  },
  ticket: {
    sourceWallet: "mainWallet",
    betSlips: [],
  },
  currentSelections: {},
  BET_TYPE_MINIMUM_SELECTION: {
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
    "perm-1": 10,
    "perm-2": 10,
    "perm-3": 10,
    "perm-4": 10,
    "perm-5": 10,
    "nap-1-t": 1,
    "nap-2-t": 2,
    "nap-3-t": 3,
    "nap-4-t": 4,
    "nap-5-t": 5,
    "perm-1-t": 10,
    "perm-2-t": 10,
    "perm-3-t": 10,
    "perm-4-t": 10,
    "perm-5-t": 10,
    "nap-1-ol": 1,
    "nap-2-ol": 2,
    "nap-3-ol": 3,
    "nap-4-ol": 4,
    "nap-5-ol": 5,
    "perm-1-ol": 1,
    "perm-2-ol": 2,
    "perm-3-ol": 3,
    "perm-4-ol": 4,
    "perm-5-ol": 5,
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
    "1-by-3": 4,
    "1-by-3-swap": 4,
    "1-by-4": 5,
    "1-by-4-swap": 5,
    "2-by-1": 3,
    "2-by-2": 4,
    "2-by-3": 5,
    "2-by-3-swap": 5,
    "3-by-1": 4,
    "3-by-2": 5,
    "4-by-1": 5,
    "1w-by-1m": 2,
    "1w-by-1m-swap": 2,
    "1w-by-2m": 3,
    "1w-by-2m-swap": 3,
    "2w-by-1m": 3,
    "2w-by-2m": 4,
    "2w-by-2m-swap": 4,
    fnd: 5,
    '1st-box': 5,
    '2nd-box': 5,
    'center-box': 5,
    'last-box': 5,
    '1st-nd': 5,
    '1st-2nd': 5,
    '1st-3nd': 5
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
  responseElement.textContent =
    typeof dataResponse !== "object"
      ? dataResponse
      : JSON.stringify(dataResponse, null, 2);
};

const createMenu = (drawerElement) => {
  const menus = [
    {
      link: "/admin",
      name: "Authentication",
      id: "auth-tab",
      visible: true,
    },
    {
      link: "/admin/bonus",
      name: "Bonus Management",
      id: "bonus-tab",
      visible: true,
    },
    {
      link: "/admin/aggregated-commissions",
      name: "Commissions Management",
      id: "commissions-tab",
      visible: true,
    },
    {
      link: "/admin/prize-claims",
      name: "Prize Claims",
      id: "commissions-tab",
      visible: true,
    }
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

function saveAdmin(user, output = null) {
  console.log(globals[globals.environment]);
  const responseElement = output;

  if (responseElement) {
    responseElement.innerHTML =
      responseElement.innerHTML + "<br>Saving admin...";
  }

  try {
    if (user) {
      console.log(user);
      globals.user = user;
      sessionStorage.setItem("admin", JSON.stringify(user));

      if (responseElement) {
        responseElement.innerHTML =
          responseElement.innerHTML + "<br>Admin saved successfully!";
      }
    } else if (responseElement) {
      responseElement.innerHTML =
        responseElement.innerHTML + "<br>Admin saving failed!";
    }
  } catch (error) {
    console.log(error);
    const { status } = error;
    if (responseElement) {
      responseElement.innerHTML =
        responseElement.innerHTML + `<br>Admin saving failed:${status}!`;
    }
  }
}

function saveEnvironment(environment = globals.environment) {
  localStorage.setItem("environment", environment);
}

const setPageIndex = (newIndex) => {
  const drawerElement = document.querySelector("#navigation ul");
  globals.currentPageIndex = newIndex;

  if (drawerElement) {
    createMenu(drawerElement);
  }

  if (!globals.user?.adminId && globals.currentPageIndex !== 0) {
    window.location.replace('/admin');
  }

  if (globals.user?.status === false) {
    const notice = document.querySelector("#notice");
    if (notice) {
      notice.classList.toggle("hide", false);
      notice.textContent = "Account has been suspended";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  globals.user = JSON.parse(sessionStorage.getItem("admin"));
  // console.log(globals.user);
  const drawerElement = document.querySelector("#navigation ul");
  const toggleSwitches = document.querySelectorAll(".toggle-switch");

  if (drawerElement) {
    createMenu(drawerElement);
  }

  // if (toggleSwitches && toggleSwitches.length > 0) {
  //   toggleSwitches.forEach((tSwitch) => {
  //     tSwitch.addEventListener("change", (ev) => {
  //       console.log(ev.target.checked);
  //     });
  //   });
  // }
});
