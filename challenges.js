const challenges = [
    // ==========================================
    // COMMON (40% Chance) - Fun, Light, Social
    // ==========================================
    { type: "TRUTH", rarity: "COMMON", text: "What is the most embarrassing thing you've done this year?", points: 50, sips: 3 },
    { type: "TRUTH", rarity: "COMMON", text: "What is your biggest fear?", points: 50, sips: 3 },
    { type: "TRUTH", rarity: "COMMON", text: "Have you ever peed in a pool?", points: 50, sips: 2 },
    { type: "TRUTH", rarity: "COMMON", text: "What is your guilty pleasure song?", points: 50, sips: 2 },
    { type: "TRUTH", rarity: "COMMON", text: "Who is your celebrity crush?", points: 50, sips: 2 },
    { type: "TRUTH", rarity: "COMMON", text: "What is the weirdest thing you've eaten?", points: 50, sips: 2 },
    { type: "TRUTH", rarity: "COMMON", text: "Have you ever been kicked out of a place?", points: 50, sips: 2 },
    { type: "TRUTH", rarity: "COMMON", text: "When was the last time you cried?", points: 50, sips: 2 },
    { type: "TRUTH", rarity: "COMMON", text: "What is the worst gift you have ever received?", points: 50, sips: 2 },
    
    { type: "DARE", rarity: "COMMON", text: "Do 10 pushups.", points: 50, sips: 3 },
    { type: "DARE", rarity: "COMMON", text: "Talk in a British accent for 2 rounds.", points: 50, sips: 3 },
    { type: "DARE", rarity: "COMMON", text: "Let the person to your left style your hair.", points: 50, sips: 3 },
    { type: "DARE", rarity: "COMMON", text: "Do your best chicken dance.", points: 50, sips: 3 },
    { type: "DARE", rarity: "COMMON", text: "Smell the foot of the person to your right.", points: 50, sips: 3 },
    { type: "DARE", rarity: "COMMON", text: "Let someone draw on your face with a pen.", points: 50, sips: 3 },
    { type: "DARE", rarity: "COMMON", text: "Make a toast to the group.", points: 30, sips: 0 },
    { type: "DARE", rarity: "COMMON", text: "Do 5 jumping jacks.", points: 30, sips: 2 },
    { type: "DARE", rarity: "COMMON", text: "Tell a joke. If no one laughs, drink.", points: 40, sips: 3 },
    { type: "DARE", rarity: "COMMON", text: "Take a selfie with the group.", points: 30, sips: 0 },

    { type: "GAME", rarity: "COMMON", text: "Categories: Types of Pizza. Start with the person to your left. Loser drinks.", points: 20, sips: 2 },
    { type: "GAME", rarity: "COMMON", text: "Rhyme Time: Pick a word. Go around rhyming. Loser drinks.", points: 20, sips: 2 },
    { type: "GAME", rarity: "COMMON", text: "Categories: Car Brands. Loser drinks.", points: 30, sips: 2 },
    { type: "GAME", rarity: "COMMON", text: "Categories: Fruit. Loser drinks.", points: 30, sips: 2 },
    { type: "GAME", rarity: "COMMON", text: "Categories: Countries. Loser drinks.", points: 30, sips: 2 },
    { type: "GAME", rarity: "COMMON", text: "Categories: Sex Positions. Loser drinks.", points: 30, sips: 2 },
    { type: "GAME", rarity: "COMMON", text: "Categories: Alcohol Brands. Loser drinks.", points: 30, sips: 2 },
    
    { type: "RULE", rarity: "COMMON", text: "Waterfall! Everyone starts drinking.", points: 10, sips: 0 },
    { type: "RULE", rarity: "COMMON", text: "No using names until your next turn.", points: 30, sips: 0 },
    { type: "RULE", rarity: "COMMON", text: "T-Rex Arms: You must keep your elbows tucked in until next turn.", points: 40, sips: 0 },
    { type: "RULE", rarity: "COMMON", text: "Silence: You cannot speak until your next turn.", points: 40, sips: 0 },
    { type: "RULE", rarity: "COMMON", text: "Nicknames: Everyone must call you 'Captain' until next turn.", points: 40, sips: 0 },
    
    { type: "VOTE", rarity: "COMMON", text: "Vote: Who is most likely to get arrested? Loser drinks.", points: 0, sips: 4 },
    { type: "VOTE", rarity: "COMMON", text: "Who is most likely to become a millionaire?", points: 20, sips: 3 },
    { type: "VOTE", rarity: "COMMON", text: "Who is most likely to join a cult?", points: 20, sips: 3 },
    { type: "VOTE", rarity: "COMMON", text: "Who spends the most time on the toilet?", points: 20, sips: 3 },
    { type: "VOTE", rarity: "COMMON", text: "Who is the worst driver?", points: 20, sips: 3 },
    
    { type: "LUCK", rarity: "COMMON", text: "Spin again. If you get this again, finish your drink.", points: 0, sips: 1 },

    // ==========================================
    // RARE (25% Chance) - Spicy, Personal, Interactive
    // ==========================================
    { type: "TRUTH", rarity: "RARE", text: "Read the last text you sent out loud.", points: 40, sips: 2 },
    { type: "TRUTH", rarity: "RARE", text: "Who in the room do you think is the smartest?", points: 60, sips: 3 },
    { type: "TRUTH", rarity: "RARE", text: "What is the most illegal thing you've done?", points: 80, sips: 4 },
    { type: "TRUTH", rarity: "RARE", text: "Have you ever cheated on a test?", points: 80, sips: 4 },
    { type: "TRUTH", rarity: "RARE", text: "Who in this room do you trust the least?", points: 80, sips: 4 },
    { type: "TRUTH", rarity: "RARE", text: "Rate everyone in the room from 1-10 on looks.", points: 80, sips: 4 },
    { type: "TRUTH", rarity: "RARE", text: "What is a secret you've never told your parents?", points: 80, sips: 4 },
    
    { type: "DARE", rarity: "RARE", text: "Let the group DM someone on your Instagram.", points: 100, sips: 5 },
    { type: "DARE", rarity: "RARE", text: "Post a selfie with a caption chosen by the group.", points: 100, sips: 5 },
    { type: "DARE", rarity: "RARE", text: "Lick the floor.", points: 100, sips: 5 },
    { type: "DARE", rarity: "RARE", text: "Eat a spoonful of hot sauce (or condiment).", points: 100, sips: 5 },
    { type: "DARE", rarity: "RARE", text: "Let the group look through your camera roll for 1 minute.", points: 100, sips: 5 },
    { type: "DARE", rarity: "RARE", text: "Twerk for 15 seconds.", points: 100, sips: 5 },
    { type: "DARE", rarity: "RARE", text: "Show your screen time stats to the group.", points: 80, sips: 4 },
    { type: "DARE", rarity: "RARE", text: "Impersonate another player until your next turn.", points: 80, sips: 3 },
    
    { type: "CHALLENGE", rarity: "RARE", text: "Hold a plank for 1 minute. If you fail, drink.", points: 50, sips: 3 },
    { type: "CHALLENGE", rarity: "RARE", text: "Let the group mix a drink for you (must be edible).", points: 80, sips: 5 },
    { type: "CHALLENGE", rarity: "RARE", text: "Staring contest with the person to your right. Loser drinks.", points: 70, sips: 3 },
    { type: "CHALLENGE", rarity: "RARE", text: "Rock, Paper, Scissors tournament. Winner gives 5 sips.", points: 70, sips: 0 },
    
    { type: "GAME", rarity: "RARE", text: "Never Have I Ever: 3 fingers.", points: 30, sips: 3 },
    { type: "GAME", rarity: "RARE", text: "Two Truths and a Lie. If the group guesses wrong, they drink.", points: 50, sips: 3 },
    
    { type: "MINIGAME", rarity: "RARE", text: "Thumb Master: You are now the Thumb Master.", points: 20, sips: 0 },
    { type: "MINIGAME", rarity: "RARE", text: "Floor is Lava: Last person to stand on a chair/couch drinks.", points: 60, sips: 4 },
    { type: "MINIGAME", rarity: "RARE", text: "Medusa: Everyone look down. On 3, look up at someone. If you lock eyes, drink.", points: 60, sips: 3 },
    
    { type: "WILD", rarity: "RARE", text: "Switch seats with the person opposite you.", points: 50, sips: 0 },
    { type: "WILD", rarity: "RARE", text: "Everyone who is single drinks.", points: 50, sips: 3 },
    { type: "WILD", rarity: "RARE", text: "Everyone shorter than you drinks.", points: 50, sips: 3 },
    { type: "WILD", rarity: "RARE", text: "Drink if you have a tattoo.", points: 50, sips: 3 },
    { type: "WILD", rarity: "RARE", text: "Let the group rename you for the rest of the game.", points: 60, sips: 0 },

    // ==========================================
    // EPIC (15% Chance) - High Stakes, Embarrassing, Physical
    // ==========================================
    { type: "TRUTH", rarity: "EPIC", text: "Who in this room would you most like to date?", points: 200, sips: 8 },
    { type: "TRUTH", rarity: "EPIC", text: "What is your biggest regret in life?", points: 150, sips: 6 },
    { type: "TRUTH", rarity: "EPIC", text: "Have you ever been in love with a friend's partner?", points: 200, sips: 8 },
    { type: "TRUTH", rarity: "EPIC", text: "Read the first DM in your inbox out loud.", points: 180, sips: 7 },
    
    { type: "DARE", rarity: "EPIC", text: "Swap shirts with the person to your right.", points: 150, sips: 6 },
    { type: "DARE", rarity: "EPIC", text: "Remove two articles of clothing.", points: 150, sips: 6 },
    { type: "DARE", rarity: "EPIC", text: "Let the group DM your crush.", points: 200, sips: 8 },
    { type: "DARE", rarity: "EPIC", text: "Call a pizza place and ask if they sell tacos.", points: 150, sips: 5 },
    { type: "DARE", rarity: "EPIC", text: "Swap shoes with the person to your left.", points: 120, sips: 4 },
    { type: "DARE", rarity: "EPIC", text: "Let someone write a word on your forehead with a marker.", points: 150, sips: 5 },
    { type: "DARE", rarity: "EPIC", text: "Call a random number and sing Happy Birthday.", points: 180, sips: 6 },
    
    { type: "CHALLENGE", rarity: "EPIC", text: "Speak in an accent until your next turn. Break it = SHOT.", points: 100, sips: 0, isShot: true },
    { type: "CHALLENGE", rarity: "EPIC", text: "Arm wrestle the person to your left. Loser takes a shot.", points: 150, sips: 0, isShot: true },
    { type: "CHALLENGE", rarity: "EPIC", text: "Shotgun a beer (or finish drink in 10s).", points: 200, sips: 0, isFinish: true },
    { type: "CHALLENGE", rarity: "EPIC", text: "Do a handstand against the wall for 10 seconds.", points: 150, sips: 5 },
    { type: "CHALLENGE", rarity: "EPIC", text: "Blindfolded Taste Test: Guess the drink. Wrong = Shot.", points: 150, sips: 0, isShot: true },
    
    { type: "WILD", rarity: "EPIC", text: "Everyone gives you a compliment. If you smile, you drink.", points: 50, sips: 4 },
    { type: "WILD", rarity: "EPIC", text: "Everyone drinks except you.", points: 100, sips: 0 },
    { type: "WILD", rarity: "EPIC", text: "Socialism: Distribute your sips equally among all players.", points: 100, sips: 0 },
    { type: "WILD", rarity: "EPIC", text: "Communism: Everyone finishes their drink.", points: 300, sips: 0, isFinish: true },
    { type: "WILD", rarity: "EPIC", text: "Everyone gives you a wet willy.", points: 200, sips: 0 },
    
    { type: "GAME", rarity: "EPIC", text: "Most Likely To: Everyone points. Person with most fingers takes a SHOT.", points: 100, sips: 0, isShot: true },

    // ==========================================
    // LEGENDARY (10% Chance) - Game Changers, Powers, Jackpots
    // ==========================================
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "FINISH YOUR DRINK.", points: 500, sips: 0, isFinish: true },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "Give out 10 sips however you want.", points: 300, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "Immunity! You can skip your next drink.", points: 200, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "Choose someone to finish their drink.", points: 400, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "GOD MODE: You can make any rule you want for the rest of the game.", points: 500, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "DOUBLE POINTS: All your points are doubled for the rest of the game.", points: 500, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "SKIP: You can skip any future dare or challenge.", points: 300, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "REVERSE: The turn order is reversed.", points: 200, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "VAMPIRE: Whenever you drink, you can choose someone to drink with you.", points: 400, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "DRINKING BUDDY: Pick a partner. They must drink whenever you drink.", points: 350, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "POINTS JACKPOT: You instantly gain 1000 Points!", points: 1000, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "ROBIN HOOD: Steal 50% of the richest player's points.", points: 0, sips: 0 },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "MERCY: Reset someone's sips count to 0.", points: 200, sips: 0 },
    
    // Special Wheel Triggers
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "CURSE THE NEXT PLAYER! They must spin the CURSED WHEEL.", points: 500, sips: 0, isCurseNext: true },
    { type: "LEGENDARY", rarity: "LEGENDARY", text: "BLESS THE NEXT PLAYER! They get to spin the LEGENDARY WHEEL.", points: 500, sips: 0, isLegendaryNext: true },

    // ==========================================
    // CURSED (10% Chance) - Chaos, Pain, Regret
    // ==========================================
    { type: "CURSED", rarity: "CURSED", text: "Take a shot of the nastiest mix the group can make.", points: 1000, sips: 0, isShot: true },
    { type: "CURSED", rarity: "CURSED", text: "Call your ex (or parent) and say 'I love you'.", points: 1000, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "Send a risky text to a contact chosen by the group.", points: 1000, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "Eat a raw egg.", points: 1000, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "Let the group cut a piece of your hair.", points: 1500, sips: 15 },
    { type: "CURSED", rarity: "CURSED", text: "Drink a mixture of every drink on the table.", points: 1000, sips: 0, isShot: true },
    { type: "CURSED", rarity: "CURSED", text: "Post an embarrassing photo on your main social media story.", points: 1200, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "Let the person to your right slap you in the face.", points: 800, sips: 5 },
    { type: "CURSED", rarity: "CURSED", text: "Send a voice note barking like a dog to your someone not in this room", points: 1000, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "Lick the bottom of your shoe.", points: 1200, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "Let the group DM your parents something weird.", points: 1500, sips: 15 },
    { type: "CURSED", rarity: "CURSED", text: "Take a shot of vinegar, soy sauce, or hot sauce.", points: 1000, sips: 0, isShot: true },
    { type: "CURSED", rarity: "CURSED", text: "Show your browser history to the group.", points: 1500, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "AT DE ICE FLES", points: 1000, sips: 10 },
    { type: "CURSED", rarity: "CURSED", text: "person on the right of you gives you a nipple twist", points: 1000, sips: 10 },
];
