window.onload = () => {
    loadGame();
    display.updateScore();
    display.updateShop();
};

var game = {
    score: 0,
    clickValue: 1,
    version: 0.000,

    addToScore: function(amount) {
        this.score += amount;
        display.updateScore();
        display.updateShop();
    },

    getSPS: function() {
        var SPS = 0;
        for (let i = 0; i < building.name.length; i++) {
            if (building.purchased[i]) {
                SPS += building.income[i];
            }
        }
        return SPS;
    }
};

var building = {
    name: ["Inleiding",  "Bedrijfsbeschrijving", "SMART Doelen", "Werkzaamheden", "Reflectie"],
    income: [1,5,10,20,14],
    cost: [5, 75, 250, 750, 2000],
    purchased: [false,false,false,false,false],

    purchase: function(i) {
        if (!this.purchased[i] && game.score >= this.cost[i]) {
            game.score -= this.cost[i];
            this.purchased[i] = true;
            display.updateScore();
            display.updateShop();
        }
    }
}

var display = {
    updateScore: function() { 
        document.getElementById("Score").innerHTML = game.score;
        document.getElementById("SPS").innerHTML = game.getSPS();
    },
    updateShop: function() {
        document.getElementById("Farms").innerHTML = "";
        var articles = document.getElementsByClassName("articleCV");
        for (let i = 0; i < articles.length; i++) {
            articles[i].style.display = "none";
        }

        for (let i = 0; i < building.name.length; i++) {
            if (!building.purchased[i] && game.score >= building.cost[i]) {
                document.getElementById("Farms").innerHTML += "<div class='shopButton' id='buttonFarm"+i+"' onclick='building.purchase("+i+")'><p>"+building.name[i]+"</p><p><span>"+building.cost[i]+"</span> Punten</p></div>";
                document.getElementById("buttonFarm"+i).style.backgroundImage = "url('../IMG/Button.png')";
            }
            else if (!building.purchased[i] && game.score < building.cost[i]) {
                document.getElementById("Farms").innerHTML += "<div class='shopButton' id='buttonFarm"+i+"' onclick='building.purchase("+i+")'><p>"+building.name[i]+"</p><p><span>"+building.cost[i]+"</span> Punten</p></div>";
                document.getElementById("buttonFarm"+i).style.backgroundImage = "url('../IMG/ButtonDark.png')";
            }
            else if (building.purchased[i]) {
                document.getElementById(building.name[i]).style.display = "block";
            }
        }
    }
}

function saveGame() {
    var gameSave = {
        score: game.score,
        clickValue: game.clickValue,
        version: game.version,
        buildingCost: building.cost,
        buildingPurchased: building.purchased,
        buildingIncome: building.income,
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
};

function loadGame() {
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));

    if (localStorage.getItem("gameSave") !== null) {
        if (typeof savedGame.score !== "undefined") game.score = savedGame.score;
        if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
        if (typeof savedGame.version !== "undefined") game.version = savedGame.version;
        if (typeof savedGame.buildingCost !== "undefined") 
            for (let i = 0; i < savedGame.buildingCost.length; i++) {
                building.cost[i] = savedGame.buildingCost[i];
            };
        if (typeof savedGame.buildingIncome !== "undefined")
            for (let i = 0; i < savedGame.buildingIncome.length; i++) {
                building.income[i] = savedGame.buildingIncome[i];
            };
        if (typeof savedGame.buildingPurchased !== "undefined")
            for (let i = 0; i < savedGame.buildingPurchased.length; i++) {
                building.purchased[i] = savedGame.buildingPurchased[i];
            };
    }
};

function resetGame() {
    if (confirm("Weet u zeker dat u wilt resetten?")) {
        var gameSave = {};
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
    }
};

setInterval(() => {
    game.score += game.getSPS();
    display.updateScore();
    display.updateShop();
}, 1000);

setInterval(() => {
    saveGame();
}, 60000);