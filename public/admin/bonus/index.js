const createBonusCard = (bonus) => {
  let bonusTypeStyle = "";

  switch (bonus.type) {
    case "influencer-bonus":
      bonusTypeStyle = "color: white;background-color: #700070";
      break;

    case "bundle-bonus":
      bonusTypeStyle = "color: white;background-color: #333";
      break;

    default:
      bonusTypeStyle = "";
      break;
  }

  return `
  <div class="ticket-card bonus" style="${bonusTypeStyle}">
    <div class="d-flex cols align-items-center ticket-header" style="margin-bottom:1em">
      <h3 style="margin-bottom:0.2em; margin-top:0.5em">${bonus.title}</h3>
      <span style="font-size:11px;">
        <i class="ticket-label">BonusID:</i>
        <i class="ticket-value">${bonus.bonusId}</i>
      </span>
      <span style="font-size:11px; margin-top:0.5em;">
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
          <span class="ticket-value">${bonus.description || "-"}</span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Quantity:</span>
          <span class="ticket-value">${bonus.quantity}</span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Unit Cost:</span>
          <span class="ticket-value">${bonus.unitCost}</span>
        </p>
      </div>

      <div class="ticket-body-row">
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Qualification:</span>
          <span class="ticket-value">N ${bonus.minimumDeposit || "0.00"} | ${
    bonus.depositRound
  } deposit </span>
        </p>
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Win Criteria:</span>
          <span class="ticket-value">${bonus.gameType} | ${bonus.betType} | ${
    bonus.winCount
  } </span>
        </p>
      </div>

      <div class="ticket-body-row">
        <p class="d-flex rows align-items-center" style="justify-content:space-between">
          <span class="ticket-label">Prize:</span>
          <span class="ticket-value">${bonus.prize || "-"}</span>
        </p>
        <div class="d-flex" style="flex-direction: row; margin-bottom: 20px">
          <button
            class="w-auto flex-grow" onclick="deleteBonus('${bonus.bonusId}')"
            style="background-color: dodgerblue; color: white; border: none;padding: 14px;border-radius: 5px; margin-left: 1px">
            Update
          </button>
          <button
            class="w-auto flex-grow" onclick="deleteBonus('${bonus.bonusId}')"
            style="background-color: red; color: white; border: none;padding: 14px;border-radius: 5px; margin-left: 1px">
            Delete
          </button>
        </div>
      </div>
      
    </div>
  </div>
`;
};

function createBonusFormHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#bonus-form .response");
  const fields = document.querySelectorAll("#bonus-form *[name]");

  responseElement.innerHTML = "Creating bonus...";
  const payload = {};

  fields.forEach((field) => {
    // console.log(field.value, field.value.match(/true|false|^\d+$/gi));

    const formatValue = (value) =>
      value.length > 0 && value.match(/true|false|^\d+$/gi) !== null
        ? JSON.parse(value.trim())
        : value.trim();

    if (field.getAttribute("type") === "radio") {
      if (field.checked) {
        payload[field.name] = formatValue(field.value);
      }
    } else if (field.value.length > 0) {
      payload[field.name] = formatValue(field.value);
    }
  });

  console.log(payload);

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/bonus/create-bonus`;

  fetchAPI({
    url: apiUrl,
    method: "post",
    data: payload,
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          updateResponsePane(responseElement, data, status);
        } else {
          updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(responseElement, responsemessage, status);
      } finally {
        viewBonusHandler({ page: 1, limit: 10 });
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

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
        // const { status } = result;
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

function deleteBonus(bonusId) {
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/bonus/delete-bonus`;

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
        console.log("fetch", error);
        const { responsemessage, status } = error;
        alert(responsemessage);
      }
    })
    .catch((error) => {
      console.log("catch", error);
      alert(error.message);
    });
}

const fetchAllData = () => {
  viewBonusHandler({ page: 1, limit: 50 });
};

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(1);
  const bonusForm = document.querySelector("#bonus-form");
  bonusForm.addEventListener("submit", createBonusFormHandler);

  fetchAllData();

  setInterval(() => {
    fetchAllData();
  }, 0.5 * 60 * 1000);
});
