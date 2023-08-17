function fetchAndSaveAdmin(adminId) {
  console.log(globals[globals.environment]);
  const responseElement = document.querySelector("#login-form .response");
  responseElement.innerHTML = responseElement.innerHTML + "<br>Fetching admin...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/admin/fetch-profile/${adminId}`;

  fetch(apiUrl, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals[globals.environment].apiKey,
      authorization: `Bearer ${globals.token}`,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          const user = data?.data;
          console.log(user);
          globals.user = user;
          saveAdmin(user, responseElement);
        } else {
          responseElement.innerHTML =
            responseElement.innerHTML + "<br>Admin fetching failed!";
        }
      } catch (error) {
        console.log(error);
        const { status } = error;
        responseElement.innerHTML =
          responseElement.innerHTML + `<br>Admin fetching failed:${status}!`;
      }
    })
    .catch((error) => {
      console.log(error);
      responseElement.innerHTML =
        responseElement.innerHTML + "<br>User fetching failed!";
    });
}


function loginHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#login-form .response");
  const emailField = document.querySelector("#login-form input[name='email']");
  const passwordField = document.querySelector(
    "#login-form input[name='password']"
  );

  responseElement.innerHTML = "Logging in...";

  const payload = {
    email: emailField.value,
    password: passwordField.value,
  };

  const apiUrl = `${globals[globals.environment].apiBaseUrl}/admin/login`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
    // mode: "no-cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      // mode: "no-cors",
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          const { token, adminId } = data?.data;

          globals.token = token;
          localStorage.setItem("token", token);

          updateResponsePane(responseElement, data, status);
          fetchAndSaveAdmin(adminId);
        } else {
          updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        console.log(error);
        const { status } = error;
        updateResponsePane(responseElement, error, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(0);
  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", loginHandler);

  const environmentSelect = document.querySelector("#environment-option");
  environmentSelect.value = globals.environment;
  environmentSelect.addEventListener("change", (ev) => {
    saveEnvironment(ev.currentTarget.value);
    window.location.reload();
  });
});
