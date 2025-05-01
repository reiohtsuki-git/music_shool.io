// チャットアイコンのクリックイベントを追加
document.getElementById('chat-icon').addEventListener('click', function() {
    // chat.htmlへ遷移
    window.location.href = 'chat.html';
});

// 現在選択されている週の初日の日付を保持するグローバル変数
let currentWeekStartDate = new Date('2025-04-17');

// 講師データ（デモ用）
const teachers = {
    'tanaka': { name: '田中先生', instrument: 'piano', slots: ['wed-10-00', 'wed-10-30', 'thu-09-00', 'thu-09-30'] },
    'suzuki': { name: '鈴木先生', instrument: 'guitar', slots: ['tue-10-00', 'tue-10-30', 'fri-09-00', 'fri-09-30', 'sat-10-00'] },
    'sato': { name: '佐藤先生', instrument: 'violin', slots: ['mon-11-00', 'wed-11-00', 'fri-10-00', 'sun-09-00'] },
    'nakamura': { name: '中村先生', instrument: 'vocal', slots: ['tue-09-00', 'thu-10-00', 'sat-09-00', 'sun-10-00'] }
};

// 曜日のマッピング
const dayMapping = {
    'mon': '月',
    'tue': '火',
    'wed': '水',
    'thu': '木',
    'fri': '金',
    'sat': '土',
    'sun': '日'
};

// 日本語曜日から英語コードへの逆マッピング
const reverseDayMapping = {
    '月': 'mon',
    '火': 'tue',
    '水': 'wed',
    '木': 'thu',
    '金': 'fri',
    '土': 'sat',
    '日': 'sun'
};

// 予約済みスロット（デモ用）
const bookedSlots = ['wed-10-00', 'wed-10-30'];

// 全時間帯のスロットを生成する関数
function generateAllTimeSlots() {
    const slots = [];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    // 9:00から23:00まで30分刻みでスロットを生成
    for (let hour = 9; hour <= 23; hour++) {
        for (let minute of ['00', '30']) {
            // 23:30は含めない
            if (hour === 23 && minute === '30') continue;
            
            // 各曜日について
            for (const day of days) {
                slots.push(`${day}-${hour}-${minute}`);
            }
        }
    }
    
    return slots;
}

// スロットデータ（デモ用）- 9:00から23:00までに拡張
const allSlots = generateAllTimeSlots();

// 講師ごとのZoomリンク（デモ用）
const teacherZoomLinks = {
    'tanaka': 'https://zoom.us/j/1234567890?pwd=abcdef',
    'suzuki': 'https://zoom.us/j/2345678901?pwd=bcdefg',
    'sato': 'https://zoom.us/j/3456789012?pwd=cdefgh',
    'nakamura': 'https://zoom.us/j/4567890123?pwd=defghi'
};

// 日付から曜日コードを取得する関数
function getDayCodeFromDate(date) {
    const dayIndex = date.getDay();
    const dayCodes = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return dayCodes[dayIndex];
}

