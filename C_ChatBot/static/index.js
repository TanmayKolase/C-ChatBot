let messageTemplate = `
<li class="Chat_item Chat_item_l">
<div class="Chat_msgs">
  <div class="msg">
    <div class="msg-content">
    </div>
  </div>
</div>
</li>`

function sendMessageOnEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function scrollDown() {
    var chatWrapper = document.getElementById('chat-wrapper');
    chatWrapper.scrollTop = chatWrapper.scrollHeight;
  }

function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    if (userInput.trim() !== "") {
        appendMessage(userInput);
        document.getElementById("user-input").value = "";

        // Sending user input to the Flask backend
        fetch("http://127.0.0.1:5000/get_response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_input: userInput }),
        })
            .then((response) => response.json())
            .then((data) => {
                const botResponseLines = data.bot_response;

                appendMessage(data.bot_response.join('\n'), true);
                // // Append each line as a separate message
                // botResponseLines.forEach((line) => {
                // });
            })
            .catch((error) => console.error("Error:", error));
    }
}

function appendMessage(message, isBot=false) {
    var chatBox = document.getElementById("chat-box");
    var container = document.createElement('li');
    container.classList.add('Chat_item')
    if(!isBot){
        container.classList.add('Chat_item_r')
    }
    container.innerHTML = messageTemplate;
    let messageDiv = container.querySelector('.msg-content')
    messageDiv.innerText = message;
    chatBox.appendChild(container);
    scrollDown();
}
