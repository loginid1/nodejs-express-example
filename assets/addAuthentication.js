const codeTypeElm = document.getElementById("code-type");
const codePurposeElm = document.getElementById("code-purpose");
const codeAuthorizeElm = document.getElementById("code-authorize");
const addCodeBtn = document.getElementById("add-code-button");

const dataElem = document.querySelector("data");
const baseUrl = dataElem.dataset.baseUrl;
const clientId = dataElem.dataset.clientId;

const webSDK = new web.default(baseUrl, clientId);

addCodeBtn.addEventListener("click", async () => {
  try {
    fetch("/api/code/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code_type: codeTypeElm.value,
        code_purpose: codePurposeElm.value,
      }),
    });
  } catch (e) {}
});