// 日付をフォーマットする関数 (YYYY-MM-DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 日付を日本語表示用にフォーマットする関数 (YYYY年MM月DD日)
function formatDateJP(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 週の表示範囲を更新する関数
function updateWeekDisplay() {
    const endDate = new Date(currentWeekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const startFormatted = formatDateJP(currentWeekStartDate);
    const endFormatted = formatDateJP(endDate);
    
    // モバイル表示の場合は短縮表示
    if (window.innerWidth <= 480) {
        document.getElementById('current-week').textContent = `${currentWeekStartDate.getMonth()+1}/${currentWeekStartDate.getDate()}-${endDate.getMonth()+1}/${endDate.getDate()}`;
    } else if (window.innerWidth <= 768) {
        document.getElementById('current-week').textContent = `${currentWeekStartDate.getMonth()+1}月${currentWeekStartDate.getDate()}日-${endDate.getMonth()+1}月${endDate.getDate()}日`;
    } else {
        document.getElementById('current-week').textContent = `${startFormatted} - ${endFormatted}`;
    }
    
    // 日付入力フィールドも更新
    document.getElementById('date-from').value = formatDate(currentWeekStartDate);
    document.getElementById('date-to').value = formatDate(endDate);
}

// 検索ボタンのイベントリスナー
document.getElementById('search-button').addEventListener('click', function() {
    // 検索条件の取得
    const instrumentFilter = document.getElementById('instrument').value;
    const teacherFilter = document.getElementById('teacher').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    const lessonType = document.getElementById('lesson-type').value;
    
    // 日付範囲からcurrentWeekStartDateを更新
    if (dateFrom) {
        currentWeekStartDate = new Date(dateFrom);
        updateWeekDisplay();
    }
    
    // ローディング表示
    document.getElementById('loading-overlay').style.display = 'flex';
    
    // 実際のAPIリクエストの代わりにタイマーでシミュレート
    setTimeout(function() {
        // スケジュールの更新処理
        updateSchedule(instrumentFilter, teacherFilter, lessonType);
        
        // ローディング非表示
        document.getElementById('loading-overlay').style.display = 'none';
        
        // 検索結果表示
        document.getElementById('search-results').style.display = 'block';
        
        // モバイルビューの場合、検索後にフィルターを閉じる
        if (window.innerWidth <= 768) {
            document.getElementById('filter-content').classList.add('hidden');
            document.getElementById('toggle-filters').textContent = '▼ フィルターを表示';
        }
    }, 800);
});

// スケジュール更新関数
function updateSchedule(instrumentFilter, teacherFilter, lessonType) {
    // スケジュールグリッドをリセット
    const scheduleGrid = document.getElementById('schedule-grid');
    
    // すべての子要素を削除
    while (scheduleGrid.firstChild) {
        scheduleGrid.removeChild(scheduleGrid.firstChild);
    }
    
    // 現在のビューに基づいて表示を切り替え
    const activeViewButton = document.querySelector('.calendar-view-toggle button.active');
    if (!activeViewButton) {
        // デフォルトは週表示
        showWeekView(instrumentFilter, teacherFilter, lessonType);
        return;
    }
    
    const activeView = activeViewButton.id;
    
    if (activeView === 'day-view') {
        showDayView();
    } else if (activeView === 'month-view') {
        showMonthView();
    } else {
        // デフォルトは週表示
        showWeekView(instrumentFilter, teacherFilter, lessonType);
    }
}

// 週表示の実装
function showWeekView(instrumentFilter, teacherFilter, lessonType) {
    // スケジュールグリッドをリセット
    const scheduleGrid = document.getElementById('schedule-grid');
    
    // グリッドをクリア
    while (scheduleGrid.firstChild) {
        scheduleGrid.removeChild(scheduleGrid.firstChild);
    }
    
    // 週表示のスタイルを適用
    scheduleGrid.className = 'week-view';
    
    // モバイル対応 - スタイルをリセットして新しいクラスを追加
    scheduleGrid.style.minWidth = '';
    scheduleGrid.style.width = '100%';
    
    if (window.innerWidth <= 480) {
        scheduleGrid.classList.add('mobile-view');
    } else if (window.innerWidth <= 768) {
        scheduleGrid.classList.add('tablet-view');
    }
    
    // ヘッダー行を追加
    const headerEmpty = document.createElement('div');
    headerEmpty.className = 'day-header';
    scheduleGrid.appendChild(headerEmpty);
    
    // 曜日ヘッダーを追加
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const currentDate = new Date(currentWeekStartDate);
    
    days.forEach((day, index) => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        
        // 日付を計算して表示
        const date = new Date(currentDate);
        date.setDate(date.getDate() + days.indexOf(day));
        
        // 月/日 (曜)の形式で表示 - モバイル向けに短縮表示も考慮
        const month = date.getMonth() + 1;
        const dayOfMonth = date.getDate();
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // モバイル表示では日付と曜日のみ
            dayHeader.innerHTML = `${dayOfMonth}<br>(${dayMapping[day]})`;
        } else {
            dayHeader.textContent = `${month}/${dayOfMonth} (${dayMapping[day]})`;
        }
        
        scheduleGrid.appendChild(dayHeader);
    });
    
    // フィルタリングされた利用可能スロットを取得
    let availableSlots = getFilteredSlots(instrumentFilter, teacherFilter, lessonType);
    
    // 結果カウンターを更新
    const resultCount = document.getElementById('result-count');
    resultCount.textContent = availableSlots.length;
    
    // モバイルでは表示範囲を限定する (モバイルでは9:00-18:00だけ表示)
    const startHour = window.innerWidth <= 768 ? 9 : 9;
    const endHour = window.innerWidth <= 768 ? 18 : 23;
    
    // 時間スロット行を追加
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute of ['00', '30']) {
            // 23:30は含めない
            if (hour === 23 && minute === '30') continue;
            
            // 時間ラベルを追加
            const hourLabel = document.createElement('div');
            hourLabel.className = 'hour-label';
            
            // モバイルでは時間表示を短くする
            if (window.innerWidth <= 480) {
                hourLabel.textContent = `${hour}`;
            } else {
                hourLabel.textContent = `${hour}:${minute}`;
            }
            
            scheduleGrid.appendChild(hourLabel);
            
            // 各曜日の時間スロットを追加
            days.forEach(day => {
                const slotKey = `${day}-${hour}-${minute}`;
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                
                // 講師が利用可能かチェック
                if (availableSlots.includes(slotKey)) {
                    timeSlot.classList.add('available');
                    timeSlot.setAttribute('data-slot', slotKey);
                    
                    // クリックイベントで予約モーダルを表示
                    timeSlot.addEventListener('click', () => showBookingModal(slotKey));
                } else if (bookedSlots.includes(slotKey)) {
                    // 既に予約済みのスロット
                    const lessonCard = document.createElement('div');
                    lessonCard.className = 'lesson-card';
                    lessonCard.textContent = '予約済み';
                    timeSlot.appendChild(lessonCard);
                    timeSlot.classList.add('booked');
                }
                
                scheduleGrid.appendChild(timeSlot);
            });
        }
    }
}

