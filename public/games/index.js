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
              return `<div class="game-category-container" style="width: 100%">
              <h3 class="game-category-head">${category}</h3>
              <div class="game-category-body d-flex rows" style="flex-wrap: wrap">
                ${categoryObject[category]
                  .map((game) => {
                    const poolProgressPercent = game.totalFundPool
                      ? Math.floor(
                          game.currentPoolAmount / game.totalFundPool
                        ) * 100
                      : null;
                    return `
                    <div class="game-card">
                      <div class="d-flex rows align-items-center ticket-header">
                        <h3 style="margin-bottom: 0.5em">Game</h3>
                        <span
                          class="status-indicator"
                          data-status="${game.status === true ? "won" : "lost"}"
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

                          ${
                            poolProgressPercent
                              ? `<p style="width: 100%">
                                  <progress value='${poolProgressPercent}' max="100" style="width: 100%;">
                                    ${poolProgressPercent}%
                                  </progress>
                                </p>`
                              : ""
                          }
                        </div>

                        <div class="d-flex rows ticket-body-row align-items-center">
                          <a href="/play?gameId=${
                            game.gameId
                          }" class="custom-button">Play Game</a>
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

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(5);

  let nextBtn = null;
  let prevBtn = null;

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewGamesHandler({ page: parseInt(page, 10), limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewGamesHandler({ page: parseInt(page, 10), limit: 50 });
    });
  }

  viewGamesHandler({ page: 1, limit: 50 });
});
