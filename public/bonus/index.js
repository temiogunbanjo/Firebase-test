const createBonusCard = (bonus) => {
  let bonusTypeStyle = "";
  let actions = "";

  switch (bonus.type) {
    case "influencer-bonus":
      bonusTypeStyle = "color: white;background-color: #700070";
      actions = `<div class="d-flex" style="flex-direction: row; margin-bottom: 20px">
      <div
        class="w-auto flex-grow"
        style="background-color: #eee6; color: #600060; border: none;padding: 14px;border-radius: 5px; margin-left: 1px; text-align: center">
        This bonus is applied through an influencer's referral link
      </div>
    </div>`;
      break;

    case "bundle-bonus":
      bonusTypeStyle = "color: white;background-color: #333";
      actions = `<div class="d-flex" style="flex-direction: row; margin-bottom: 20px">
      <button
        class="w-auto flex-grow" onclick="buyBundle('${bonus.bundleId}')"
        style="background-color: dodgerblue; color: white; border: none;padding: 14px;border-radius: 5px; margin-left: 1px">
        Buy Now
      </button>
    </div>`;
      break;

    default:
      bonusTypeStyle = "";
      actions = `<div class="d-flex" style="flex-direction: row; margin-bottom: 20px">
      <button
        class="w-auto flex-grow" onclick="applyForBonus('${bonus.bonusId}')"
        style="background-color: dodgerblue; color: white; border: none;padding: 14px;border-radius: 5px; margin-left: 1px">
        Apply Now
      </button>
    </div>`;
      break;
  }

  return `
  <div class="ticket-card bonus" style="${bonusTypeStyle}">
    <div class="d-flex cols align-items-center ticket-header" style="margin-bottom:1em">
      <h3 style="margin-bottom:0.5em; margin-top:0.5em">${bonus.title}</h3>
      <span style="font-size:14px;">
        <span class="ticket-label">Bonus ID:</span>
        <span class="ticket-value">${bonus.bonusId}</span>
      </span>
      <span style="font-size:11px; margin-top:0.5em">
        <i class="ticket-label">Created On:</i>
        <i class="ticket-value">${new Date(bonus.createdAt).toDateString()}</i>
      </span>
      <span class="status-indicator round" data-status=${
        bonus.status ? "won" : "lost"
      } style="position: absolute; top: -5px; right: -5px"></span>
    </div>
    <div class="d-flex cols ticket-body">
      <div class="ticket-body-row">
        <p>
          <span class="ticket-label">Description:</span>
          <span class="ticket-value">${bonus.description ?? "-"}</span>
        </p>
        <p>
          <span class="ticket-label">Bonus Type:</span>
          <span class="ticket-value" style="text-transform: capitalize">${
            bonus.type ?? "-"
          }</span>
        </p>
      </div>

      <div class="ticket-body-row">
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Qualification:</span>
          <span class="ticket-value">N ${bonus.minimumDeposit ?? "0.00"} | ${
    bonus.depositRound
  } deposit </span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Win Criteria:</span>
          <span class="ticket-value">${
            bonus?.Game?.name ?? bonus?.gameType
          } | ${bonus.betType} | ${bonus.winCount} wins </span>
        </p>
      </div>

      <div class="ticket-body-row">
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Prize:</span>
          <span class="ticket-value">${bonus.prize ?? "-"}</span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Unit Cost:</span>
          <span class="ticket-value">${bonus.unitCost ?? "-"}</span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Quantity:</span>
          <span class="ticket-value">${bonus.quantity ?? "-"}</span>
        </p>
      </div>

      <div class="ticket-body-row">
        ${bonus.status ? actions : ""}
      </div>
      
    </div>
  </div>
`;
};