// 予約モーダルを表示する関数
function showBookingModal(slotKey) {
    // スロットキーから日時情報を解析
    const [day, hour, minute] = slotKey.split('-');
    
    // スロットに対応する日付を計算
    const slotDate = new Date(currentWeekStartDate);
    const dayIndex = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(day);
    slotDate.setDate(slotDate.getDate() + dayIndex);
    
    // レッスン終了時間（50分後）
    const endHour = minute === '00' ? hour : parseInt(hour) + 1;
    const endMinute = minute === '00' ? '50' : '20';
    
    // 講師情報を取得
    let teacherKey = '';
    let teacherName = '';
    let instrumentName = '';
    
    for (const key in teachers) {
        if (teachers[key].slots.includes(slotKey)) {
            teacherKey = key;
            teacherName = teachers[key].name;
            
            // 楽器名を取得
            const instrumentMap = {
                'piano': 'ピアノ',
                'guitar': 'ギター',
                'violin': 'バイオリン',
                'vocal': 'ボーカル'
            };
            instrumentName = instrumentMap[teachers[key].instrument];
            break;
        }
    }
    
    // モーダルに情報を表示
    document.getElementById('booking-datetime').textContent = 
        `${formatDateJP(slotDate)}（${dayMapping[day]}） ${hour}:${minute} - ${endHour}:${endMinute}`;
    document.getElementById('booking-teacher').textContent = teacherName;
    document.getElementById('booking-instrument').textContent = instrumentName;
    document.getElementById('booking-type').textContent = '通常レッスン';
    
    // Zoomリンクを更新
    document.getElementById('zoom-link').value = teacherZoomLinks[teacherKey] || 'https://zoom.us/j/1234567890?pwd=abcdefg';
    
    // モーダルを表示
    document.getElementById('booking-modal').style.display = 'flex';
}

