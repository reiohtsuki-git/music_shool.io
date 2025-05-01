// チャットサイドバーの表示切替（モバイル用）
document.getElementById('toggle-sidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('chat-sidebar');
    sidebar.classList.toggle('visible');
});

// チャット入力欄の高さ自動調整
const chatInput = document.getElementById('chat-input');
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    // 最大高さを制限
    if (this.scrollHeight > 120) {
        this.style.height = '120px';
        this.style.overflowY = 'auto';
    } else {
        this.style.overflowY = 'hidden';
    }
});

// メッセージ送信処理
document.getElementById('send-button').addEventListener('click', sendMessage);

// Enterキーでメッセージ送信（Shift+Enterで改行）
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
    
    // タイピングインジケーターの表示
    showTypingIndicator();
});

// タイピングインジケーターを表示
function showTypingIndicator() {
    // タイピング中のインジケーターを表示している場合はタイマーをクリア
    if (window.typingTimer) {
        clearTimeout(window.typingTimer);
    }
    
    // タイピング中のテキストを表示
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.textContent = '田中先生が入力中...';
    
    // 一定時間後に非表示にする
    window.typingTimer = setTimeout(function() {
        typingIndicator.textContent = '';
    }, 2000);
}

// メッセージ送信関数
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // 現在の日時を取得
    const now = new Date();
    const timeString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // メッセージコンテナを作成
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    
    // メッセージ情報部分を作成
    const messageInfo = document.createElement('div');
    messageInfo.className = 'message-info';
    messageInfo.style.justifyContent = 'flex-end';
    messageInfo.innerHTML = `
        <div class="message-sender">山田太郎</div>
        <div class="message-time">${timeString}</div>
    `;
    
    // メッセージ本文を作成
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-outgoing';
    messageElement.textContent = message;
    
    // メッセージコンテナに追加
    messageContainer.appendChild(messageInfo);
    messageContainer.appendChild(messageElement);
    
    // チャット表示領域に追加
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.appendChild(messageContainer);
    
    // チャット表示領域を最下部までスクロール
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 入力欄をクリアして高さをリセット
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // タイピングインジケーターをクリア
    document.getElementById('typing-indicator').textContent = '';
    if (window.typingTimer) {
        clearTimeout(window.typingTimer);
    }
    
    // 自動返信（デモ用）
    simulateResponse(message);
}

// 自動返信をシミュレーション（デモ用）
function simulateResponse(userMessage) {
    // タイピングインジケーターを表示
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.textContent = '田中先生が入力中...';
    
    // ランダムな遅延時間（1.5秒〜3秒）
    const delay = Math.floor(Math.random() * 1500) + 1500;
    
    // 遅延後に返信メッセージを表示
    setTimeout(function() {
        // 返信メッセージの内容を決定（デモ用）
        let responseText = '';
        
        if (userMessage.includes('質問')) {
            responseText = '質問いただきありがとうございます。どのような点でお困りでしょうか？具体的に教えていただけると助かります。';
        } else if (userMessage.includes('練習')) {
            responseText = '練習お疲れ様です！コツコツと続けることが大切です。どのような点に気をつけて練習されていますか？';
        } else if (userMessage.includes('楽譜')) {
            responseText = '楽譜について、何かお困りの点がありますか？必要であれば、分かりやすく印をつけたPDFファイルを送ることもできますよ。';
        } else if (userMessage.includes('レッスン')) {
            responseText = '次回のレッスンは4月24日（木）10:00からの予定です。予定通りでよろしいでしょうか？';
        } else if (userMessage.includes('ありがとう')) {
            responseText = 'どういたしまして！何かあればいつでもご連絡ください。';
        } else {
            responseText = 'メッセージありがとうございます。引き続き、何かご質問があればお気軽にどうぞ。次回のレッスンでも詳しくお話しましょう。';
        }
        
        // 現在の日時を取得
        const now = new Date();
        const timeString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        // メッセージコンテナを作成
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        // メッセージ情報部分を作成
        const messageInfo = document.createElement('div');
        messageInfo.className = 'message-info';
        messageInfo.innerHTML = `
            <div class="message-avatar" style="background-color: #3a86ff;">田</div>
            <div class="message-sender">田中先生</div>
            <div class="message-time">${timeString}</div>
        `;
        
        // メッセージ本文を作成
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-incoming';
        messageElement.textContent = responseText;
        
        // メッセージコンテナに追加
        messageContainer.appendChild(messageInfo);
        messageContainer.appendChild(messageElement);
        
        // チャット表示領域に追加
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.appendChild(messageContainer);
        
        // タイピングインジケーターをクリア
        typingIndicator.textContent = '';
        
        // チャット表示領域を最下部までスクロール
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // サイドバーのチャットリストの最新メッセージを更新
        updateChatListLastMessage(responseText);
    }, delay);
}

