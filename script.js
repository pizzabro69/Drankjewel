let players = [];
let currentPlayerIndex = 0;
let currentChallenge = null;
let isSpinning = false;
let wheelSegmentsData = [];
let isNextTurnCursed = false;
let isNextTurnLegendary = false;
let isReversed = false;
let globalRules = [];

// ==========================================
// SPECIFIC PLAYER CHALLENGES
// ==========================================
// Add challenges here for specific players (lowercase names).
// If a player is listed here, they have a high chance to get one of these challenges
// provided the current wheel has a slot for that rarity.
const specificPlayerChallenges = {
    "niek": [
        { type: "CURSED", rarity: "CURSED", text: "Niek's Personal Hell: Finish your drink.", points: 0, sips: 0, isFinish: true },
        { type: "DARE", rarity: "EPIC", text: "Niek, send a risky text to your boss.", points: 500, sips: 10 }
    ],
    "pizza": [
        { type: "LEGENDARY", rarity: "LEGENDARY", text: "Pizza's Blessing: Give out 5 sips.", points: 100, sips: 0 }
    ]
};

// Sound Manager
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const SoundManager = {
    playTone: (freq, type, duration, vol = 0.1) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },
    
    playTick: () => {
        // High pitch tick
        SoundManager.playTone(800, 'square', 0.05, 0.05);
    },
    
    playWin: () => {
        // Major chord arpeggio
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => SoundManager.playTone(freq, 'sine', 0.5, 0.2), i * 100);
        });
    },

    playLegendary: () => {
        // Epic Fanfare (C Major ascending + high C hold)
        const now = audioCtx.currentTime;
        // C4, E4, G4, C5, E5, G5
        [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((freq, i) => {
            setTimeout(() => SoundManager.playTone(freq, 'triangle', 0.6, 0.3), i * 80);
        });
        // Final high C punch
        setTimeout(() => SoundManager.playTone(1046.50, 'square', 1.0, 0.2), 600);
    },
    
    playCursed: () => {
        // Dissonant Horror Sound (Tritone + Cluster)
        // C3, F#3, C#3
        SoundManager.playTone(130.81, 'sawtooth', 1.5, 0.4);
        SoundManager.playTone(185.00, 'sawtooth', 1.5, 0.4);
        setTimeout(() => SoundManager.playTone(138.59, 'sawtooth', 1.5, 0.4), 100);
        
        // Descending slide effect simulation
        setTimeout(() => SoundManager.playTone(100, 'sawtooth', 1.0, 0.3), 500);
        setTimeout(() => SoundManager.playTone(80, 'sawtooth', 1.0, 0.3), 800);
    },
    
    playPoints: () => {
        // Satisfying "Ka-ching" / Ding
        SoundManager.playTone(1567.98, 'sine', 0.3, 0.1); // G6
        setTimeout(() => SoundManager.playTone(2093.00, 'sine', 0.6, 0.1), 100); // C7
    },
    
    playBuy: () => {
        // Coin sound (two high beeps)
        SoundManager.playTone(1200, 'sine', 0.1, 0.1);
        setTimeout(() => SoundManager.playTone(1600, 'sine', 0.2, 0.1), 100);
    }
};