// 日表示・月表示の実装（プレースホルダー）
function showDayView() {
    const scheduleGrid = document.getElementById('schedule-grid');
    scheduleGrid.className = 'day-view';
    scheduleGrid.innerHTML = '<p style="padding:20px;">日表示は開発中です。現在は週表示のみご利用いただけます。</p>';
}

function showMonthView() {
    const scheduleGrid = document.getElementById('schedule-grid');
    scheduleGrid.className = 'month-view';
    scheduleGrid.innerHTML = '<p style="padding:20px;">月表示は開発中です。現在は週表示のみご利用いただけます。</p>';
}

// フィルタリングされたスロットを取得する関数
function getFilteredSlots(instrumentFilter, teacherFilter, lessonType) {
    let filteredSlots = [];
    
    // 講師とフィルターに基づいてスロットをフィルタリング
    for (const teacherKey in teachers) {
        const teacher = teachers[teacherKey];
        
        // 楽器フィルターをチェック
        if (instrumentFilter !== 'all' && teacher.instrument !== instrumentFilter) continue;
        
        // 講師フィルターをチェック
        if (teacherFilter !== 'all' && teacherKey !== teacherFilter) continue;
        
        // このフィルター条件に合致する講師のスロットを追加
        filteredSlots = filteredSlots.concat(teacher.slots);
    }
    
    // すでに予約済みのスロットを除外
    filteredSlots = filteredSlots.filter(slot => !bookedSlots.includes(slot));
    
    return filteredSlots;
}

// モーダルを閉じる処理
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('booking-modal').style.display = 'none';
});

document.getElementById('cancel-booking').addEventListener('click', () => {
    document.getElementById('booking-modal').style.display = 'none';
});

// 予約確定処理
document.getElementById('confirm-booking').addEventListener('click', () => {
    // ローディングを表示
    document.getElementById('loading-overlay').style.display = 'flex';
    
    // 実際の予約処理の代わりにタイマーでシミュレート
    setTimeout(function() {
        // 予約モーダルを閉じる
        document.getElementById('booking-modal').style.display = 'none';
        
        // ローディングを非表示
        document.getElementById('loading-overlay').style.display = 'none';
        
        // 予約完了メッセージ（簡略化のためアラートで）
        alert('レッスンの予約が完了しました！');
        
        // スケジュールを更新
        updateSchedule(
            document.getElementById('instrument').value,
            document.getElementById('teacher').value,
            document.getElementById('lesson-type').value
        );
    }, 1000);
});

// Zoomリンクコピー機能
document.getElementById('copy-zoom-link').addEventListener('click', function() {
    const zoomLink = document.getElementById('zoom-link');
    zoomLink.select();
    
    // モダンなクリップボードAPI（iOS Safariなどでも動作）を使用
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(zoomLink.value)
            .then(() => {
                // コピー成功メッセージを表示
                const copySuccess = document.getElementById('copy-success');
                copySuccess.style.display = 'block';
                
                // 3秒後にメッセージを非表示
                setTimeout(() => {
                    copySuccess.style.display = 'none';
                }, 3000);
            })
            .catch(err => {
                // フォールバック: execCommandを試す
                fallbackCopy(zoomLink);
            });
    } else {
        // 古いブラウザ向けフォールバック
        fallbackCopy(zoomLink);
    }
});

// コピー機能のフォールバック
function fallbackCopy(element) {
    element.select();
    const success = document.execCommand('copy');
    
    if (success) {
        // コピー成功メッセージを表示
        const copySuccess = document.getElementById('copy-success');
        copySuccess.style.display = 'block';
        
        // 3秒後にメッセージを非表示
        setTimeout(() => {
            copySuccess.style.display = 'none';
        }, 3000);
    } else {
        alert('コピーに失敗しました。URLを手動でコピーしてください。');
    }
}

// 週の移動ボタンのイベントリスナー
document.getElementById('prev-week').addEventListener('click', function() {
    // 前の週へ
    currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    updateWeekDisplay();
    
    // 検索ボタンをクリック
    document.getElementById('search-button').click();
});

