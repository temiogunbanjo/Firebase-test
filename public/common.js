const globals = {
  environment: "western",
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