// Persistence
function saveGame() {
    const gameState = {
        players: players,
        currentPlayerIndex: currentPlayerIndex,
        gameStarted: !document.getElementById('game-screen').classList.contains('hidden'),
        isNextTurnCursed: isNextTurnCursed,
        isNextTurnLegendary: isNextTurnLegendary,
        isReversed: isReversed,
        globalRules: globalRules
    };
    localStorage.setItem('drankjewel_save', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('drankjewel_save');
    if (saved) {
        const gameState = JSON.parse(saved);
        players = gameState.players;
        
        // Migration: Ensure all players have activeRules array
        players.forEach(p => {
            if (!p.activeRules) p.activeRules = [];
        });

        currentPlayerIndex = gameState.currentPlayerIndex;
        isNextTurnCursed = gameState.isNextTurnCursed || false;
        isNextTurnLegendary = gameState.isNextTurnLegendary || false;
        isReversed = gameState.isReversed || false;
        globalRules = gameState.globalRules || [];
        
        if (gameState.gameStarted && players.length > 0) {
            document.getElementById('setup-screen').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
            generateWheel();
            updateLeaderboard();
            updateTurnIndicator();
            updateGlobalRulesDisplay();
        } else {
            updatePlayerList();
            checkStartButton();
        }
    }
}

function resetGame() {
    if(confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        localStorage.removeItem('drankjewel_save');
        location.reload();
    }
}

// Initialize
window.onload = loadGame;

// Setup Functions
function handleEnter(event) {
    if (event.key === 'Enter') {
        addPlayer();
    }
}

function addPlayer() {
    const input = document.getElementById('player-name');
    const name = input.value.trim();
    
    if (name) {
        players.push({ name: name, score: 0, sips: 0, shots: 0, doublePoints: false, activeRules: [] });
        input.value = '';
        updatePlayerList();
        checkStartButton();
        saveGame();
    }
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
    checkStartButton();
    saveGame();
}

function updatePlayerList() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = 'player-tag';
        li.innerHTML = `
            ${player.name}
            <span class="remove-player" onclick="removePlayer(${index})">�</span>
        `;
        list.appendChild(li);
    });
}

function checkStartButton() {
    const btn = document.getElementById('start-btn');
    btn.disabled = players.length < 2;
}

function startGame() {
    if (players.length < 2) return;
    
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    generateWheel();
    updateLeaderboard();
    updateTurnIndicator();
    saveGame();
}

// Game Logic
function generateWheel() {
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = ''; // Clear existing labels
    
    // Define segment types and their "weight" (size)
    // Weights are now equal (1) so that probability is determined purely by the number of segments (slices)
    const segmentTypes = [
        { type: 'COMMON', color: 'var(--common)', weight: 1, label: 'COMMON' },
        { type: 'RARE', color: 'var(--rare)', weight: 1, label: 'RARE' },
        { type: 'EPIC', color: 'var(--epic)', weight: 1, label: 'EPIC' },
        { type: 'LEGENDARY', color: 'var(--legendary)', weight: 1, label: 'LEGEND' },
        { type: 'CURSED', color: 'var(--cursed)', weight: 1, label: 'CURSED' }
    ];

    // Create a pool of segments
    let segments = [];
    
    if (isNextTurnCursed) {
        // CURSED WHEEL GENERATION
        for(let i=0; i<1; i++) segments.push(segmentTypes[0]); // 1 Common (Hope)
        for(let i=0; i<2; i++) segments.push(segmentTypes[3]); // 2 Legendaries (High Risk/Reward)
        for(let i=0; i<12; i++) segments.push(segmentTypes[4]); // 12 Cursed (DOOM)
        
        // Reset the curse for the turn after
        isNextTurnCursed = false;
        
        // Visual indicator for cursed wheel
        wheel.style.boxShadow = "0 0 50px var(--cursed), inset 0 0 100px var(--cursed)";
    } else if (isNextTurnLegendary) {
        // LEGENDARY WHEEL GENERATION
        for(let i=0; i<1; i++) segments.push(segmentTypes[4]); // 1 Cursed (Risk)
        for(let i=0; i<2; i++) segments.push(segmentTypes[0]); // 2 Common (Dud)
        for(let i=0; i<5; i++) segments.push(segmentTypes[2]); // 5 Epic (Great)
        for(let i=0; i<10; i++) segments.push(segmentTypes[3]); // 10 Legendary (JACKPOT)
        
        // Reset the blessing for the turn after
        isNextTurnLegendary = false;
        
        // Visual indicator for legendary wheel
        wheel.style.boxShadow = "0 0 50px var(--legendary), inset 0 0 100px var(--legendary)";
    } else {
        // NORMAL WHEEL GENERATION
        // Add a base amount to ensure variety
        for(let i=0; i<8; i++) segments.push(segmentTypes[0]); // 8 Commons
        for(let i=0; i<5; i++) segments.push(segmentTypes[1]); // 5 Rares
        for(let i=0; i<3; i++) segments.push(segmentTypes[2]); // 3 Epics
        for(let i=0; i<2; i++) segments.push(segmentTypes[3]); // 2 Legendaries
        for(let i=0; i<2; i++) segments.push(segmentTypes[4]); // 2 Cursed
        
        wheel.style.boxShadow = ""; // Reset shadow
    }
    
    // Shuffle segments
    segments.sort(() => Math.random() - 0.5);
    
    // Calculate total weight
    const totalWeight = segments.reduce((sum, seg) => sum + seg.weight, 0);
    
    let currentAngle = 0;
    let gradientParts = [];
    wheelSegmentsData = []; // Reset data
    
    segments.forEach(seg => {
        const angleSize = (seg.weight / totalWeight) * 360;
        const endAngle = currentAngle + angleSize;
        
        // Store segment data for spin logic
        wheelSegmentsData.push({
            type: seg.type,
            start: currentAngle,
            end: endAngle
        });
        
        // Add to gradient
        gradientParts.push(`${seg.color} ${currentAngle}deg ${endAngle}deg`);
        
        // Add text label
        const label = document.createElement('div');
        label.className = `wheel-label label-${seg.type.toLowerCase()}`;
        label.innerText = seg.label;
        // Position text in the middle of the segment
        const midAngle = currentAngle + (angleSize / 2);
        // -200px pushes it towards the edge (radius is 250px)
        // Rotate 90deg to make text radial (pointing outwards)
        label.style.transform = `rotate(${midAngle}deg) translateY(-200px) rotate(90deg)`; 
        wheel.appendChild(label);
        
        currentAngle = endAngle;
    });
    
    wheel.style.background = `conic-gradient(${gradientParts.join(', ')})`;
}

