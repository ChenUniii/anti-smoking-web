/* JavaScript 邏輯區：負責互動功能 */
const scenarios = [
    {
        image: "article_445_1_b.jpg",
        title: "🏫 校園角落的「減壓」誘惑",
        text: "下課後，學長在校園角落遞給你一支菸，說「試試看，這能舒緩期中考壓力」，你會？",
        btn1: "接過來抽",
        btn2: "婉言拒絕",
        resSmoke: "❌ <b>短暫的放鬆，長期的負擔。</b><br>吸菸會導致心跳加速、皮膚失去彈性。醫學研究顯示，每一根菸會減少約 11 分鐘的壽命。",
        resRefuse: "✅ <b>明智的選擇！</b><br>你省下了 125 元，且維持了乾淨的肺部。這筆錢一年下來可以讓你買到心儀的吉他配件或是一頓大餐！"
    },
    {
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        title: "🍓 派對上的無害謊言？",
        text: "朋友聚會上，大家都在抽電子菸，有人遞給你一支說「這是水果口味的，沒有尼古丁啦，吸一口沒關係」，你會？",
        btn1: "吸一口試試",
        btn2: "堅定拒絕",
        resSmoke: "❌ <b>小心甜蜜的陷阱！</b><br>許多標榜無尼古丁的電子菸實際仍含有害化學物質與重金屬，長期吸入同樣會造成肺部嚴重發炎與損傷。",
        resRefuse: "✅ <b>堅持底線，保護自己！</b><br>你成功避開了未知的化學危害。真正的朋友會尊重你不吸菸的決定，不需要勉強自己迎合他人。"
    },
    {
        image: "熬夜.jpg",
        title: "🦉 熬夜趕工的提神陷阱",
        text: "連續熬夜好幾天趕報告，覺得精神緊繃到極點，這時室友說「去陽台抽根菸提神吧，我請客」，你會？",
        btn1: "抽一根提神",
        btn2: "喝水休息",
        resSmoke: "❌ <b>提神是假象，成癮是真相。</b><br>尼古丁帶來的短暫亢奮退去後，會讓人感到更疲憊與焦慮，反而降低專注力與工作效率。",
        resRefuse: "✅ <b>健康才是最強的後盾！</b><br>用健康的方式放鬆（如喝水、伸展或小睡），報告才能寫得更長遠！"
    },
    {
        image: "images.jpeg",
        title: "🏠 長輩面前的無聲妥協",
        text: "家庭聚餐時，長輩在客廳直接點起菸來，雖然覺得有點嗆，但你怕破壞氣氛，你會？",
        btn1: "默默忍受",
        btn2: "委婉勸阻",
        resSmoke: "❌ <b>沉默會讓你吸入更多毒素。</b><br>二手菸含有超過7000種化學物質，其中數十種致癌。為了自己與家人的健康，不應妥協。",
        resRefuse: "✅ <b>勇敢發聲，守護全家！</b><br>你委婉地請長輩到室外抽菸，不僅保護了自己的肺，也減少了屋內三手菸的殘留，大家都受益。"
    }
];

let audioCtx;

// 利用 Web Audio API 產生簡單音效，不需要外部音檔
function playSound(isSuccess) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (isSuccess) {
        // 成功：清脆的雙音（叮咚）
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    } else {
        // 錯誤：低沉的警告音（叭叭）
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

// 自動將所有題目渲染到畫面上
function renderScenarios() {
    const container = document.getElementById('scenarios-container');
    container.innerHTML = '';
    
    scenarios.forEach((current, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${current.image}" alt="${current.title}" class="scenario-img">
            <h3 style="color: var(--primary-dark);">${current.title}</h3>
            <p style="flex-grow: 1; font-weight: bold; color: #444;">${current.text}</p>
            <div class="btn-box">
                <button id="btn-smoke-${index}" class="btn-smoke" onclick="playGame(${index}, 'smoke')">${current.btn1}</button>
                <button id="btn-refuse-${index}" class="btn-refuse" onclick="playGame(${index}, 'refuse')">${current.btn2}</button>
            </div>
            <div id="result-box-${index}" class="result-box"></div>
        `;
        container.appendChild(card);
    });
}

function playGame(index, choice) {
    const current = scenarios[index];
    const resultBox = document.getElementById(`result-box-${index}`);
    const btnSmoke = document.getElementById(`btn-smoke-${index}`);
    const btnRefuse = document.getElementById(`btn-refuse-${index}`);
    
    // 每次點擊先清除前一次的動畫 class，並觸發重繪 (Reflow) 讓動畫能重新播放
    resultBox.className = 'result-box';
    void resultBox.offsetWidth; 
    
    resultBox.style.display = 'block';
    btnSmoke.disabled = true;
    btnRefuse.disabled = true;
    
    if (choice === 'smoke') {
        playSound(false);
        resultBox.classList.add('anim-shake');
        resultBox.innerHTML = current.resSmoke;
        resultBox.style.background = "#fdecea";
        resultBox.style.color = "#c0392b";
        resultBox.style.border = "1px solid #f5c6cb";
    } else {
        playSound(true);
        resultBox.classList.add('anim-success');
        resultBox.innerHTML = current.resRefuse;
        resultBox.style.background = "#eafaf1";
        resultBox.style.color = "#27ae60";
        resultBox.style.border = "1px solid #c3e6cb";
    }
}

// 網頁載入時初始化所有情境
window.onload = renderScenarios;

// 監聽網頁滾動，控制「回到最上方」按鈕顯示與隱藏
window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
});