document.getElementById('next-week').addEventListener('click', function() {
    // 次の週へ
    currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    updateWeekDisplay();
    
    // 検索ボタンをクリック
    document.getElementById('search-button').click();
});

// ビューの切り替えボタンのイベントリスナー
document.querySelectorAll('.calendar-view-toggle button').forEach(button => {
    button.addEventListener('click', function() {
        // 現在のアクティブクラスを削除
        document.querySelectorAll('.calendar-view-toggle button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // クリックされたボタンにアクティブクラスを追加
        this.classList.add('active');
        
        // 検索ボタンをクリック
        document.getElementById('search-button').click();
    });
});

// フィルターの表示・非表示を切り替えるボタンのイベントリスナー
document.getElementById('toggle-filters').addEventListener('click', function() {
    const filterContent = document.getElementById('filter-content');
    
    // hiddenクラスの有無でトグル
    if (filterContent.classList.contains('hidden')) {
        filterContent.classList.remove('hidden');
        this.textContent = '▲ フィルターを非表示';
    } else {
        filterContent.classList.add('hidden');
        this.textContent = '▼ フィルターを表示';
    }
});

// ウィンドウサイズ変更時のレスポンシブ対応
window.addEventListener('resize', function() {
    // サイズ変更のタイミングでリサイズイベントを間引く
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
        // 週の表示を更新（画面サイズに応じてフォーマットを変更）
        updateWeekDisplay();
        
        // 現在の検索条件でスケジュールを更新（カレンダーの表示サイズを最適化するため）
        updateSchedule(
            document.getElementById('instrument').value,
            document.getElementById('teacher').value,
            document.getElementById('lesson-type').value
        );
    }, 250); // 250ミリ秒の遅延を設定
});

// スケジュールグリッドの生成が失敗した場合のフォールバック関数
function createTimeHeader() {
    const header = document.createElement('div');
    header.className = 'hour-label';
    header.textContent = '';
    return header;
}

// 日付ヘッダーを生成する関数
function createDayHeader(date) {
    const header = document.createElement('div');
    header.className = 'day-header';
    
    const dayCode = getDayCodeFromDate(date);
    const dayName = dayMapping[dayCode];
    
    // 月/日 (曜)の形式で表示
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (window.innerWidth <= 480) {
        header.innerHTML = `${day}<br>(${dayName})`;
    } else {
        header.textContent = `${month}/${day} (${dayName})`;
    }
    
    return header;
}

// 楽器名を取得する関数（フィルタリング用）
function getInstrumentName(code) {
    const instrumentMap = {
        'piano': 'ピアノ',
        'guitar': 'ギター',
        'violin': 'バイオリン',
        'vocal': 'ボーカル'
    };
    return instrumentMap[code] || code;
}

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // 現在の日付から最も近い月曜日を計算して初期表示
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=日, 1=月, ..., 6=土
    const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek - 1;
    
    currentWeekStartDate = new Date(today);
    currentWeekStartDate.setDate(today.getDate() - daysToMonday);
    
    // 週の表示を更新
    updateWeekDisplay();
    
    // 初期スケジュール表示
    updateSchedule('all', 'all', 'all');
    
    // 検索結果表示エリアを表示
    document.getElementById('search-results').style.display = 'block';
    document.getElementById('result-count').textContent = getFilteredSlots('all', 'all', 'all').length;
    
    // モバイルビューの場合、フィルターを最初は非表示にする
    if (window.innerWidth <= 768) {
        document.getElementById('filter-content').classList.add('hidden');
        document.getElementById('toggle-filters').textContent = '▼ フィルターを表示';
    }
    
    // iOS Safariでの位置固定要素のバグを修正
    document.body.addEventListener('touchmove', function(e) {
        if (document.getElementById('booking-modal').style.display === 'flex' ||
            document.getElementById('loading-overlay').style.display === 'flex') {
            e.preventDefault();
        }
    }, { passive: false });
});