function updateLeaderboard() {
    const list = document.getElementById('leaderboard');
    list.innerHTML = '';
    
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    sortedPlayers.forEach(player => {
        const li = document.createElement('li');
        li.className = 'leaderboard-item';
        if (player === players[currentPlayerIndex]) {
            li.classList.add('active-player');
        }
        
        let rulesHtml = '';
        if (player.activeRules && player.activeRules.length > 0) {
            rulesHtml = `<div class="lb-rules" style="font-size: 0.8em; color: #ffcc00; margin-top: 4px;">
                ${player.activeRules.map(r => {
                    const text = typeof r === 'string' ? r : r.text;
                    return `⚠️ ${text}`;
                }).join('<br>')}
            </div>`;
        }

        li.innerHTML = `
            <div class="lb-name">${player.name} ${player.doublePoints ? '<span style="color: var(--legendary); font-weight:bold; font-size: 0.8em;">[x2]</span>' : ''}</div>
            <div class="lb-info">
                <div class="lb-score">${player.score} 💎</div>
                <div class="lb-drinks">🍺 ${player.sips} | 🥃 ${player.shots}</div>
            </div>
            ${rulesHtml}
        `;
        list.appendChild(li);
    });
}

function updateGlobalRulesDisplay() {
    const container = document.getElementById('global-rules-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    globalRules.forEach(rule => {
        const div = document.createElement('div');
        div.className = 'global-rule-item';
        div.innerText = `📜 ${rule}`;
        container.appendChild(div);
    });
}

function updateTurnIndicator() {
    const currentPlayer = players[currentPlayerIndex];
    const header = document.querySelector('header p');
    header.innerHTML = `It's <span style="color: var(--rare); font-weight: bold; text-transform: uppercase; font-size: 1.5rem;">${currentPlayer.name}'s</span> turn!`;
}