// サイドバーのチャットリストの最新メッセージを更新する関数
function updateChatListLastMessage(message) {
    // アクティブなチャットアイテムを取得
    const activeChatItem = document.querySelector('.chat-item.active');
    if (activeChatItem) {
        // 最新メッセージを更新
        const lastMessageElement = activeChatItem.querySelector('.chat-item-last-message');
        if (lastMessageElement) {
            lastMessageElement.textContent = message;
        }
        
        // 時刻を更新
        const timeElement = activeChatItem.querySelector('.chat-item-time');
        if (timeElement) {
            timeElement.textContent = '今';
        }
    }
}

// チャットアイテムのクリックイベント
document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', function() {
        // 現在のアクティブなアイテムからアクティブクラスを削除
        document.querySelectorAll('.chat-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // クリックされたアイテムにアクティブクラスを追加
        this.classList.add('active');
        
        // チャットヘッダー更新
        updateChatHeader(this);
        
        // 未読バッジがあれば削除
        const unreadBadge = this.querySelector('.unread-badge');
        if (unreadBadge) {
            unreadBadge.remove();
        }
        
        // モバイルビューの場合、チャットを選択したらサイドバーを閉じる
        if (window.innerWidth <= 768) {
            document.getElementById('chat-sidebar').classList.remove('visible');
        }
    });
});

// チャットヘッダーを更新する関数
function updateChatHeader(chatItem) {
    const chatName = chatItem.querySelector('.chat-item-name').textContent.replace(/\s*<.*>$/, ''); // 未読バッジのテキストを削除
    document.querySelector('.chat-title').textContent = chatName;
    
    // オンラインステータスをランダムに設定（デモ用）
    const statusElement = document.querySelector('.chat-status');
    const statuses = ['オンライン', 'オフライン', '30分前にオンライン', '本日オンライン'];
    statusElement.textContent = chatName.includes('事務局') ? '営業時間: 平日 9:00-18:00' : statuses[Math.floor(Math.random() * statuses.length)];
    
    // メッセージ履歴をクリア（実際のアプリではAPIから取得）
    // ここではデモ用に固定メッセージを表示
    document.getElementById('chat-messages').innerHTML = `
        <div class="message-container">
            <div class="message-info">
                <div class="message-avatar" style="background-color: ${getChatColor(chatName)};">${chatName.charAt(0)}</div>
                <div class="message-sender">${chatName}</div>
                <div class="message-time">2025/04/22 10:00</div>
            </div>
            <div class="message message-incoming">
                ${getInitialMessage(chatName)}
            </div>
        </div>
        <div class="typing-indicator" id="typing-indicator"></div>
    `;
}

// チャットの色を取得する関数（デモ用）
function getChatColor(chatName) {
    if (chatName.includes('田中')) return '#3a86ff';
    if (chatName.includes('鈴木')) return '#ff006e';
    if (chatName.includes('佐藤')) return '#ffbe0b';
    if (chatName.includes('中村')) return '#8338ec';
    if (chatName.includes('事務局')) return '#38b000';
    return '#3a86ff'; // デフォルト色
}

// 初期メッセージを取得する関数（デモ用）
function getInitialMessage(chatName) {
    if (chatName.includes('田中')) {
        return 'こんにちは、山田さん。次回のレッスンについて確認したいことはありますか？';
    }
    if (chatName.includes('鈴木')) {
        return '山田さん、こんにちは。課題曲の練習は進んでいますか？何か質問があればいつでもどうぞ。';
    }
    if (chatName.includes('佐藤')) {
        return '山田さん、来週のレッスンですが、15時からに変更可能でしょうか？ご都合をお知らせください。';
    }
    if (chatName.includes('中村')) {
        return '山田さん、先日のレッスンお疲れ様でした。発声練習の動画を添付しますので、毎日少しずつ練習してみてください。';
    }
    if (chatName.includes('事務局')) {
        return 'いつもMusic Schoolをご利用いただきありがとうございます。5月のゴールデンウィーク期間中（5/3〜5/5）は休校となりますのでご了承ください。';
    }
    return 'こんにちは、何かお手伝いできることはありますか？';
}

