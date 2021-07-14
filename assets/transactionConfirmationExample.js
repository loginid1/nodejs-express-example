const txIdElm = document.getElementById("tx-id");
const txPayloadElm = document.getElementById("tx-payload");
const txCreateBtn = document.getElementById("tx-create");
const txConfirmBtn = document.getElementById("tx-confirm");
const txCreateConfirmBtn = document.getElementById("tx-create-confirm");
const messageElm = document.getElementById("message");

const dataElem = document.querySelector("data");
const baseUrl = dataElem.dataset.baseUrl;
const clientId = dataElem.dataset.clientId;
const username = dataElem.dataset.username;

const webSDK = new web.default(baseUrl, clientId);

const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/*
 * This creates a Transaction ID and displays it on the UI
 */
txCreateBtn.addEventListener("click", async () => {
  if (!txPayloadElm.value) return;
  messageElm.textContent = "";

  try {
    const res = await fetch("/api/tx/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tx_payload: txPayloadElm.value }),
    });

    const data = await res.json();

    if (!res.ok) throw data;

    const { id: txId } = data;

    txIdElm.textContent = txId;
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
});

/*
 * This confirms the Transaction ID displayed on the UI
 */
txConfirmBtn.addEventListener("click", async () => {
  if (!txIdElm.textContent) return;
  messageElm.textContent = "";

  try {
    const { jwt } = await webSDK.confirmTransaction(
      username,
      txIdElm.textContent
    );

    const res = await fetch("/api/tx/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt }),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    if (data.isValid) {
      messageElm.textContent = "Transaction Confirmed!";
    } else {
      messageElm.textContent = "Transaction is not valid";
    }

    txPayloadElm.value = "";
    txIdElm.textContent = "";
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
});

/*
 * This does both create and confirm a Transaction at the same time
 */
txCreateConfirmBtn.addEventListener("click", async () => {
  if (!txPayloadElm.value) return;
  messageElm.textContent = "";

  try {
    const { jwt } = await webSDK.createAndConfirmTransaction(
      username,
      txPayloadElm.value,
      { nonce: randomString(16) }
    );

    const res = await fetch("/api/tx/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt }),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    if (data.isValid) {
      messageElm.textContent = "Transaction Confirmed!";
    } else {
      messageElm.textContent = "Transaction is not valid";
    }

    txPayloadElm.value = "";
    txIdElm.textContent = "";
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
});
