addLayer("discreteDissociation", {
    name: "Discrete Dissociation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DD", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "BH",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    onClick() {player.subtabs["bh"]["stages"] = "discreteDissociation"},
    startData() { return {
        unlocked: true,

        temporalEssence: new Decimal(0),
        liquidClockwork: new Decimal(0),
        temporalMult: new Decimal(1),

        highestCombo: new Decimal(0),
        lowestCombo: new Decimal(0),
        comboEffect: new Decimal(1),
        negComboEffect: new Decimal(1),
        comboStart: 0,

        milestone: {
            "-60": 0,
            "-50": 0,
            "-40": 0,
            "-30": 0,
            "-20": 0,
            "-10": 0,
            10: 0,
            20: 0,
            30: 0,
            40: 0,
            50: 0,
            60: 0,
        },
        milestoneEffect: new Decimal(0),
        negToggle: false,
    }},
    automate() {},
    nodeStyle() {
        let str = {
            background: "radial-gradient(#430994, #120554)",
            backgroundOrigin: "border-box",
            borderColor: "#070224",
            color: "#806edb",
            textShadow: "1px 1px 1px black, -1px 1px 1px black, -1px -1px 1px black, 1px -1px 1px black, 0px 0px 5px black",
            marginLeft: "20px !important",
        }
        if (player.subtabs["bh"]["stages"] == "discreteDissociation") str.outline = "3px solid #999"
        return str
    },
    tooltip: "Discrete Dissociation",
    branches: ["stagnantSynestia"],
    color: "#806edb",
    update(delta) {
        player.discreteDissociation.comboEffect = player.discreteDissociation.highestCombo.min(60).div(50).add(1)
        player.discreteDissociation.negComboEffect = player.discreteDissociation.lowestCombo.div(-60).add(1)

        player.discreteDissociation.milestoneEffect = new Decimal(1)
        for (let i in player.discreteDissociation.milestone) {
            player.discreteDissociation.milestoneEffect = player.discreteDissociation.milestoneEffect.add(player.discreteDissociation.milestone[i]/20)
        }

        player.discreteDissociation.temporalMult = new Decimal(1)

        player.discreteDissociation.liquidClockwork = player.discreteDissociation.liquidClockwork.floor()
    },
    clickables: {
        "enter": {
            title: "<h2>Enter Discrete Dissociation",
            canClick: true,
            unlocked: true,
            onClick() {
                BHStageEnter("discreteDissociation")
            },
            style: {width: "200px", minHeight: "75px", color: "white", background: "radial-gradient(#430994, #120554)", border: "3px solid #070224", borderRadius: "20px", textShadow: "1px 1px 1px black, -1px 1px 1px black, -1px -1px 1px black, 1px -1px 1px black, 0px 0px 3px black"},
        },
        "neg": {
            title: "Swap Sides",
            canClick: true,
            unlocked() {return player.discreteDissociation.lowestCombo.lt(0)},
            onClick() {
                if (player.subtabs["discreteDissociation"]["stuff"] == "negative") {
                    player.subtabs["discreteDissociation"]["stuff"] = "positive"
                } else {
                    player.subtabs["discreteDissociation"]["stuff"] = "negative"
                }
            },
            style() {
                let look = {width: "250px", minHeight: "30px", color: "var(--textColor)", border: "3px solid rgba(0,0,0,0.3)", borderRadius: "0", padding: "0 5px"}
                if (player.subtabs["discreteDissociation"]["stuff"] == "negative") {
                    look.background = "var(--miscButtonHover)"
                } else {
                    look.background = "var(--menuBackground)"
                }
                return look
            },
        },
    },
    upgrades: {
        1: {
            title: "Blinding Rage",
            unlocked: true,
            description: "test.",
            cost: new Decimal(60),
            currencyLocation() { return player.discreteDissociation },
            currencyDisplayName: "Temporal Dust",
            currencyInternalName: "temporalEssence",
            style() {
                let look = {minHeight: "100px", borderRadius: "15px", color: "white", border: "2px solid rgba(0,0,0,0.5)", margin: "2px"}
                hasUpgrade(this.layer, this.id) ? look.backgroundColor = "#1a3b0f" : !canAffordUpgrade(this.layer, this.id) ? look.backgroundColor =  "#361e1e" : look.backgroundColor = "#250121"
                return look
            },
        },
    },
    buyables: {
        1: {
            costBase() { return new Decimal(10) },
            costGrowth() { return new Decimal(1.3) },
            purchaseLimit() { return new Decimal(20) },
            currency() { return player.discreteDissociation.temporalEssence},
            pay(amt) { player.discreteDissociation.temporalEssence = this.currency().sub(amt) },
            effect(x) {return getBuyableAmount(this.layer, this.id).div(2)},
            unlocked: true,
            cost(x) { return this.costGrowth().pow(x || getBuyableAmount(this.layer, this.id)).mul(this.costBase()).floor() },
            canAfford() {return this.currency().gte(this.cost())},
            display() {
                return "<h3>Temporal Guard</h3> (" + formatWhole(getBuyableAmount(this.layer, this.id)) + "/20)\n\
                    Boost character defense\n\
                    Currently: +" + formatSimple(tmp[this.layer].buyables[this.id].effect) + "\n\ \n\
                    Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + "<br>Temporal Dust"
            },
            buy() {
                this.pay(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                let look = {width: "120px", height: "100px", color: "white", border: "2px solid rgba(0,0,0,0.5)", borderRadius: "15px", margin: "2px"}
                getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit()) ? look.background = "#1a3b0f" : !this.canAfford() ? look.background =  "#361e1e" : look.background = "#250121"
                return look
            },
        },
    },
    microtabs: {
        stuff: {
            "positive": {
                unlocked: true,
                content: [
                    ["style-row", [
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "You have " + formatShortWhole(player.discreteDissociation.temporalEssence) + " temporal essence."}, {color: "var(--textColor)", fontSize: "14px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "You have " + formatShortWhole(player.discreteDissociation.liquidClockwork) + " liquid clockwork."}, {color: "var(--textColor)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "272px", height: "52px", background: "var(--miscButtonHover)", borderBottom: "3px solid var(--regBorder)"}],
                            ["theme-scroll-column", [
                                ["blank", "2px"],
                                /*
                                ["row", [["upgrade", 1], ["upgrade", 2]]],
                                ["row", [["upgrade", 3], ["upgrade", 4]]],
                                ["row", [["upgrade", 5], ["upgrade", 6]]],
                                ["row", [["buyable", 1], ["buyable", 2]]],
                                ["row", [["buyable", 3], ["buyable", 4]]],
                                */
                                ["blank", "2px"],
                            ], {width: "272px", height: "365px", background: "var(--miscButton)", borderRadius: "0 0 0 27px"}],
                        ], {width: "272px", height: "420px", borderRight: "3px solid var(--regBorder)"}],
                        ["style-column", [
                            ["style-column", [
                                ["style-column", [
                                    ["raw-html", "Discrete Dissociation", {color: "var(--textColor)", fontSize: "20px", fontFamily: "monospace"}],
                                ], {width: "200px", height: "35px", borderBottom: "2px solid var(--regBorder)", marginBottom: "5px"}],
                                ["clickable", "enter"],
                            ], {width: "250px", height: "127px", background: "var(--miscButtonDisable)", borderBottom: "3px solid var(--regBorder)"}],
                            ["top-column", [
                                ["style-column", [
                                    ["clickable", "neg"]
                                ], () => {return player.discreteDissociation.lowestCombo.lt(0) ? {width: "250px", height: "30px", borderBottom: "3px solid var(--regBorder)"} : {display: "none !important"}}],
                                ["blank", "10px"],
                                ["style-column", [
                                    ["raw-html", "Properties", {color: "var(--textColor)", fontSize: "24px", fontFamily: "monospace"}],
                                ], {width: "200px", height: "35px", borderBottom: "2px solid var(--regBorder)", marginBottom: "10px"}],
                                ["raw-html", () => {return Decimal.sub(1.055, player.bh.comboScalingReduction).gt(1) ? "<u>Combo Scaling" : ""}, {color: "var(--textColor)", fontSize: "20px", fontFamily: "monospace"}],
                                ["raw-html", () => {return Decimal.sub(1.055, player.bh.comboScalingReduction).gt(1) ? formatSimple(Decimal.sub(1.055, player.bh.comboScalingReduction).max(1).sub(1).mul(100)) + "% starting at 25" : ""}, {color: "var(--textColor)", fontSize: "16px", fontFamily: "monospace"}],
                                ["blank", "5px"],
                                ["raw-html", "<u>Non-Smooth Time", {color: "var(--textColor)", fontSize: "20px", fontFamily: "monospace"}],
                                ["raw-html", "Time ticks discontinously", {color: "var(--textColor)", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "250px", height: "217px", background: "var(--layerBackground)"}],
                            ["style-row", [
                                ["layer-proxy", ["bh", [
                                    ["row", [["clickable", "Auto-Enter"], ["blank", ["10px", "10px"]], ["clickable", "Auto-Exit"]]],
                                ]]],
                            ], {width: "250px", height: "70px", background: "var(--miscButtonDisable)", borderTop: "3px solid var(--regBorder)"}],
                        ], {width: "250px", height: "420px"}],
                        ["style-column", [
                            ["top-column", [
                                ["style-column", [
                                    ["raw-html", () => {return "Highest Combo: " + formatWhole(player.discreteDissociation.highestCombo.min(100)) + "/" + BHS["discreteDissociation"].comboLimit}, {color: "var(--textColor)", fontSize: "18px", fontFamily: "monospace"}],
                                ], {width: "225px", height: "35px", borderBottom: "2px solid var(--regBorder)", marginBottom: "2px"}],
                                ["top-column", [
                                    ["raw-html", () => {return "Boosts check back xp by x" + formatSimple(player.discreteDissociation.comboEffect, 2)}, {color: "var(--textColor)", fontSize: "12px", fontFamily: "monospace"}],
                                ], {width: "272px", height: "25px"}],
                                ["style-column", [
                                    ["raw-html", () => {return "<p style='line-height:1.2'>Milestones multiply tickspeed during celestialite respawn by x" + formatSimple(player.discreteDissociation.milestoneEffect, 2)}, {color: "var(--textColor)", fontSize: "12px", fontFamily: "monospace"}],
                                ], {width: "272px", height: "47px", background: "var(--layerBackground)", borderTop: "3px solid var(--regBorder)"}],
                            ], {width: "272px", height: "114px", background: "var(--miscButtonHover)", borderBottom: "3px solid var(--regBorder)"}],
                            ["theme-scroll-column", [
                                ["raw-html", () => {return "<button class='bhMilestoneButton  base' style='width:257px;height:50px' onclick='player.discreteDissociation.comboStart=0'>Starting combo value: " + player.discreteDissociation.comboStart + "<br>[Click to set to 0]</button>"}],
                                ["bh-milestone", [10, "discreteDissociation", ""]],
                                ["bh-milestone", [20, "discreteDissociation", ""]],
                                ["bh-milestone", [30, "discreteDissociation", ""]],
                                ["bh-milestone", [40, "discreteDissociation", ""]],
                                ["bh-milestone", [50, "discreteDissociation", ""]],
                                ["bh-milestone", [60, "discreteDissociation", ""]],
                            ], {width: "272px", height: "250px", background: "var(--miscButton)", borderBottom: "3px solid var(--regBorder)"}],
                            ["style-column", [
                                ["raw-html", "<p style='line-height:1'>Clicking on a cleared milestone allows you to start at that milestones combo value.", {color: "var(--textColor)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "272px", height: "50px", background: "var(--miscButtonHover)", borderRadius: "0 0 27px 0"}],
                        ], {width: "272px", height: "420px", borderLeft: "3px solid var(--regBorder)"}],
                    ], {width: "800px", height: "420px"}],
                ],
            },
            "negative": {
                unlocked() {return player.depth4.lowestCombo.lt(0)},
                content: [
                    ["style-row", [
                        ["style-column", [
                            ["style-column", [
                                ["raw-html", () => {return "You have " + formatShortWhole(player.discreteDissociation.temporalEssence) + " temporal essence."}, {color: "var(--textColor)", fontSize: "14px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "You have " + formatShortWhole(player.discreteDissociation.liquidClockwork) + " liquid clockwork."}, {color: "var(--textColor)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "272px", height: "52px", background: "var(--miscButtonHover)", borderBottom: "3px solid var(--regBorder)"}],
                            ["theme-scroll-column", [
                                ["blank", "2px"],
                                /*
                                ["row", [["upgrade", 101], ["upgrade", 102]]],
                                ["row", [["upgrade", 103], ["upgrade", 104]]],
                                ["row", [["buyable", 101], ["buyable", 102]]],
                                */
                                ["blank", "2px"],
                            ], {width: "272px", height: "365px", background: "var(--miscButton)", borderRadius: "0 0 0 27px"}],
                        ], {width: "272px", height: "420px", borderRight: "3px solid var(--regBorder)"}],
                        ["style-column", [
                            ["style-column", [
                                ["style-column", [
                                    ["raw-html", "Discrete Dissociation", {color: "var(--textColor)", fontSize: "20px", fontFamily: "monospace"}],
                                ], {width: "200px", height: "35px", borderBottom: "2px solid var(--regBorder)", marginBottom: "5px"}],
                                ["clickable", "enter"],
                            ], {width: "250px", height: "127px", background: "var(--miscButton)", borderBottom: "3px solid var(--regBorder)"}],
                            ["top-column", [
                                ["style-column", [
                                    ["clickable", "neg"]
                                ], () => {return player.discreteDissociation.lowestCombo.lt(0) ? {width: "250px", height: "30px", borderBottom: "3px solid var(--regBorder)"} : {display: "none !important"}}],
                                ["blank", "10px"],
                                ["style-column", [
                                    ["raw-html", "Properties", {color: "var(--textColor)", fontSize: "24px", fontFamily: "monospace"}],
                                ], {width: "200px", height: "35px", borderBottom: "2px solid var(--regBorder)", marginBottom: "10px"}],
                                ["raw-html", () => {return "<u>Negative"}, {color: "var(--textColor)", fontSize: "20px", fontFamily: "monospace"}],
                                ["raw-html", () => {return "Combo scaling increases based on combo value"}, {color: "var(--textColor)", fontSize: "16px", fontFamily: "monospace"}],
                                ["blank", "5px"],
                                ["raw-html", "<u>Non-Smooth Time", {color: "var(--textColor)", fontSize: "20px", fontFamily: "monospace"}],
                                ["raw-html", "Time ticks discontinously", {color: "var(--textColor)", fontSize: "16px", fontFamily: "monospace"}],
                            ], {width: "250px", height: "217px", background: "var(--miscButtonDisable)"}],
                            ["style-row", [
                                ["layer-proxy", ["bh", [
                                    ["row", [["clickable", "Auto-Enter"], ["blank", ["10px", "10px"]], ["clickable", "Auto-Exit"]]],
                                ]]],
                            ], {width: "250px", height: "70px", background: "var(--miscButton)", borderTop: "3px solid var(--regBorder)"}],
                        ], {width: "250px", height: "420px"}],
                        ["style-column", [
                            ["top-column", [
                                ["style-column", [
                                    ["raw-html", () => {return "Lowest Combo: " + formatWhole(player.discreteDissociation.lowestCombo.max(-250)) + "/-" + BHS["discreteDissociation"].comboLimit}, {color: "var(--textColor)", fontSize: "18px", fontFamily: "monospace"}],
                                ], {width: "225px", height: "35px", borderBottom: "2px solid var(--regBorder)", marginBottom: "2px"}],
                                ["top-column", [
                                    ["raw-html", () => {return "<div style='line-height:1;margin-top:1px'>Boosts check back tickspeed by x" + formatSimple(player.discreteDissociation.negComboEffect, 2) + "</div>"}, {color: "var(--textColor)", fontSize: "11px", fontFamily: "monospace"}],
                                ], {width: "272px", height: "25px"}],
                                ["style-column", [
                                    ["raw-html", () => {return "<p style='line-height:1.2'>Milestones multiply tickspeed during celestialite respawn by x" + formatSimple(player.discreteDissociation.milestoneEffect, 2)}, {color: "var(--textColor)", fontSize: "12px", fontFamily: "monospace"}],
                                ], {width: "272px", height: "47px", background: "var(--layerBackground)", borderTop: "3px solid var(--regBorder)"}],
                            ], {width: "272px", height: "114px", background: "var(--layerBackground)", borderBottom: "3px solid var(--regBorder)"}],
                            ["theme-scroll-column", [
                                ["raw-html", () => {return "<button class='bhMilestoneButton base' style='width:257px;height:50px' onclick='player.discreteDissociation.comboStart=-1'>Starting combo value: " + player.discreteDissociation.comboStart + "<br>[Click to set to -1]</button>"}],
                                ["bh-milestone", ["-10", "discreteDissociation", ""]],
                                ["bh-milestone", ["-20", "discreteDissociation", ""]],
                                ["bh-milestone", ["-30", "discreteDissociation", ""]],
                                ["bh-milestone", ["-40", "discreteDissociation", ""]],
                                ["bh-milestone", ["-50", "discreteDissociation", ""]],
                                ["bh-milestone", ["-60", "discreteDissociation", ""]],
                            ], {width: "272px", height: "250px", background: "var(--miscButtonDisable)", borderBottom: "3px solid var(--regBorder)"}],
                            ["style-column", [
                                ["raw-html", "<p style='line-height:1'>Clicking on a cleared milestone allows you to start at that milestones combo value.", {color: "var(--textColor)", fontSize: "14px", fontFamily: "monospace"}],
                            ], {width: "272px", height: "50px", background: "var(--layerBackground)", borderRadius: "0 0 27px 0"}],
                        ], {width: "272px", height: "420px", borderLeft: "3px solid var(--regBorder)"}],
                    ], {width: "800px", height: "420px"}],
                ],
            },
        },
    },
    tabFormat: [
        ["buttonless-microtabs", "stuff", {borderWidth: "0"}],
    ],
    layerShown() {return player.startedGame && hasUpgrade("ev8", 24)},
})

BHS.discreteDissociation = {
    nameCap: "Discrete Dissociation",
    nameLow: "discrete dissociation",
    music: "music/tier3.mp3",
    comboLimit: 60,
    comboScaling: 1.05,
    comboScalingStart: 10,
    nonSmooth: true,
    generateCelestialite(combo) {
        if (typeof combo == "object") combo = combo.toNumber()
        switch (combo) {
            /*
            case 9:
                return "disjunctEnas"
            case 19:
                return "disjunctPente"
            case 29:
                return "disjunctDeka"
            case 39:
                return "disjunctHekaton"
            case 49:
                return "disjunctKhilioi"
            case 59:
                return "disjunctMyrioi"
            */
            default:
                let random = Math.random()
                let cel = ["disjunctAlpha","disjunctBeta","disjunctGamma","disjunctDelta"]
                /*
                if (combo >= 10) cel.push("disjunctEta")
                if (combo >= 20) cel.push("disjunctTheta")
                if (combo >= 30) cel.push("disjunctIota")
                if (combo >= 40) cel.push("disjunctKappa")
                if (combo >= 50) cel.push("disjunctLambda")
                if (combo < 0) cel = ["disjunctEnas", "disjunctPente", "disjunctDeka", "disjunctHekaton", "disjunctKhilioi", "disjunctMyrioi"]
                */
                return cel[Math.floor(Math.random()*cel.length)]
        }
    },
}

BHC.disjunctAlpha = {
    name: "Celestialite Disjunct Alpha",
    icon: "resources/celestialites/discrete/disjunctAlpha.png",
    health: new Decimal(10000),
    damage: new Decimal(100),
    agility: new Decimal(75),
    noRandomStats: true,
    actions: {
        0: {
            name: "Chop",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "physical",
            value: new Decimal(1),
            cooldown: new Decimal(4),
        },
        1: {
            name: "Decapitate",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "physical",
            value: new Decimal(3),
            stun: ["soft", new Decimal(5), 2],
            cooldown: new Decimal(16),
        },
        2: {
            name: "Doubled Claustrophobia",
            instant: true,
            type: "function",
            target: "allPlayer",
            onTrigger(index, slot, target, magnitude) {
                let random = Math.random()
                if (random < 0.5) {
                    bulletHell({"bulletRain": {bulletPerSec: 8+(magnitude*2)}, "inverseRain": {bulletPerSec: 8+(magnitude*2)}}, {width: 900, height: 600, duration: 7+magnitude, subArena: true, subWidth: 350-(magnitude*20), subHeight: 350-(magnitude*20)})
                } else {
                    bulletHell({"bulletRain": {bulletPerSec: 4+magnitude, bulletRadius: 16+(magnitude*2)}, "inverseRain": {bulletPerSec: 4+magnitude, bulletRadius: 16+(magnitude*2)}}, {width: 300, height: 300, duration: 7+magnitude})
                }
            },
            cooldown: new Decimal(10),
        },
    },
    reward() {
        let gain = {}
        let random = Math.random()
        if (random < 0.8) {
            gain.temporalEssence = Decimal.add(4, getRandomInt(3))
        } else {
            gain.liquidClockwork = new Decimal(1)
        }
        return gain
    },
}

BHC.disjunctBeta = {
    name: "Celestialite Disjunct Beta",
    icon: "resources/celestialites/discrete/disjunctBeta.png",
    health: new Decimal(12500),
    damage: new Decimal(125),
    agility: new Decimal(75),
    noRandomStats: true,
    actions: {
        0: {
            name: "Magic Missile",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "magic",
            value: new Decimal(1),
            cooldown: new Decimal(4),
        },
        1: {
            name: "Enhanced Missile",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "magic",
            value: new Decimal(2),
            cooldown: new Decimal(8),
        },
        2: {
            name: "Rainy Maze",
            instant: true,
            type: "function",
            target: "allPlayer",
            onTrigger(index, slot, target, magnitude) {
                let random = Math.random()
                if (random < 0.5) {
                    bulletHell({"bulletRain": {bulletPerSec: 8+(magnitude*2)}}, {width: 600, height: 600, duration: 47-(magnitude*2), timed: true, cellSize: 50, start: "cell", goal: "cell"})
                } else {
                    bulletHell({"inverseRain": {bulletPerSec: 8+(magnitude*2)}}, {width: 600, height: 600, duration: 47-(magnitude*2), timed: true, cellSize: 50, start: "cell", goal: "cell"})
                }
            },
            cooldown: new Decimal(16),
        },
    },
    reward() {
        let gain = {}
        let random = Math.random()
        if (random < 0.8) {
            gain.temporalEssence = Decimal.add(5, getRandomInt(3))
        } else {
            gain.liquidClockwork = new Decimal(1)
        }
        return gain
    },
}

BHC.disjunctGamma = {
    name: "Celestialite Disjunct Gamma",
    icon: "resources/celestialites/discrete/disjunctGamma.png",
    health: new Decimal(15000),
    damage: new Decimal(100),
    agility: new Decimal(50),
    noRandomStats: true,
    actions: {
        0: {
            name: "Slap",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "physical",
            properties: {
                "stun": [new Decimal(1), "soft", new Decimal(1)], // Chance / Stun-Type / Stun-Time
            },
            value: new Decimal(1),
            cooldown: new Decimal(4),
        },
        1: {
            name: "Enhanced Slap",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "physical",
            properties: {
                "stun": [new Decimal(1), "soft", new Decimal(2)], // Chance / Stun-Type / Stun-Time
            },
            value: new Decimal(2),
            cooldown: new Decimal(8),
        },
        2: {
            name: "Super Slap",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "physical",
            properties: {
                "stun": [new Decimal(1), "soft", new Decimal(4)], // Chance / Stun-Type / Stun-Time
            },
            value: new Decimal(4),
            cooldown: new Decimal(16),
        },
    },
    reward() {
        let gain = {}
        let random = Math.random()
        if (random < 0.75) {
            gain.temporalEssence = Decimal.add(6, getRandomInt(3))
        } else {
            gain.liquidClockwork = new Decimal(1)
        }
        return gain
    },
}

BHC.disjunctDelta = {
    name: "Celestialite Disjunct Delta",
    icon: "resources/celestialites/discrete/disjunctDelta.png",
    health: new Decimal(17500),
    damage: new Decimal(110),
    agility: new Decimal(50),
    noRandomStats: true,
    actions: {
        0: {
            name: "Brutal Bludgeon",
            instant: true,
            type: "damage",
            target: "randomPlayer",
            method: "physical",
            value: new Decimal(3),
            cooldown: new Decimal(15),
        },
        1: {
            name: "Effulgent Easing",
            instant: true,
            type: "heal",
            target: "celestialite",
            value: new Decimal(1400),
            cooldown: new Decimal(13),
        },
        2: {
            name: "Surrounding Showers",
            instant: true,
            type: "function",
            target: "allPlayer",
            onTrigger(index, slot, target, magnitude) {
                bulletHell({"omniRain": {bulletPerSec: 5}}, {duration: 10})
                // bulletHell({"waveBees": {beeRate: 10+(magnitude*2), radius: 20, gapStart: 0, gap: 200, enemySpeed: 12, waveSpeed: 8}}, {duration: 8})
            },
            cooldown: new Decimal(11),
        },
    },
    reward() {
        let gain = {}
        let random = Math.random()
        if (random < 0.7) {
            gain.temporalEssence = Decimal.add(7, getRandomInt(3))
        } else {
            gain.liquidClockwork = new Decimal(2)
        }
        return gain
    },
}