const globals = {
  currentPageIndex: 0,
  environment: "bet9ja",
  token: localStorage.getItem("token") || null,
  user: JSON.parse(sessionStorage.getItem("user") || "{}"),
  notificationOptions: {
    dir: "auto",
  },
  bet9ja: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    apiKey: "USR.Qg6bmE-oGQi9b-SxA1Vb-Sggcbw-dwlaE8-G",
  },
  white: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    apiKey: "USR.cyU01p-PF1ktQ-hwhGal-2eJemM-H7Fch5-br",
  },
  western: {
    // apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
    apiBaseUrl: "http://localhost:3000/api/v1",
    apiKey: "USR.Ngu4rC-VMenpv-m251tw-rYC8Om-ryx89j-c4",
  },
  ticket: {
    sourceWallet: "mainWallet",
    betSlips: [],
  },
  currentSelections: {},
};

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
    },
    {
      link: "/token",
      name: "Token Management",
      id: "token-management-tab",
    },
    {
      link: "/withdrawal",
      name: "Withdrawals",
      id: "withdraw-tab",
    },
    {
      link: "/transfer-funds",
      name: "Transfers",
      id: "transfer-tab",
    },
    {
      link: "/transactions",
      name: "Transactions",
      id: "transaction-tab",
    },
    {
      link: "/games",
      name: "Games",
      id: "view-games-tab",
    },
    {
      link: "/tickets",
      name: "Tickets",
      id: "view-tickets-tab",
    },
    {
      link: "/results",
      name: "Game Results",
      id: "view-results-tab",
    },
  ];

  const content = menus.map((eachMenu, index) => {
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

const setPageIndex = (newIndex) => {
  const drawerElement = document.querySelector("#navigation ul");
  globals.currentPageIndex = newIndex;

  if (drawerElement) {
    createMenu(drawerElement);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const drawerElement = document.querySelector("#navigation ul");

  if (drawerElement) {
    createMenu(drawerElement);
  }
});
