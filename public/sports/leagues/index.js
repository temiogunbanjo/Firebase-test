const createEventCard = (leagueObject, leagueName) => {
  // console.log(leagueObject, leagueName);
  const eventList = leagueObject[leagueName];
  return `<div class="game-category-container" style="width: 100%">
    <h3 class="game-category-head">${leagueName}</h3>
    <div class="game-category-body d-flex rows" style="flex-wrap: wrap">
      ${eventList
        .map((event) => {
          // const poolProgressPercent = event.totalFundPool
          //   ? (Number(event.currentPoolAmount) / Number(event.totalFundPool)) *
          //     100
          //   : null;

          // const startTime = formatTimeWithTimeZone(event.startTime);
          // const endTime = formatTimeWithTimeZone(event.endTime);

          const gamePlayStatus = (() => {
            // const [startHour, startMinute, startSeconds] = startTime.split(":");
            // const [endHour, endMinute, endSeconds] = endTime.split(":");

            const startTimeMS = new Date(event.eventDate).getTime();
            const endTimeMS = new Date(event.endDate).getTime();
            const currentTimeMS = Date.now();

            // console.log(startTimeMS, endTimeMS);

            if (
              currentTimeMS >= startTimeMS &&
              (!event.endDate || currentTimeMS < endTimeMS)
            ) {
              return "active";
            }

            if (event.endDate && currentTimeMS >= endTimeMS) {
              return "ended";
            }

            return "upcoming";
          })();
          // console.log({
          //   poolProgressPercent,
          //   poolProgressPercentRaw:
          //     (Number(event.currentPoolAmount) /
          //       Number(event.totalFundPool)) *
          //     100,
          //   currentPoolAmount: event.currentPoolAmount,
          //   totalFundPool: event.totalFundPool,
          // });
          return `
          <div class="game-card">
            <span class="playing-status ${gamePlayStatus} capitalize">${gamePlayStatus}</span>
            <div class="d-flex rows align-items-center ticket-header">
              <h3 style="margin-bottom: 0.5em;text-transform:capitalize">${
                event.title
              }</h3>
              ${
                event.recurring
                  ? `<small class="d-flex rows center" style="font-weight: 700;font-size:10px; border-radius: 50%;border: 2px solid orange; color: #111; margin-left: 8px; width: 28px; height: 28px">
                    ${event.recurringInterval}
                    </small>`
                  : ""
              }
            </div>
            <div class="d-flex rows align-items-center" style="margin-bottom: 1em;">
              <small class="status-indicator" style="font-weight: 600">
                 ${
                   gamePlayStatus === "ended"
                     ? `Ended on ${new Date(event.endDate).toDateString()}`
                     : `Starts on ${new Date(event.eventDate).toDateString()}`
                 }
              </small>
            </div>
            
            <div class="d-flex cols ticket-body">
              <div class="ticket-body-row">
                <p>
                  <span class="ticket-label">Event ID:</span>
                  <span class="ticket-value">${event.eventId}</span>
                </p>

                <p>
                  <span class="ticket-label">Lottery:</span>
                  <span
                    class="ticket-value"
                    style="text-transform: capitalize"
                  >${event.lotteryName}</span>
                </p>
              </div>

              ${
                gamePlayStatus === "ended"
                  ? ""
                  : `<div class="d-flex rows ticket-body-row align-items-center">
                <a href="/sports/play?eventId=${event.eventId}" class="custom-button">Play Event</a>
              </div>`
              }
            </div>
          </div>
          `;
        })
        .join("")}
    </div>
  </div>`;
};

function viewEventHandler(ev) {
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
  }/game/fetch-events?page=1&limit=100&currentWeekDay=${currentWeekDay}&endTime=${currentTime}&includeRecurring=true&order=createdAt:DESC`;

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
          const leagueObject = {};

          const { data } = result?.data;

          data.forEach((game) => {
            const { name: categoryName } = game?.HomeTeam?.League;
            if (!leagueObject[categoryName]) {
              leagueObject[categoryName] = [game];
            } else {
              leagueObject[categoryName].push(game);
            }
          });

          // console.log(leagueObject);

          containerElement.innerHTML = Object.keys(leagueObject)
            .map((category) => createEventCard(leagueObject, category))
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
      viewEventHandler({ page: cPage, limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      cPage = parseInt(page, 10);
      viewEventHandler({ page: cPage, limit: 50 });
    });
  }

  viewEventHandler({ page: cPage, limit: 50 });

  setInterval(() => {
    // alert('hey');
    viewEventHandler({ page: cPage, limit: 50 });
  }, 0.2 * 60 * 1000);
});