function spinWheel() {
    if (isSpinning) return;
    
    document.getElementById('card-display').classList.add('hidden');
    
    isSpinning = true;
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    spinBtn.innerText = '...';
    
    // 1. Pick a random segment from the wheel (weighted by size implicitly)
    // Since all segments now have weight 1, picking a random segment from the array
    // gives the exact probability based on the count of segments.
    // Normal Wheel: 8 Common (40%), 5 Rare (25%), 3 Epic (15%), 2 Legendary (10%), 2 Cursed (10%)
    let targetSegment;
    const currentPlayer = players[currentPlayerIndex];
    const playerName = currentPlayer.name.toLowerCase();
    
    // Check for specific challenges
    let forcedChallenge = null;
    if (specificPlayerChallenges[playerName]) {
        // Filter challenges that fit on the current wheel
        const availableRarities = wheelSegmentsData.map(s => s.type);
        const validSpecifics = specificPlayerChallenges[playerName].filter(c => availableRarities.includes(c.rarity));
        
        if (validSpecifics.length > 0 && Math.random() < 0.7) { // 70% chance to trigger
            forcedChallenge = validSpecifics[Math.floor(Math.random() * validSpecifics.length)];
            console.log(`Triggered specific challenge for ${playerName}: ${forcedChallenge.text}`);
        }
    }

    if (forcedChallenge) {
        // Find a segment that matches
        const matchingSegments = wheelSegmentsData.filter(s => s.type === forcedChallenge.rarity);
        targetSegment = matchingSegments[Math.floor(Math.random() * matchingSegments.length)];
        currentChallenge = forcedChallenge;
    } else {
        // Standard Logic
        targetSegment = wheelSegmentsData[Math.floor(Math.random() * wheelSegmentsData.length)];
        
        // Pick random challenge matching rarity
        const matchingChallenges = challenges.filter(c => c.rarity === targetSegment.type);
        if (matchingChallenges.length > 0) {
            currentChallenge = matchingChallenges[Math.floor(Math.random() * matchingChallenges.length)];
        } else {
            currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        }
    }
    
    // 3. Calculate angle to land on that segment
    const buffer = 2; 
    const randomOffset = Math.random() * (targetSegment.end - targetSegment.start - 2 * buffer) + buffer;
    const targetAngle = targetSegment.start + randomOffset;
    
    // Calculate rotation: 5 full spins + distance to target (360 - targetAngle brings it to top)
    const finalRotation = (360 * 5) + (360 - targetAngle);
    
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    
    // Play tick sounds
    let tickCount = 0;
    const maxTicks = 20;
    const tickInterval = setInterval(() => {
        SoundManager.playTick();
        tickCount++;
        if (tickCount >= maxTicks) clearInterval(tickInterval);
    }, 150); // Simple constant ticking for now
    
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.innerText = 'SPIN!';
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${finalRotation % 360}deg)`;
        wheel.offsetHeight; 
        wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        
        if (currentChallenge.rarity === 'CURSED') {
            SoundManager.playCursed();
            triggerScreenShake();
            createParticles(window.innerWidth / 2, window.innerHeight / 2, 'var(--cursed)');
            document.body.classList.add('glitch-mode');
        } else if (currentChallenge.rarity === 'LEGENDARY') {
            SoundManager.playLegendary();
            createParticles(window.innerWidth / 2, window.innerHeight / 2, 'var(--legendary)');
            document.body.classList.add('legendary-mode');
        } else if (currentChallenge.rarity === 'EPIC') {
            SoundManager.playWin();
            createParticles(window.innerWidth / 2, window.innerHeight / 2, 'var(--epic)');
            document.body.classList.add('epic-mode');
        } else {
            SoundManager.playWin();
            const colorVar = `var(--${currentChallenge.rarity.toLowerCase()})`;
            createParticles(window.innerWidth / 2, window.innerHeight / 2, colorVar);
        }
        
        showChallenge();
    }, 4000);
}

function showChallenge() {
    // Challenge is already picked in spinWheel
    
    const card = document.getElementById('card-display');
    const title = document.getElementById('card-title');
    const rarity = document.getElementById('card-rarity');
    const text = document.getElementById('card-text');
    const actions = document.getElementById('card-actions');
    
    // Reset classes and trigger reflow for animation
    card.className = '';
    void card.offsetWidth; // Trigger reflow
    card.classList.add(`card-${currentChallenge.rarity.toLowerCase()}`);
    card.classList.add('card-reveal');
    
    title.innerText = currentChallenge.type;
    title.style.color = `var(--${currentChallenge.rarity.toLowerCase()})`;
    
    rarity.innerText = currentChallenge.rarity;
    rarity.style.color = `var(--${currentChallenge.rarity.toLowerCase()})`;
    rarity.style.borderColor = `var(--${currentChallenge.rarity.toLowerCase()})`;
    
    text.innerText = currentChallenge.text;
    
    if (currentChallenge.text.includes("DRINKING BUDDY")) {
        actions.innerHTML = `<p style="margin-bottom: 10px; color: #fff;">Pick your Drinking Buddy:</p>`;
        const buddyContainer = document.createElement('div');
        buddyContainer.style.display = 'flex';
        buddyContainer.style.flexWrap = 'wrap';
        buddyContainer.style.gap = '10px';
        buddyContainer.style.justifyContent = 'center';
        
        players.forEach((p, index) => {
            if (index !== currentPlayerIndex) { // Can't pick yourself
                const btn = document.createElement('button');
                btn.innerText = p.name;
                btn.style.fontSize = '0.9rem';
                btn.style.padding = '8px 12px';
                btn.style.background = 'var(--legendary)';
                btn.onclick = () => selectDrinkingBuddy(index);
                buddyContainer.appendChild(btn);
            }
        });
        actions.appendChild(buddyContainer);
    } else if (currentChallenge.type === 'VOTE' || currentChallenge.type === 'GAME') {
        actions.innerHTML = `<p style="margin-bottom: 10px; color: #fff;">Who lost the ${currentChallenge.type === 'VOTE' ? 'vote' : 'game'}?</p>`;
        const voteContainer = document.createElement('div');
        voteContainer.style.display = 'flex';
        voteContainer.style.flexWrap = 'wrap';
        voteContainer.style.gap = '10px';
        voteContainer.style.justifyContent = 'center';
        
        players.forEach((p, index) => {
            const btn = document.createElement('button');
            btn.innerText = p.name;
            btn.style.fontSize = '0.9rem';
            btn.style.padding = '8px 12px';
            btn.style.background = 'var(--primary)';
            btn.onclick = () => completeVote(index);
            voteContainer.appendChild(btn);
        });
        actions.appendChild(voteContainer);
    } else if (currentChallenge.sips > 0 || currentChallenge.isShot || currentChallenge.isFinish) {
        let drinkText = `${currentChallenge.sips} sips`;
        if (currentChallenge.isShot) drinkText = "TAKE A SHOT";
        if (currentChallenge.isFinish) drinkText = "FINISH DRINK";
        
        actions.innerHTML = `
            <button onclick="completeChallenge(true)">Do it (+${currentChallenge.points} pts)</button>
            <button onclick="completeChallenge(false)" style="background: #ff4444;">Drink (${drinkText})</button>
        `;
    } else {
        actions.innerHTML = `
            <button onclick="completeChallenge(true)">Next Turn</button>
        `;
    }
    
    card.classList.remove('hidden');
}

function selectDrinkingBuddy(buddyIndex) {
    const buddy = players[buddyIndex];
    const currentPlayer = players[currentPlayerIndex];
    
    // Ensure activeRules exists
    if (!buddy.activeRules) {
        buddy.activeRules = [];
    }

    // Add permanent rule to the buddy
    buddy.activeRules.push({
        text: `Drinking Buddy (of ${currentPlayer.name})`,
        type: 'permanent'
    });
    
    alert(`${buddy.name} is now ${currentPlayer.name}'s Drinking Buddy! They must drink whenever ${currentPlayer.name} drinks.`);
    
    completeChallenge(true);
}

