addLayer("cp", {
    name: "Alternate Origin", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol() {
        if (player.ca.cantepocalypsePrep) return "CP"
        return "AO"
    }, // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "A1",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        unlockedPortal: false,
        cantepocalypseActive: false,

        replicantiPoints: new Decimal(1),
        replicantiPointsMult: new Decimal(0),
        replicantiPointsTimer: new Decimal(0),
        replicantiPointsTimerReq: new Decimal(3),
        replicantiPointCap: new Decimal(1.79e308),

        replicantiSoftcapEffect: new Decimal(1),
        replicantiSoftcapStart: new Decimal(1000),

        replicantiSoftcap2Effect: new Decimal(1),
        replicantiSoftcap2Start: new Decimal(1e10),

        replicantiSoftcap3Effect: new Decimal(1),
        replicantiSoftcap3Start: new Decimal(1e308),

        replicantiSoftcap4Effect: new Decimal(1),
        replicantiSoftcap4Start: new Decimal(1e308),
    }},
    automate() {
        if (hasMilestone("s", 17) && !inChallenge("fu", 11) && !inChallenge("fu", 12)) {
            buyUpgrade("cp", 11)
            buyUpgrade("cp", 12)
            buyUpgrade("cp", 13)
            buyUpgrade("cp", 14)
            buyUpgrade("cp", 15)
            buyUpgrade("cp", 16)
            buyUpgrade("cp", 17)
            buyUpgrade("cp", 18)
            buyUpgrade("cp", 19)
        }
    },
    nodeStyle: {background: "linear-gradient(45deg, #064461 0%, #4a7d94 100%)", backgroundOrigin: "border-box", borderColor: "#013851"},
    tooltip() {
        if (player.ca.cantepocalypsePrep) return "Cantepocalypse"
        return "Alternate Origin"
    },
    color: "#398",
    branches: ["ar", "pr"],
    update(delta) {
        let onepersec = new Decimal(1)

        if (player.tab == "cp" && player.ca.cantepocalypsePrep == true) {
            player.universe = "A1"
            player.ca.cantepocalypsePrep = false
            player.cp.cantepocalypseActive = true
        }

        if (hasUpgrade("cp", 18) && player.cp.cantepocalypseActive) player.cp.cantepocalypseActive = false

        multAdd = new Decimal(0.01)
        multAdd = multAdd.add(player.ar.rankPointsEffect)
        multAdd = multAdd.mul(buyableEffect("pr", 11))
        if (hasUpgrade("an", 11)) multAdd = multAdd.mul(1.5)
        if (hasUpgrade("an", 12)) multAdd = multAdd.mul(upgradeEffect("an", 12))
        multAdd = multAdd.mul(buyableEffect("rt", 15))
        multAdd = multAdd.mul(player.rg.repliGrassEffect)
        multAdd = multAdd.mul(buyableEffect("rg", 15))
        multAdd = multAdd.mul(player.gs.grassSkipEffect)
        if (hasUpgrade("an", 23)) multAdd = multAdd.mul(upgradeEffect("an", 23))
        if (hasMilestone("gs", 12)) multAdd = multAdd.mul(player.gs.milestone2Effect)
        multAdd = multAdd.mul(player.oi.linkingPowerEffect[0])
        if (hasUpgrade("fu", 101)) multAdd = multAdd.mul(3)
        if (!inChallenge("fu", 12)) {
            multAdd = multAdd.mul(levelableEffect("pet", 402)[0])
            multAdd = multAdd.mul(player.co.cores.point.effect[2])
        }

        // POWERS
        if (inChallenge("fu", 11)) multAdd = multAdd.pow(Decimal.mul(0.2, buyableEffect("fu", 88)))

        player.cp.replicantiPointsTimerReq = new Decimal(3)
        player.cp.replicantiPointsTimerReq = player.cp.replicantiPointsTimerReq.div(buyableEffect("pr", 12))
        if (hasUpgrade("fu", 103)) player.cp.replicantiPointsTimerReq = player.cp.replicantiPointsTimerReq.div(upgradeEffect("fu", 103))
        if (hasUpgrade("fu", 111)) player.cp.replicantiPointsTimerReq = player.cp.replicantiPointsTimerReq.div(2)
        player.cp.replicantiPointsTimerReq = player.cp.replicantiPointsTimerReq.div(player.en.enhancePointsEffect)

        player.cp.replicantiSoftcapStart = new Decimal(1000)
        player.cp.replicantiSoftcapStart = player.cp.replicantiSoftcapStart.mul(buyableEffect("pr", 15))
        if (hasUpgrade("an", 14)) player.cp.replicantiSoftcapStart = player.cp.replicantiSoftcapStart.mul(1000)
        if (hasUpgrade("an", 19)) player.cp.replicantiSoftcapStart = player.cp.replicantiSoftcapStart.mul(upgradeEffect("an", 19))
        player.cp.replicantiSoftcapStart = player.cp.replicantiSoftcapStart.mul(buyableEffect("rg", 18))
        player.cp.replicantiSoftcapStart = player.cp.replicantiSoftcapStart.mul(buyableEffect("fu", 22))
        player.cp.replicantiSoftcapStart = player.cp.replicantiSoftcapStart.mul(buyableEffect("fu", 65))

        if (!inChallenge("fu", 12)) player.cp.replicantiSoftcapStart = player.cp.replicantiSoftcapStart.pow(buyableEffect("cof", 13))

        // CHALLENGE
        if (inChallenge("fu", 12)) player.cp.replicantiSoftcapStart = new Decimal(1)

        player.cp.replicantiSoftcapEffect = player.cp.replicantiPoints.sub(player.cp.replicantiSoftcapStart).pow(0.375).max(1)
        if (inChallenge("fu", 12) && hasUpgrade("fu", 106)) player.cp.replicantiSoftcapEffect = player.cp.replicantiSoftcapEffect.pow(upgradeEffect("fu", 106))
        if (!inChallenge("fu", 12)) {
            player.cp.replicantiSoftcapEffect = player.cp.replicantiSoftcapEffect.div(buyableEffect("pr", 16))
            player.cp.replicantiSoftcapEffect = player.cp.replicantiSoftcapEffect.div(buyableEffect("fu", 22))
            player.cp.replicantiSoftcapEffect = player.cp.replicantiSoftcapEffect.div(buyableEffect("fu", 66))
            if (inChallenge("fu", 11)) player.cp.replicantiSoftcapEffect = player.cp.replicantiSoftcapEffect.pow(2)
            if (hasUpgrade("en", 13)) player.cp.replicantiSoftcapEffect = player.cp.replicantiSoftcapEffect.pow(0.01)
        } else {
            player.cp.replicantiSoftcapEffect = player.cp.replicantiSoftcapEffect.max(1)
        }
        if (player.cp.replicantiPoints.gte(player.cp.replicantiSoftcapStart)) {
            multAdd = multAdd.div(player.cp.replicantiSoftcapEffect)
        }

        player.cp.replicantiSoftcap2Start = new Decimal(1e9)
        if (hasUpgrade("an", 14)) player.cp.replicantiSoftcap2Start = player.cp.replicantiSoftcap2Start.mul(1000)
        player.cp.replicantiSoftcap2Start = player.cp.replicantiSoftcap2Start.mul(buyableEffect("rt", 17))
        if (hasUpgrade("an", 19)) player.cp.replicantiSoftcap2Start = player.cp.replicantiSoftcap2Start.mul(upgradeEffect("an", 19))
        player.cp.replicantiSoftcap2Start = player.cp.replicantiSoftcap2Start.mul(buyableEffect("rg", 18))
        player.cp.replicantiSoftcap2Start = player.cp.replicantiSoftcap2Start.mul(buyableEffect("fu", 22))
        player.cp.replicantiSoftcap2Start = player.cp.replicantiSoftcap2Start.mul(buyableEffect("fu", 67))

        // CHALLENGE
        if (inChallenge("fu", 12)) player.cp.replicantiSoftcap2Start = new Decimal(1)

        player.cp.replicantiSoftcap2Effect = player.cp.replicantiPoints.sub(player.cp.replicantiSoftcap2Start).pow(0.25).div(4).max(1)
        if (inChallenge("fu", 12) && hasUpgrade("fu", 106)) player.cp.replicantiSoftcap2Effect = player.cp.replicantiSoftcap2Effect.pow(upgradeEffect("fu", 106))
        if (!inChallenge("fu", 12)) {
            player.cp.replicantiSoftcap2Effect = player.cp.replicantiSoftcap2Effect.div(buyableEffect("pr", 16))
            if (hasUpgrade("an", 22)) player.cp.replicantiSoftcap2Effect = player.cp.replicantiSoftcap2Effect.div(upgradeEffect("an", 22))
            player.cp.replicantiSoftcap2Effect = player.cp.replicantiSoftcap2Effect.div(buyableEffect("fu", 22))
            player.cp.replicantiSoftcap2Effect = player.cp.replicantiSoftcap2Effect.div(buyableEffect("fu", 68))
            if (inChallenge("fu", 11)) player.cp.replicantiSoftcap2Effect = player.cp.replicantiSoftcap2Effect.pow(2)
        } else {
            player.cp.replicantiSoftcap2Effect = player.cp.replicantiSoftcap2Effect.max(1)
        }
        if (player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap2Start)) {
            multAdd = multAdd.div(player.cp.replicantiSoftcap2Effect)
        }

        player.cp.replicantiSoftcap3Start = new Decimal(1e308)
        if (inChallenge("fu", 12)) player.cp.replicantiSoftcap3Start = new Decimal(1)
        if (!player.ir.iriditeDefeated) {
            player.cp.replicantiSoftcap3Effect = player.cp.replicantiPoints.plus(1).log(10).div(30).add(1)
        } else {
            player.cp.replicantiSoftcap3Effect = player.cp.replicantiPoints.plus(1).log(10).div(100).add(1)
        }
        if (inChallenge("fu", 12) && hasUpgrade("fu", 106)) player.cp.replicantiSoftcap3Effect = player.cp.replicantiSoftcap3Effect.pow(upgradeEffect("fu", 106))
        if (player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap3Start)) {
            player.cp.replicantiPointsTimerReq = player.cp.replicantiPointsTimerReq.mul(player.cp.replicantiSoftcap3Effect)
        }

        player.cp.replicantiSoftcap4Start = new Decimal(1e308)
        player.cp.replicantiSoftcap4Effect = Decimal.div(1, player.cp.replicantiPoints.plus(1).log(10).pow(0.7)).min(1)
        if (player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap4Start) && multAdd.gte(1)) {
            multAdd = multAdd.pow(player.cp.replicantiSoftcap4Effect)
        }

        multAdd = multAdd.mul(buyableEffect("fu", 36))
        multAdd = multAdd.mul(player.fu.fearEffect2)

        if (inChallenge("fu", 12) && multAdd.gte(1)) multAdd = multAdd.pow(Decimal.mul(0.2, buyableEffect("fu", 88)))

        multAdd = multAdd.mul(player.en.enhancersEffect[0])

        player.cp.replicantiPointsMult = multAdd.add(1)

        if (player.ca.cantepocalypseUnlock) player.cp.replicantiPointsTimer = player.cp.replicantiPointsTimer.add(onepersec.mul(delta))

        if (player.cp.replicantiPointsTimer.gte(player.cp.replicantiPointsTimerReq)) {
            layers.cp.replicantiPointMultiply();
        }

        //cap
        player.cp.replicantiPointCap = new Decimal(1.79e308)
        if (!inChallenge("fu", 12)) player.cp.replicantiPointCap = player.cp.replicantiPointCap.pow(buyableEffect("cof", 11))
        player.cp.replicantiPointCap = player.cp.replicantiPointCap.pow(player.en.enhancersEffect[1])
        player.cp.replicantiPointCap = player.cp.replicantiPointCap.pow(levelableEffect("car", 308)[0])
    },
    replicantiPointMultiply() {
        if (player.cp.replicantiPoints.gte(player.cp.replicantiPointCap)) {
                player.cp.replicantiPoints = player.cp.replicantiPointCap
        } else {
            player.cp.replicantiPoints = player.cp.replicantiPoints.mul(player.cp.replicantiPointsMult).min(player.cp.replicantiPointCap)
            let random = new Decimal(0)
            random = Math.random()
            if (random < player.pr.perkPointsChance) {
                if (hasUpgrade("cp", 11)) player.pr.perkPoints = player.pr.perkPoints.add(player.pr.perkPointsToGet)
            }
            player.cp.replicantiPointsTimer = new Decimal(0)
        }
    },
    clickables: {},
    bars: {
        replicantiBar: {
            unlocked() { return true },
            direction: RIGHT,
            width: 400,
            height: 25,
            progress() {
                if (player.cp.replicantiPoints.lt(player.cp.replicantiPointCap)) {
                    return player.cp.replicantiPointsTimer.div(player.cp.replicantiPointsTimerReq)
                } else {
                    return new Decimal(1)
                }
            },
            baseStyle: {backgroundColor: "rgba(0,0,0,0.5)"},
            fillStyle: {backgroundColor: "#193ceb"},
            display() {
                if (player.cp.replicantiPoints.lt(player.cp.replicantiPointCap)) {
                    return "Time: " + formatTime(player.cp.replicantiPointsTimer) + "/" + formatTime(player.cp.replicantiPointsTimerReq);
                } else {
                    return "<p style='color:red'>[HARDCAPPED]</p>"
                }
            },
        },
    },
    upgrades: {
        11: {
            // title: "Feature I",
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "1" + 
                "</span></h2><br><br>" + // top
                "Unlock Alt-Ranks.<br><br>" + // middle 
                "Cost: <h3>2</h3> Replicanti Points" + // bottom
                "</div>"
            },
            // description: "Unlocks Alt-Ranks.",
            cost: new Decimal(2),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        12: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "2" + 
                "</span></h2><br><br>" + // top
                "Unlock Perks.<br><br>" + // middle 
                "Cost: <h3>2,500</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(2500),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        13: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "3" + 
                "</span></h2><br><br>" + // top
                "Unlock Tetr Points.<br><br>" + // middle 
                "Cost: <h3>75,000</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(75000),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        14: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "4" + 
                "</span></h2><br><br>" + // top
                "Unlock Anonymity.<br><br>" + // middle 
                "Cost: <h3>3,000,000</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(3e6),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        15: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "5" + 
                "</span></h2><br><br>" + // top
                "Unlock Repli-Trees.<br><br>" + // middle 
                "Cost: <h3>1.00e20</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(1e20),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        16: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "6" + 
                "</span></h2><br><br>" + // top
                "Unlock Repli-Grass.<br><br>" + // middle 
                "Cost: <h3>1.00e30</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(1e30),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        17: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "7" + 
                "</span></h2><br><br>" + // top
                "Unlock Grass-Skip.<br><br>" + // middle 
                "Cost: <h3>1.00e40</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(1e40),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        18: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "8" + 
                "</span></h2><br><br>" + // top
                "ESCAPE CANTEPOCALYPSE, and unlock more oil content.<br><br>" + // middle 
                "Cost: <h3>1.00e90</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(1e90),
            onPurchase() {
                player.cp.cantepocalypseActive = false
            },
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
        19: {
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #000000; background-color: #339988; border-radius: 50%; color: #000000;'>" + 
                "9" + 
                "</span></h2><br><br>" + // top
                "Unlock Funify.<br><br>" + // middle 
                "Cost: <h3>1.00e125</h3> Replicanti Points" + // bottom
                "</div>"
            },
            cost: new Decimal(1e125),
            currencyLocation() { return player.cp },
            currencyDisplayName: "Replicanti Points",
            currencyInternalName: "replicantiPoints",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "200px", 
                    height: "150px"
                }
                return look
            },
        },
    },
    buyables: {},
    milestones: {},
    challenges: {},
    infoboxes: {},
    microtabs: {
        stuff: {
            "Upgrades": {
                buttonStyle() { return { color: "white", borderRadius: "5px" } },
                unlocked() { return true },
                content: [
                    ["blank", "25px"],
                    ["style-row", [["upgrade", 11], ["blank", "10px"], ["upgrade", 12], ["blank", "10px"], ["upgrade", 13]], {maxWidth: "800px"}],
                    ["blank", "10px"],
                    ["style-row", [["upgrade", 14], ["blank", "10px"], ["upgrade", 15], ["blank", "10px"], ["upgrade", 16]], {maxWidth: "800px"}],
                    ["blank", "10px"],
                    ["style-row", [["upgrade", 17], ["blank", "10px"], ["upgrade", 18], ["blank", "10px"], ["upgrade", 19]], {maxWidth: "800px"}],
                ]
            },
            "Softcap": {
                buttonStyle() { return { color: "white", borderRadius: "5px" } },
                unlocked() { return true },
                content: [
                    ["blank", "25px"],
            ["raw-html", function () { return "Softcap starts at <h3>" + format(player.cp.replicantiSoftcapStart) + "</h3>." }, { "color": "white", "font-size": "20px", "font-family": "monospace" }],
            ["raw-html", function () { return "Softcap divides replicanti mult by <h3>/" + format(player.cp.replicantiSoftcapEffect) + "</h3>." }, { "color": "white", "font-size": "20px", "font-family": "monospace" }],
            ["blank", "25px"],
            ["raw-html", function () { return player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap2Start) ? "Second softcap starts at <h3>" + format(player.cp.replicantiSoftcap2Start) + "</h3>." : ""}, { "color": "#ff4545", "font-size": "20px", "font-family": "monospace" }],
            ["raw-html", function () { return player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap2Start) ? "Second softcap divides replicanti mult by <h3>/" + format(player.cp.replicantiSoftcap2Effect) + "</h3>." : ""}, { "color": "#ff4545", "font-size": "20px", "font-family": "monospace" }],
            ["blank", "25px"],
            ["raw-html", function () { return player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap3Start) ? "Third softcap starts at <h3>" + format(player.cp.replicantiSoftcap3Start) + "</h3>." : ""}, { "color": "#cc2121", "font-size": "20px", "font-family": "monospace" }],
            ["raw-html", function () { return player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap3Start) ? "Third softcap multiplies replicanti time requirement by <h3>x" + format(player.cp.replicantiSoftcap3Effect) + "</h3>." : ""}, { "color": "#cc2121", "font-size": "20px", "font-family": "monospace" }],
            ["blank", "25px"],
            ["raw-html", function () { return player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap4Start) ? "Fourth softcap starts at <h3>" + format(player.cp.replicantiSoftcap4Start) + "</h3>." : ""}, { "color": "#9c1c1c", "font-size": "20px", "font-family": "monospace" }],
            ["raw-html", function () { return player.cp.replicantiPoints.gte(player.cp.replicantiSoftcap4Start) ? "Fourth softcap raises replicanti mult by <h3>^" + format(player.cp.replicantiSoftcap4Effect) + "</h3>." : ""}, { "color": "#9c1c1c", "font-size": "20px", "font-family": "monospace" }],
            ["blank", "25px"],
            ["raw-html", function () { return player.cp.replicantiPoints.gte(1e308) ? "Hardcap: <h3>" + format(player.cp.replicantiPointCap) + "</h3>." : ""}, { "color": "black", "font-size": "20px", "font-family": "monospace" }],
                ]
            },
        },
    },
    tabFormat: [
        ["raw-html", () => {return "You have <h3>" + format(player.cp.replicantiPoints) + "</h3> replicanti points."}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["raw-html", () => {return "Replicanti Mult: " + format(player.cp.replicantiPointsMult, 4) + "x"}, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
        ["row", [["bar", "replicantiBar"]]],
        ["microtabs", "stuff", { 'border-width': '0px' }],
        ["blank", "25px"],
    ],
    layerShown() { return player.startedGame == true && (((player.ca.cantepocalypseUnlock && !player.s.highestSingularityPoints.gt(0)) || (player.s.highestSingularityPoints.gt(0) && hasUpgrade("bi", 28))) || hasMilestone("s", 18)) && !player.sma.inStarmetalChallenge}
})
