    import { ref, push, onChildAdded, getDatabase } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
    import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

    const firebaseConfig = {
        databaseURL: "https://hsr-gi-default-rtdb.firebaseio.com",
        storageBucket: "hsr-gi.appspot.com",
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const storage = getStorage(app);

    const checkName = localStorage.getItem("name");
    const username = document.getElementById("username");
    const userButton = document.getElementById("btn-user");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const logoutButton = document.getElementById("logout-button");
    const selectedImage = document.getElementById("selected-image");
    const messageContainer = document.getElementById("messages");

    if (!checkName) {
        username.removeAttribute("hidden");
        userButton.removeAttribute("hidden");
    } else {
        logoutButton.removeAttribute("disabled");
        sendButton.removeAttribute("disabled");
    }

    document.addEventListener("DOMContentLoaded", () => {
        const savedName = localStorage.getItem("name");

        if (!savedName) {
            username.addEventListener("keypress", (event) => {
                if (event.key === "Enter") saveNameAndReloadPage();
            });

            userButton.addEventListener("click", () => {
                saveNameAndReloadPage();
            });
        }

        logoutButton.addEventListener("click", () => {
            clearNameAndReloadPage();
        });

        messageInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") sendMessage();
        });

        const saveMessageToDatabase = (name, message, imageUrl = null) => {
            const messagesRef = ref(db, "messages");
            push(messagesRef, {
                name: name,
                message: message,
                imageUrl: imageUrl,
                timestamp: new Date().getTime(),
            });
        };

        const uploadImage = (imageFile, callback) => {
            const storageRefVar = storageRef(storage, "imgchat/" + imageFile.name);
            uploadBytes(storageRefVar, imageFile).then(() => {
                getDownloadURL(storageRefVar).then((url) => {
                    callback(url);
                });
            });
        };

        const sendMessage = () => {
            const name = localStorage.getItem("name");
            const message = messageInput.value.trim();

            if (name && (message || selectedImage.files[0])) {
                if (selectedImage.files[0]) {
                    uploadImage(selectedImage.files[0], (imageUrl) => {
                        saveMessageToDatabase(name, message, imageUrl);
                    });
                } else {
                    saveMessageToDatabase(name, message);
                }

                messageInput.value = "";
                selectedImage.value = "";
            }
        };

        sendButton.addEventListener("click", sendMessage);

        const addMessage = (name, message, imageUrl, timestamp) => {
            const messageDiv = document.createElement("div");
            const getTimestamp = new Date(timestamp).toLocaleString("id", {
                hour: "numeric",
                minute: "numeric",
                hour12: false,
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            messageDiv.innerHTML = `<b>${name}:</b> ${message} <small class="timestamp">${getTimestamp}</small>`;
            if (imageUrl) {
                const div = document.createElement("div");
                const link = document.createElement("a");
                link.href = imageUrl;
                link.target = "_blank";
                const image = document.createElement("img");
                image.src = imageUrl;
                link.appendChild(image);
                div.appendChild(link);
                div.classList.add("separator");
                messageDiv.appendChild(div);
            }

            messageContainer.appendChild(messageDiv);

            messageContainer.scrollTop = messageContainer.scrollHeight;

            // Create button scroll to bottom if scrolling to top
            messageContainer.addEventListener("scroll", () => {
                if (messageContainer.scrollTop === 0 && messageDiv == messageContainer.lastElementChild) {
                     const btn = document.createElement("button");
                     btn.innerHTML = "<i class='fa fa-caret-down'></i>";
                     btn.addEventListener("click", () => {
                        messageContainer.scrollTop = messageContainer.scrollHeight;
                        btn.remove();
                     });
                     btn.classList.add("c-scroll-to-bottom");
                     messageContainer.appendChild(btn);
                } 
            }); 

            const admin = localStorage.getItem("admin");
            const isAdmin = name === "admin";
            if (admin || isAdmin) {
                messageDiv.classList.add("admin");
            }
        };

        const messagesRef = ref(db, "messages");

        onChildAdded(messagesRef, (snapshot) => {
            const messageData = snapshot.val();
            addMessage(messageData.name, messageData.message, messageData.imageUrl, messageData.timestamp);
        });
    });

    const saveNameAndReloadPage = () => {
        const newName = username.value.trim();
        if (newName) {
            localStorage.setItem("name", newName);
            window.location.reload();
        }
    };

    const clearNameAndReloadPage = () => {
        localStorage.removeItem("name");
        window.location.reload();
    };