// 新規チャットボタンのイベントリスナー
document.querySelector('.new-chat-button').addEventListener('click', function() {
    // 新規チャット作成ダイアログを表示（実際のアプリではモーダル表示など）
    const teacher = prompt('メッセージを送りたい講師を選択してください（田中、鈴木、佐藤、中村、または事務局）:');
    
    if (teacher) {
        // 入力された講師名を整形
        let teacherName = '';
        let instrument = '';
        
        if (teacher.includes('田中')) {
            teacherName = '田中先生';
            instrument = 'ピアノ';
        } else if (teacher.includes('鈴木')) {
            teacherName = '鈴木先生';
            instrument = 'ギター';
        } else if (teacher.includes('佐藤')) {
            teacherName = '佐藤先生';
            instrument = 'バイオリン';
        } else if (teacher.includes('中村')) {
            teacherName = '中村先生';
            instrument = 'ボーカル';
        } else if (teacher.includes('事務')) {
            teacherName = '事務局';
            instrument = '';
        } else {
            alert('該当する講師が見つかりません。');
            return;
        }
        
        // 新しいチャットアイテムを作成
        const initialName = teacherName.charAt(0);
        const displayName = instrument ? `${teacherName}（${instrument}）` : teacherName;
        
        // 既存のチャットアイテムをチェック（同じ講師との会話が既にある場合はそれをアクティブにする）
        const existingChat = Array.from(document.querySelectorAll('.chat-item')).find(item => {
            return item.querySelector('.chat-item-name').textContent.replace(/\s*<.*>$/, '').includes(teacherName);
        });
        
        if (existingChat) {
            // 既存のチャットをクリック
            existingChat.click();
            return;
        }
        
        // 新しいチャットアイテムを作成
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
            <div class="message-avatar" style="background-color: ${getChatColor(teacherName)};">${initialName}</div>
            <div class="chat-item-info">
                <div class="chat-item-name">${displayName}</div>
                <div class="chat-item-last-message">新しい会話を開始しました</div>
            </div>
            <div class="chat-item-time">今</div>
        `;
        
        // クリックイベントを追加
        chatItem.addEventListener('click', function() {
            // 現在のアクティブなアイテムからアクティブクラスを削除
            document.querySelectorAll('.chat-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // クリックされたアイテムにアクティブクラスを追加
            this.classList.add('active');
            
            // チャットヘッダー更新
            updateChatHeader(this);
            
            // モバイルビューの場合、チャットを選択したらサイドバーを閉じる
            if (window.innerWidth <= 768) {
                document.getElementById('chat-sidebar').classList.remove('visible');
            }
        });
        
        // チャットリストの先頭に追加
        const chatList = document.querySelector('.chat-list');
        chatList.insertBefore(chatItem, chatList.firstChild);
        
        // 新しいチャットをアクティブにする
        chatItem.click();
    }
});

// ファイル添付ボタンのイベントリスナー
document.querySelector('.files-button').addEventListener('click', function() {
    // 実際のアプリではファイル選択ダイアログを表示
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4';
    
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files.length > 0) {
            const file = this.files[0];
            
            // ファイル添付メッセージを作成（実際のアプリではアップロード処理）
            appendFileMessage(file.name, getFileType(file.name));
        }
    });
    
    fileInput.click();
});

// ファイルタイプを取得する関数
function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return '🖼️';
    if (['mp3', 'wav', 'ogg'].includes(extension)) return '🎵';
    if (['mp4', 'mov', 'avi'].includes(extension)) return '📹';
    if (['pdf'].includes(extension)) return '📄';
    if (['doc', 'docx'].includes(extension)) return '📝';
    if (['xls', 'xlsx'].includes(extension)) return '📊';
    if (['ppt', 'pptx'].includes(extension)) return '📑';
    
    return '📎';
}

// ファイル添付メッセージを追加する関数
function appendFileMessage(filename, icon) {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    // 現在の日時を取得
    const now = new Date();
    const timeString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // メッセージコンテナを作成
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    
    // メッセージ情報部分を作成
    const messageInfo = document.createElement('div');
    messageInfo.className = 'message-info';
    messageInfo.style.justifyContent = 'flex-end';
    messageInfo.innerHTML = `
        <div class="message-sender">山田太郎</div>
        <div class="message-time">${timeString}</div>
    `;
    
    // メッセージ本文を作成
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-outgoing';
    
    // メッセージに本文がある場合は追加
    if (message) {
        messageElement.textContent = message;
    } else {
        messageElement.textContent = 'ファイルを共有しました';
    }
    
    // 添付ファイルコンテナを作成
    const attachmentContainer = document.createElement('div');
    attachmentContainer.className = 'attachment-container';
    
    // 添付ファイルを作成
    const attachment = document.createElement('div');
    attachment.className = 'attachment';
    attachment.innerHTML = `
        <span class="attachment-icon">${icon}</span>
        <span class="attachment-name">${filename}</span>
    `;
    
    // 添付ファイルをコンテナに追加
    attachmentContainer.appendChild(attachment);
    
    // 添付ファイルをメッセージに追加
    messageElement.appendChild(attachmentContainer);
    
    // メッセージコンテナに追加
    messageContainer.appendChild(messageInfo);
    messageContainer.appendChild(messageElement);
    
    // チャット表示領域に追加
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.appendChild(messageContainer);
    
    // チャット表示領域を最下部までスクロール
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 入力欄をクリアして高さをリセット
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // ファイル名をチャットリストの最新メッセージとして表示
    updateChatListLastMessage(`ファイル: ${filename}`);
    
    // ファイル送信に対する返答（デモ用）
    setTimeout(function() {
        // タイピングインジケーターを表示
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.textContent = '田中先生が入力中...';
        
        setTimeout(function() {
            // メッセージコンテナを作成
            const responseContainer = document.createElement('div');
            responseContainer.className = 'message-container';
            
            // メッセージ情報部分を作成
            const responseInfo = document.createElement('div');
            responseInfo.className = 'message-info';
            responseInfo.innerHTML = `
                <div class="message-avatar" style="background-color: #3a86ff;">田</div>
                <div class="message-sender">田中先生</div>
                <div class="message-time">${timeString}</div>
            `;
            
            // メッセージ本文を作成
            const responseElement = document.createElement('div');
            responseElement.className = 'message message-incoming';
            responseElement.textContent = `ファイルを受け取りました。確認させていただきます。ありがとうございます！`;
            
            // メッセージコンテナに追加
            responseContainer.appendChild(responseInfo);
            responseContainer.appendChild(responseElement);
            
            // チャット表示領域に追加
            chatMessages.appendChild(responseContainer);
            
            // タイピングインジケーターをクリア
            typingIndicator.textContent = '';
            
            // チャット表示領域を最下部までスクロール
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // サイドバーのチャットリストの最新メッセージを更新
            updateChatListLastMessage('ファイルを受け取りました。確認させていただきます。');
        }, 1500);
    }, 1000);
}

// 絵文字ボタンのイベントリスナー
document.querySelector('.emoji-button').addEventListener('click', function() {
    // 絵文字選択UIを表示（実際のアプリではより洗練されたUI）
    const emojis = ['😊', '👍', '🎵', '🎹', '🎸', '🎻', '🎤', '👏', '🙏', '❤️', '😃', '😂', '🤔', '👋', '✨'];
    
    const emojiSelector = document.createElement('div');
    emojiSelector.style.position = 'absolute';
    emojiSelector.style.bottom = '70px';
    emojiSelector.style.left = '50px';
    emojiSelector.style.display = 'flex';
    emojiSelector.style.flexWrap = 'wrap';
    emojiSelector.style.gap = '10px';
    emojiSelector.style.background = 'white';
    emojiSelector.style.padding = '10px';
    emojiSelector.style.borderRadius = '10px';
    emojiSelector.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    emojiSelector.style.zIndex = '1000';
    
    emojis.forEach(emoji => {
        const emojiButton = document.createElement('div');
        emojiButton.textContent = emoji;
        emojiButton.style.cursor = 'pointer';
        emojiButton.style.fontSize = '24px';
        emojiButton.style.width = '36px';
        emojiButton.style.height = '36px';
        emojiButton.style.display = 'flex';
        emojiButton.style.alignItems = 'center';
        emojiButton.style.justifyContent = 'center';
        
        emojiButton.addEventListener('click', function() {
            // 入力欄に絵文字を追加
            const chatInput = document.getElementById('chat-input');
            chatInput.value += emoji;
            chatInput.focus();
            
            // 絵文字セレクターを削除
            document.body.removeChild(emojiSelector);
        });
        
        emojiSelector.appendChild(emojiButton);
    });
    
    // ドキュメントクリックで閉じる
    document.addEventListener('click', function closeEmojiSelector(e) {
        if (!emojiSelector.contains(e.target) && e.target !== document.querySelector('.emoji-button')) {
            if (document.body.contains(emojiSelector)) {
                document.body.removeChild(emojiSelector);
            }
            document.removeEventListener('click', closeEmojiSelector);
        }
    });
    
    document.body.appendChild(emojiSelector);
});

// ウィンドウサイズ変更時の処理
window.addEventListener('resize', function() {
    // モバイルビューでサイドバーの表示状態を調整
    if (window.innerWidth > 768) {
        document.getElementById('chat-sidebar').classList.add('visible');
    }
});

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // チャット表示領域を最下部までスクロール
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
});