function completeVote(loserIndex) {
    const loser = players[loserIndex];
    
    // Apply sips to loser
    if (currentChallenge.sips > 0) {
        loser.sips += currentChallenge.sips;
    }
    
    // Visual feedback
    alert(`${loser.name} lost and takes ${currentChallenge.sips} sips!`);
    
    // Proceed with turn (Current player gets points if any, turn advances)
    completeChallenge(true);
}

function completeChallenge(success) {
    const player = players[currentPlayerIndex];

    // Handle Special Card Effects (Buffs/Actions)
    if (success) {
        if (currentChallenge.text.includes("DOUBLE POINTS")) {
            player.doublePoints = true;
            alert("DOUBLE POINTS ACTIVATED! All future points are x2!");
        }
        
        if (currentChallenge.text.includes("ROBIN HOOD")) {
            // Find richest player
            let richest = players[0];
            players.forEach(p => { if(p.score > richest.score) richest = p; });
            
            if (richest !== player && richest.score > 0) {
                const stealAmount = Math.floor(richest.score * 0.5);
                richest.score -= stealAmount;
                player.score += stealAmount;
                alert(`ROBIN HOOD! You stole ${stealAmount} points from ${richest.name}!`);
            }
        }

        if (currentChallenge.text.includes("MERCY")) {
             player.sips = 0;
             alert("MERCY! Your sips have been reset to 0.");
        }

        if (currentChallenge.text.includes("VAMPIRE")) {
            player.activeRules.push({
                text: "🧛 Vampire",
                type: 'permanent'
            });
            alert("VAMPIRE! You are now a Vampire. Whenever you drink, pick someone to drink with you!");
        }

        if (currentChallenge.text.includes("GOD MODE")) {
            const newRule = prompt("GOD MODE ACTIVATED! Enter a new rule for the game:");
            if (newRule && newRule.trim() !== "") {
                globalRules.push(newRule.trim());
                updateGlobalRulesDisplay();
                alert(`NEW RULE ADDED: ${newRule}`);
            }
        }

        if (currentChallenge.text.includes("REVERSE")) {
            isReversed = !isReversed;
            alert(`TURN ORDER REVERSED! It is now going ${isReversed ? 'Counter-Clockwise' : 'Clockwise'}!`);
        }
        
        // Handle Rules (Duration: Until next turn)
        if (currentChallenge.type === 'RULE' && currentChallenge.text.includes("until")) {
            // Extract rule name or short description
            let ruleName = currentChallenge.text.split(':')[0];
            if (ruleName.length > 20) ruleName = "New Rule";
            
            player.activeRules.push({
                text: ruleName,
                type: 'temporary'
            });
            alert(`RULE APPLIED: ${ruleName} (Lasts until your next turn)`);
        }
    }

    if (success && currentChallenge.points > 0) {
        let pointsToAdd = currentChallenge.points;
        
        // Apply Double Points Buff
        if (player.doublePoints) {
            pointsToAdd *= 2;
        }
        
        player.score += pointsToAdd;
        SoundManager.playPoints();
    } else if (!success) {
        // Track drinks if they failed/chose to drink
        if (currentChallenge.isShot) {
            player.shots += 1;
        } else if (currentChallenge.isFinish) {
            player.sips += 10; // Count finish as 10 sips
        } else if (currentChallenge.sips > 0) {
            player.sips += currentChallenge.sips;
        }
    }
    
    // Check for Curse Next Turn effect
    if (currentChallenge.isCurseNext) {
        isNextTurnCursed = true;
        alert("THE NEXT PLAYER IS CURSED! BEWARE THE WHEEL!");
    } else if (currentChallenge.isLegendaryNext) {
        isNextTurnLegendary = true;
        alert("THE NEXT PLAYER IS BLESSED! THE LEGENDARY WHEEL AWAITS!");
    }
    
    document.getElementById('card-display').classList.add('hidden');
    document.body.classList.remove('glitch-mode', 'legendary-mode', 'epic-mode');
    
    // Check for Spin Again
    let shouldAdvanceTurn = true;
    if (success && currentChallenge.text.includes("Spin again")) {
        shouldAdvanceTurn = false;
        alert("SPIN AGAIN! It's still your turn.");
    }

    if (shouldAdvanceTurn) {
        if (isReversed) {
            currentPlayerIndex = (currentPlayerIndex - 1 + players.length) % players.length;
        } else {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        }
        
        // Check if the NEW current player has any active rules to expire
        const nextPlayer = players[currentPlayerIndex];
        if (nextPlayer.activeRules && nextPlayer.activeRules.length > 0) {
            const tempRules = nextPlayer.activeRules.filter(r => typeof r === 'string' || r.type === 'temporary');
            
            if (tempRules.length > 0) {
                const ruleTexts = tempRules.map(r => typeof r === 'string' ? r : r.text);
                alert(`Rules Expired for ${nextPlayer.name}: \n${ruleTexts.join('\n')}`);
                
                // Keep only permanent rules
                nextPlayer.activeRules = nextPlayer.activeRules.filter(r => typeof r !== 'string' && r.type === 'permanent');
            }
        }
    }
    
    updateTurnIndicator();
    updateLeaderboard();
    
    generateWheel(); // Randomize wheel for next turn
    saveGame();
}

