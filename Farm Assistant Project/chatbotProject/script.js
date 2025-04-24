let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imageButton = document.querySelector("#image");
let imageInput = document.querySelector("#image input");
let submitButton = document.querySelector("#submit");

const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCPxg1QhoHcto8aIO8R2Hr0E-506d-VPio";

let user = {
    data: null,
};

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: user.data }] }],
        }),
    };

    try {
        let response = await fetch(Api_url, RequestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse;
    } catch (error) {
        console.log(error);
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponce(message) {
    user.data = message;
    let html = `
        <img src="images/framerImage.png" alt="" id="userImg" width="60px" height="60px" style="border-radius: 50%;">
        <div class="user-chat-area">
            ${message}
        </div>`;

    prompt.value = "";

    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let aiHtml = `
            <img src="images/chat bot image 3.jpeg" alt="" id="aiImg" width="60px" style="border-radius: 50%;">
            <div class="ai-chat-area">
                <img src="loading gif.gif" alt="" class="load" width="30px" height="30px" length="100px">
            </div>`;
        let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600);
}

function handleChatSubmission() {
    let message = prompt.value.trim();
    if (message) {
        handleChatResponce(message);
    }
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleChatSubmission();
    }
});

submitButton.addEventListener("click", () => {
    handleChatSubmission();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        console.log(e);
    };
    reader.readAsDataURL(file);
});

imageButton.addEventListener("click", () => {
    imageButton.querySelector("input").click();
});
