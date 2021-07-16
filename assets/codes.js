const pushMessageElm = document.getElementById("code-push");
const pushUsernameInput = document.getElementById("code-push-username");
const pushBtn = document.getElementById("code-push-button");

const addMessageElm = document.getElementById("code-add");
const addUsernameInput = document.getElementById("code-add-username");
const addCodeBtn = document.getElementById("code-add-button");
const addCredentialBtn = document.getElementById("code-add-credential-button");

const dataElem = document.querySelector("data");
const baseUrl = dataElem.dataset.baseUrl;
const clientId = dataElem.dataset.clientId;

const webSDK = new web.default(baseUrl, clientId);

const handlerPushAuth = async () => {
  try {
    //1. Create unauthorized code
    const res = await fetch("/api/codes/push/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: pushUsernameInput.value,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    const { code } = data;

    pushMessageElm.textContent = code;

    //2. Wait for code to be authorized
    await fetch("/api/codes/wait", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: pushUsernameInput.value,
        code: code,
      }),
    });

    window.location.replace("/dashboard");
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
};

const handlerAddAuthCode = async () => {
  try {
    //1. Create unauthorized code
    const res = await fetch("/api/codes/add/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: addUsernameInput.value,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    const { code } = data;

    addMessageElm.textContent = code;
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
};

const handlerAddAuth = async () => {
  try {
    //2. Start add auth process
    const result = await webSDK.addFido2CredentialWithCode(
      addUsernameInput.value,
      addMessageElm.textContent
    );

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt: result.jwt, user: result.user }),
    });

    if (res.ok) {
      window.location.replace("/dashboard");
    }
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
};

pushBtn.addEventListener("click", handlerPushAuth);
addCodeBtn.addEventListener("click", handlerAddAuthCode);
addCredentialBtn.addEventListener("click", handlerAddAuth);
