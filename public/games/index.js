function viewGamesHandler(ev) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#games-container");

  // containerElement.innerHTML = "Fetching tickets...";
  const d = new Date();
  const currentTime = `${
    d.getHours() < 10 ? "0" + d.getHours() : d.getHours()
  }:${d.getMinutes()}:${d.getSeconds()}`;
  const currentWeekDay = d.getDay();

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/game/fetch-current-game?page=1&limit=100&currentWeekDay=${currentWeekDay}&endTime=${currentTime}&includeRecurring=true&order=recurring:DESC,recurringInterval:ASC,endTime:ASC`;

  // console.log(currentTime);
  fetchAPI({
    url: apiUrl,
    method: "GET",
  })
    .then(async (result) => {
      try {
        // const  = await response.json();
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
              return `<div class="game-category-container" style="width: 100%">
              <h3 class="game-category-head">${category}</h3>
              <div class="game-category-body d-flex rows" style="flex-wrap: wrap">
                ${categoryObject[category]
                  .map((game) => {
                    const poolProgressPercent = game.totalFundPool
                      ? (Number(game.currentPoolAmount) /
                          Number(game.totalFundPool)) *
                        100
                      : null;

                    const gamePlayStatus = (() => {
                      const [startHour, startMinute, startSeconds] =
                        game.startTime.split(":");
                      const [endHour, endMinute, endSeconds] =
                        game.endTime.split(":");

                      const startTimeMS = new Date().setHours(
                        parseInt(startHour, 10),
                        parseInt(startMinute, 10),
                        parseInt(startSeconds, 10)
                      );

                      const endTimeMS = new Date().setHours(
                        parseInt(endHour, 10),
                        parseInt(endMinute, 10),
                        parseInt(endSeconds, 10)
                      );

                      const currentTimeMS = Date.now();

                      // console.log(startTimeMS, endTimeMS);

                      if (
                        currentTimeMS >= startTimeMS &&
                        currentTimeMS < endTimeMS
                      ) {
                        return "active";
                      }

                      if (
                        currentTimeMS > startTimeMS &&
                        currentTimeMS <= endTimeMS
                      ) {
                        return "ended";
                      }

                      return "upcoming";
                    })();
                    // console.log({
                    //   poolProgressPercent,
                    //   poolProgressPercentRaw:
                    //     (Number(game.currentPoolAmount) /
                    //       Number(game.totalFundPool)) *
                    //     100,
                    //   currentPoolAmount: game.currentPoolAmount,
                    //   totalFundPool: game.totalFundPool,
                    // });
                    return `
                    <div class="game-card">
                      <span class="playing-status ${gamePlayStatus} capitalize">${gamePlayStatus}</span>
                      <div class="d-flex rows align-items-center ticket-header">
                        <h3 style="margin-bottom: 0.5em;text-transform:capitalize">${
                          game.name
                        }</h3>
                        ${
                          game.recurring
                            ? `<small class="d-flex rows center" style="font-weight: 700;font-size:10px; border-radius: 50%;border: 2px solid orange; color: #111; margin-left: 8px; width: 28px; height: 28px">
                              ${game.recurringInterval}
                              </small>`
                            : ""
                        }
                      </div>
                      <div class="d-flex rows align-items-center" style="margin-bottom: 1em;">
                        <small class="status-indicator" style="font-weight: 600">
                          ${game.startTime} - ${game.endTime}
                        </small>
                      </div>
                      
                      <div class="d-flex cols ticket-body">
                        <div class="ticket-body-row">
                          <p>
                            <span class="ticket-label">Game ID:</span>
                            <span class="ticket-value">${game.gameId}</span>
                          </p>

                          <p>
                            <span class="ticket-label">Lottery:</span>
                            <span
                              class="ticket-value"
                              style="text-transform: capitalize"
                            >${game.lotteryName}</span>
                          </p>

                          ${
                            poolProgressPercent !== null &&
                            poolProgressPercent >= 0
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
  setPageIndex(6);

  let nextBtn = null;
  let prevBtn = null;

  let cPage = 1;

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      cPage = parseInt(page, 10);
      viewGamesHandler({ page: cPage, limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      cPage = parseInt(page, 10);
      viewGamesHandler({ page: cPage, limit: 50 });
    });
  }

  viewGamesHandler({ page: cPage, limit: 50 });

  setInterval(() => {
    // alert('hey');
    viewGamesHandler({ page: cPage, limit: 50 });
  }, 0.2 * 60 * 1000);
});
