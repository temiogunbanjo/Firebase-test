function fetchAndSaveUser(token) {
  console.log(globals[globals.environment]);
  const responseElement = document.querySelector("#login-form .response");
  responseElement.innerHTML = responseElement.innerHTML + "<br>Fetching user...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-authenticated-user`;

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
          saveUser(user, responseElement);
        } else {
          responseElement.innerHTML =
            responseElement.innerHTML + "<br>User fetching failed!";
        }
      } catch (error) {
        console.log(error);
        const { status } = error;
        responseElement.innerHTML =
          responseElement.innerHTML + `<br>User fetching failed:${status}!`;
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

  const apiUrl = `${globals[globals.environment].apiBaseUrl}/auth/login`;
  fetchAPI({
    url: apiUrl,
    method: "post",
    data: payload,
    // mode: "no-cors"
  })
    .then(async (result) => {
      try {
        // const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          const { token } = data?.data;

          globals.token = token;
          localStorage.setItem("token", token);

          updateResponsePane(responseElement, data, status);
          fetchAndSaveUser(token);
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

function registerHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#register-form .response");
  // const emailField = document.querySelector("#register-form input[name='email']");
  // const passwordField = document.querySelector(
  //   "#register-form input[name='password']"
  // );

  responseElement.innerHTML = "Registering...";

  const payload = {
    // email: emailField.value,
    // password: passwordField.value,
  };

  document.querySelectorAll("#register-form [name]").forEach((el) => {
    console.log(`${el.getAttribute('name')}, ${el.value}`);
    payload[el.getAttribute('name')] = el.value;
  });

  const apiUrl = `${globals[globals.environment].apiBaseUrl}/auth/signup`;
  fetchAPI({
    url: apiUrl,
    method: "post",
    data: payload,
    // mode: "no-cors"
  })
    .then(async (result) => {
      try {
        // const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          // const { token } = data?.data;

          // globals.token = token;
          // localStorage.setItem("token", token);

          updateResponsePane(responseElement, data, status);
          // fetchAndSaveUser(token);
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

  const registerForm = document.querySelector("#register-form");
  registerForm.addEventListener("submit", registerHandler);

  const environmentSelect = document.querySelector("#environment-option");
  environmentSelect.value = globals.environment;
  environmentSelect.addEventListener("change", (ev) => {
    saveEnvironment(ev.currentTarget.value);
    window.location.reload();
  });
});