// Shop Logic
const shopItems = [
    { name: "Sip Sniper", cost: 100, description: "Give 1 Sip to a target." },
    { name: "Double Tap", cost: 200, description: "Give 2 Sips to a target." },
    { name: "Quadrupple Tap", cost: 500, description: "Give 5 Sips to a target." },
    { name: "Deca Tap", cost: 1000, description: "Give 10 Sips to a target." },
    { name: "BEER", cost: 1400, description: "drink a whole beer :)" },
    { name: "Shot Caller", cost: 1000, description: "Give a SHOT to a target, the target has to say 'Drankjewel'." },
    { name: "EVERYONE DRINKS", cost: 1500, description: "EVERYONE TAKES A SHOT!" },
    
];

let selectedShopItem = null;

function openShop() {
    const modal = document.getElementById('shop-modal');
    const container = document.getElementById('shop-items-container');
    const balance = document.getElementById('shop-balance');
    const currentPlayer = players[currentPlayerIndex];
    
    if (!currentPlayer) return;
    
    balance.innerText = `Your Points: ${currentPlayer.score}`;
    container.innerHTML = '';
    
    shopItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        const canAfford = currentPlayer.score >= item.cost;
        
        div.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            </div>
            <button class="buy-btn" onclick="initiateBuy(${index})" ${canAfford ? '' : 'disabled'}>
                ${item.cost} pts
            </button>
        `;
        container.appendChild(div);
    });
    
    document.getElementById('shop-items-container').classList.remove('hidden');
    document.getElementById('shop-target-selection').classList.add('hidden');
    modal.classList.remove('hidden');
}

function closeShop() {
    document.getElementById('shop-modal').classList.add('hidden');
    selectedShopItem = null;
}

function initiateBuy(index) {
    selectedShopItem = shopItems[index];
    const container = document.getElementById('shop-items-container');
    const targetSelection = document.getElementById('shop-target-selection');
    const targetList = document.getElementById('target-list');
    
    container.classList.add('hidden');
    targetSelection.classList.remove('hidden');
    targetList.innerHTML = '';
    
    players.forEach((player, pIndex) => {
        if (pIndex !== currentPlayerIndex) {
            const btn = document.createElement('button');
            btn.className = 'target-btn';
            btn.innerText = player.name;
            btn.onclick = () => confirmPurchase(pIndex);
            targetList.appendChild(btn);
        }
    });
}

function backToShop() {
    document.getElementById('shop-items-container').classList.remove('hidden');
    document.getElementById('shop-target-selection').classList.add('hidden');
    selectedShopItem = null;
}

function confirmPurchase(targetIndex) {
    const currentPlayer = players[currentPlayerIndex];
    const targetPlayer = players[targetIndex];
    
    if (currentPlayer.score >= selectedShopItem.cost) {
        currentPlayer.score -= selectedShopItem.cost;
        
        // Apply effects
        let message = `${currentPlayer.name} bought ${selectedShopItem.name} for ${targetPlayer.name}!`;
        
        if (selectedShopItem.name === "Score Swap") {
            const temp = currentPlayer.score;
            currentPlayer.score = targetPlayer.score;
            targetPlayer.score = temp;
            message += " Scores swapped!";
        } else if (selectedShopItem.name === "Sip Sniper") {
            targetPlayer.sips += 1;
        } else if (selectedShopItem.name === "Double Tap") {
            targetPlayer.sips += 2;
        } else if (selectedShopItem.name === "Shot Caller") {
            targetPlayer.shots += 1;
        } else if (selectedShopItem.name === "Point Thief") {
            const stolen = Math.min(50, targetPlayer.score);
            targetPlayer.score -= stolen;
            currentPlayer.score += stolen;
            message += ` Stole ${stolen} points!`;
        } else if (selectedShopItem.name === "Drankjewel Curse") {
            message += " They must say 'Drankjewel' after every sentence!";
        }
        
        SoundManager.playBuy();
        alert(message);
        updateLeaderboard();
        closeShop();
        saveGame();
    }
}

// Special Effects
function createParticles(x, y, color) {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function triggerScreenShake() {
    document.body.classList.add('shake-screen');
    setTimeout(() => document.body.classList.remove('shake-screen'), 500);
}

