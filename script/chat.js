let currentChat = null;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Load chat conversations
        function loadChats() {
            const chats = JSON.parse(localStorage.getItem('chats')) || [];
            const chatsList = document.getElementById('chatsList');
            chatsList.innerHTML = '';

            chats.forEach(chat => {
                if (chat.participants.includes(currentUser.id)) {
                    const otherUser = chat.participants.find(id => id !== currentUser.id);
                    const user = JSON.parse(localStorage.getItem('users')).find(u => u.id === otherUser);
                    
                    const chatElement = document.createElement('div');
                    chatElement.classList.add('chat-item');
                    if (chat.id === currentChat?.id) {
                        chatElement.classList.add('active');
                    }
                    
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    chatElement.innerHTML = `
                        <h3>${user.username}</h3>
                        <p>${lastMessage ? lastMessage.text : 'No messages yet'}</p>
                        <small>${lastMessage ? new Date(lastMessage.timestamp).toLocaleString() : ''}</small>
                    `;
                    
                    chatElement.onclick = () => openChat(chat.id);
                    chatsList.appendChild(chatElement);
                }
            });
        }

        // Open a chat conversation
        function openChat(chatId) {
            const chats = JSON.parse(localStorage.getItem('chats')) || [];
            currentChat = chats.find(c => c.id === chatId);
            
            if (!currentChat) return;

            // Update UI
            document.getElementById('messageInput').disabled = false;
            document.getElementById('messageForm').querySelector('button').disabled = false;
            
            // Display messages
            displayMessages();
            
            // Display exchange details
            displayExchangeDetails();
            
            // Update chat header
            const otherUser = currentChat.participants.find(id => id !== currentUser.id);
            const user = JSON.parse(localStorage.getItem('users')).find(u => u.id === otherUser);
            document.getElementById('chatHeader').innerHTML = `
                <h2>Chat with ${user.username}</h2>
            `;
            
            // Mark messages as read
            markMessagesAsRead();
        }

        // Display messages
        function displayMessages() {
            const messagesContainer = document.getElementById('messages');
            messagesContainer.innerHTML = '';
            
            currentChat.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.classList.add(message.senderId === currentUser.id ? 'sent' : 'received');
                
                messageElement.innerHTML = `
                    <p>${message.text}</p>
                    <small>${new Date(message.timestamp).toLocaleString()}</small>
                `;
                
                messagesContainer.appendChild(messageElement);
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Send a message
        function sendMessage(event) {
            event.preventDefault();
            
            const input = document.getElementById('messageInput');
            const text = input.value.trim();
            
            if (!text || !currentChat) return;
            
            const message = {
                id: Date.now(),
                text,
                senderId: currentUser.id,
                timestamp: new Date().toISOString(),
                read: false
            };
            
            // Add message to chat
            currentChat.messages.push(message);
            
            // Update localStorage
            const chats = JSON.parse(localStorage.getItem('chats')) || [];
            const chatIndex = chats.findIndex(c => c.id === currentChat.id);
            chats[chatIndex] = currentChat;
            localStorage.setItem('chats', JSON.stringify(chats));
            
            // Clear input and update UI
            input.value = '';
            displayMessages();
            loadChats();
        }

        // Display exchange details
        function displayExchangeDetails() {
            const exchangeInfo = document.getElementById('exchangeInfo');
            
            if (!currentChat?.exchangeId) {
                exchangeInfo.innerHTML = '<p>No exchange details available</p>';
                return;
            }
            
            const exchanges = JSON.parse(localStorage.getItem('exchanges')) || [];
            const exchange = exchanges.find(e => e.id === currentChat.exchangeId);
            
            if (!exchange) return;
            
            const book = JSON.parse(localStorage.getItem('books')).find(b => b.id === exchange.bookId);
            
            exchangeInfo.innerHTML = `
                <h3>Exchange Details</h3>
                <div class="book-details">
                    <img src="${book.image}" alt="${book.title}">
                    <h4>${book.title}</h4>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Condition:</strong> ${book.condition}</p>
                </div>
                <div class="exchange-status">
                    <p><strong>Status:</strong> ${exchange.status}</p>
                    ${exchange.status === 'pending' ? `
                        <button onclick="acceptExchange(${exchange.id})">Accept Exchange</button>
                        <button onclick="rejectExchange(${exchange.id})" class="reject">Reject Exchange</button>
                    ` : ''}
                </div>
            `;
        }

        // Mark messages as read
        function markMessagesAsRead() {
            if (!currentChat) return;
            
            currentChat.messages.forEach(message => {
                if (message.senderId !== currentUser.id) {
                    message.read = true;
                }
            });
            
            // Update localStorage
            const chats = JSON.parse(localStorage.getItem('chats')) || [];
            const chatIndex = chats.findIndex(c => c.id === currentChat.id);
            chats[chatIndex] = currentChat;
            localStorage.setItem('chats', JSON.stringify(chats));
        }

        // Search chats
        document.getElementById('chatSearch').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const chatItems = document.querySelectorAll('.chat-item');
            
            chatItems.forEach(item => {
                const username = item.querySelector('h3').textContent.toLowerCase();
                const lastMessage = item.querySelector('p').textContent.toLowerCase();
                
                if (username.includes(query) || lastMessage.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Initialize
        loadChats();