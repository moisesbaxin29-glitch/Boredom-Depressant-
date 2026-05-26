const LeaderboardManager = {
    saveScore(gameName, playerName, score) {
        if (!playerName || playerName.trim() === "") playerName = "ANON";
        playerName = playerName.toUpperCase().substring(0, 8); // Max 8 characters

        // Save to individual game leaderboard
        let scores = JSON.parse(localStorage.getItem(`bd_${gameName}`)) || [];
        scores.push({ name: playerName, score: score });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5);
        localStorage.setItem(`bd_${gameName}`, JSON.stringify(scores));

        // Save to cumulative global Hall of Fame
        let hof = JSON.parse(localStorage.getItem('bd_hof')) || {};
        hof[playerName] = (hof[playerName] || 0) + score;
        localStorage.setItem('bd_hof', JSON.stringify(hof));
    },

    getScores(gameName) {
        return JSON.parse(localStorage.getItem(`bd_${gameName}`)) || [];
    },

    getHallOfFame() {
        let hof = JSON.parse(localStorage.getItem('bd_hof')) || {};
        return Object.keys(hof)
            .map(key => ({ name: key, score: hof[key] }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }
};