const createAppliedBonusCard = (bonus) => {
  return `
  <div class="ticket-card bonus">
    <div class="d-flex cols align-items-center ticket-header" style="margin-bottom:1em">
      <h3 style="margin-bottom:0.5em; margin-top:0.5em">${bonus.title}</h3>
      <span style="font-size:11px;">
        <i class="ticket-label">Created On:</i>
        <i class="ticket-value">${new Date(bonus.createdAt).toDateString()}</i>
      </span>
      <span class="status-indicator round" data-status=${
        bonus.status ? "won" : "lost"
      } style="position: absolute; top: -5px; right: -5px"></span>
    </div>
    <div class="d-flex cols ticket-body">
      <div class="ticket-body-row">
        <p>
          <span class="ticket-label">ID:</span>
          <span class="ticket-value">${bonus.bonusId}</span>
        </p>
        <p>
          <span class="ticket-label">Description:</span>
          <span class="ticket-value">${bonus.description ?? "-"}</span>
        </p>
      </div>

      <div class="ticket-body-row">
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Qualification:</span>
          <span class="ticket-value">N ${bonus.minimumDeposit ?? "0.00"} | ${
    bonus.depositRound
  } deposit </span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Win Criteria:</span>
          <span class="ticket-value">${
            bonus?.Bonus?.Game?.name ?? bonus?.gameType
          } | ${bonus.betType} | ${bonus.Bonus.winCount} wins </span>
        </p>
        <div
          class="d-flex cols w-auto flex-grow"
          style="background-color: orange; color: white; border: none;padding: 10px;border-radius: 5vh; margin: 20px 1px 0px; text-align: center;"
        >
          <span style="font-size: 10px">Prize:</span>
          <span style="font-size: 13px; font-weight: 700">${
            bonus.prize ?? "-"
          }</span>
        </div>
      </div>

      <div class="ticket-body-row">
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Game Play Count:</span>
          <span class="ticket-value">${bonus.gamePlayCount ?? "0"}/${
    bonus.Bonus.gamePlayCount ?? "0"
  }</span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Win Count:</span>
          <span class="ticket-value">${bonus.winCount ?? "0"}/${
    bonus.Bonus.winCount ?? "0"
  }</span>
        </p>
        ${
          bonus.isConsecutive
            ? `<p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Consecutive Wins:</span>
          <span class="ticket-value">${bonus.consecutiveWinCount ?? "0"}/${
                bonus.Bonus.winCount ?? "0"
              }</span>
        </p>`
            : ""
        }
      </div>
    </div>
  </div>
`;
};

function viewBonusHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#bonus-container");
  containerElement.innerHTML = "Fetching bonuses...";

  if (!options) {
    options = {
      page: 1,
      limit: 50,
    };
  }

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/bonus/fetch-all-bonuses?page=${options.page}&limit=${options.limit}`;

  fetchAPI({
    url: apiUrl,
    method: "GET",
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;
          console.log(data);

          containerElement.innerHTML = data
            .map((bonus) => createBonusCard(bonus))
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

function viewAppliedBonusHandler(options = { page: 1, limit: 20 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#applied-bonus-container");
  containerElement.innerHTML = "Fetching applied bonuses...";

  if (!options) {
    options = {
      page: 1,
      limit: 20,
    };
  }

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/bonus/fetch-applied-bonuses?page=${options.page}&limit=${options.limit}`;

  fetchAPI({
    url: apiUrl,
    method: "GET",
  })
    .then(async (result) => {
      try {
        const { status } = result;
        // console.log(result);
        if (result && result.data) {
          const { data } = result?.data;
          console.log(data);

          containerElement.innerHTML = data
            .map((bonus) => createAppliedBonusCard(bonus))
            .join("");
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
        const { responsemessage, status } = error;
        updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
      updateResponsePane(containerElement, error, "error");
    });
}

const fetchAllData = () => {
  const balanceElement = document.querySelector("#bonus-balance");
  viewBonusHandler({ page: 1, limit: 50 });
  viewAppliedBonusHandler({ page: 1, limit: 50 });
  fetchUserBalance(balanceElement, "bonus");
};

function applyForBonus(bonusId) {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/bonus/apply-for-bonus`;

  fetchAPI({
    url: apiUrl,
    method: "POST",
    data: { bonusId },
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          // updateResponsePane(responseElement, data, status);
          fetchAllData();
        } else {
          // updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        errorHandler(error);
      }
    })
    .catch((error) => {
      errorHandler(error);
    });
}

function buyBundle(bundleId) {
  const apiUrl = `${globals[globals.environment].apiBaseUrl}/bonus/buy-bundle`;

  fetchAPI({
    url: apiUrl,
    method: "POST",
    data: { bundleId, quantity: 1 },
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          // updateResponsePane(responseElement, data, status);
          fetchAllData();
        } else {
          // updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        errorHandler(error);
      }
    })
    .catch((error) => {
      errorHandler(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(10);
  fetchAllData();

  setInterval(() => {
    fetchAllData();
  }, 0.5 * 60 * 1000);
});
