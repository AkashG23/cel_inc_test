addLayer("an", {
    name: "Anonymity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AN", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "A1",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        anonymity: new Decimal(0),
        anonymityToGet: new Decimal(0),
    }
    },
    automate() {
        if (hasMilestone("s", 17) && (!inChallenge("fu", 11)) && !inChallenge("fu", 12))
        {
            buyUpgrade("an", 11)
            buyUpgrade("an", 12)
            buyUpgrade("an", 13)
            buyUpgrade("an", 14)
            buyUpgrade("an", 15)
            buyUpgrade("an", 16)
            buyUpgrade("an", 17)
            buyUpgrade("an", 18)
            buyUpgrade("an", 19)
            buyUpgrade("an", 21)
            buyUpgrade("an", 22)
            buyUpgrade("an", 23)
        }
    },
    nodeStyle() {},
    tooltip: "Anonymity",
    branches: ["ar"],
    color: "#0c04c1",
    update(delta) {
        let onepersec = new Decimal(1)

        player.an.anonymityToGet = player.cp.replicantiPoints.div(250000).pow(Decimal.mul(0.25, buyableEffect("fu", 83)))
        if (hasUpgrade("an", 18)) player.an.anonymityToGet = player.an.anonymityToGet.mul(upgradeEffect("an", 18))
        player.an.anonymityToGet = player.an.anonymityToGet.mul(player.rt.repliTreesEffect)
        player.an.anonymityToGet = player.an.anonymityToGet.mul(buyableEffect("rg", 17))
        player.an.anonymityToGet = player.an.anonymityToGet.mul(buyableEffect("gs", 16))
        player.an.anonymityToGet = player.an.anonymityToGet.mul(player.oi.linkingPowerEffect[2])
        player.an.anonymityToGet = player.an.anonymityToGet.mul(buyableEffect("fu", 46))
        if (!inChallenge("fu", 12)) {
            player.an.anonymityToGet = player.an.anonymityToGet.mul(levelableEffect("pet", 1206)[0])
            player.an.anonymityToGet = player.an.anonymityToGet.mul(levelableEffect("pet", 402)[1])
            if (hasMilestone("fa", 18)) player.an.anonymityToGet = player.an.anonymityToGet.mul(player.fa.milestoneEffect[7])
            player.an.anonymityToGet = player.an.anonymityToGet.mul(levelableEffect("pu", 103)[2])
            player.an.anonymityToGet = player.an.anonymityToGet.mul(buyableEffect("st", 108))
        }

        // POWER MODIFIERS
        if (!inChallenge("fu", 12)) player.an.anonymityToGet = player.an.anonymityToGet.pow(levelableEffect("pet", 405)[0])
        if (inChallenge("fu", 12)) player.an.anonymityToGet = player.an.anonymityToGet.pow(player.fu.numbEffect2)

        // SOFTCAP
        if (player.an.anonymityToGet.gte("1e5000")) player.an.anonymityToGet = player.an.anonymityToGet.div("1e5000").pow(0.2).mul("1e5000")

        // ALWAYS AFTER
        if (inChallenge("fu", 11)) player.an.anonymityToGet = player.an.anonymityToGet.pow(Decimal.mul(0.2, buyableEffect("fu", 88)))
        if (inChallenge("fu", 12)) player.an.anonymityToGet = player.an.anonymityToGet.add(1).pow(Decimal.mul(0.2, buyableEffect("fu", 88))).sub(1)
        if (inChallenge("fu", 11)) player.an.anonymityToGet = player.an.anonymityToGet.mul(player.fu.jocusEssenceEffect)

        if (hasMilestone("gs", 15)) player.an.anonymity = player.an.anonymity.add(player.an.anonymityToGet.mul(Decimal.mul(delta, 0.1)))
        if (inChallenge("fu", 12) && hasUpgrade("fu", 109)) player.an.anonymity = player.an.anonymity.add(player.an.anonymityToGet.div(10).mul(delta))
    },
    clickables: {
        11: {
            title() { return "<h2>Reset previous content except perks for anonymity.</h2><br><h3>(based on replicanti points)</h3>" },
            canClick() { return player.an.anonymityToGet.gte(1) },
            unlocked() { return true },
            onClick() {
                player.an.anonymity = player.an.anonymity.add(player.an.anonymityToGet)

                player.ar.rankPoints = new Decimal(0)
                player.ar.tierPoints = new Decimal(0)
                player.ar.tetrPoints = new Decimal(0)
                player.cp.replicantiPoints = new Decimal(1)
            },
            style() {
                let look = {width: "400px", minHeight: "100px", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "15px"}
                this.canClick() ? look.color = "white" : look.color = "black"
                return look
            },
        },
    },
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
            
            // title: "Anonymity I",
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "1" + 
                "</span></h2><br><br>" + // top
                "Multiply replicanti mult by x1.5.<br><br>" + // middle 
                "Cost: <h3>2</h3> Anonymity" + // bottom
                "</div>"
            },
            // description: "Multiplies replicanti mult by x1.5.",
            cost: new Decimal(2),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        12: {
            // title: "Anonymity II",
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "2" + 
                "</span></h2><br><br>" + // top
                "Multiply replicanti mult based on anonymity. (x" + format(upgradeEffect(this.layer, this.id)) + ")<br><br>" + // middle 
                "Cost: <h3>5</h3> Anonymity" + // bottom
                "</div>"
            },
            // description: "Multiplies replicanti mult based on anonymity.",
            cost: new Decimal(5),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            effect() {
                return player.an.anonymity.plus(1).log10().pow(1.25).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        13: {
            // title: "Anonymity III",
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "3" + 
                "</span></h2><br><br>" + // top
                "Gain 5% of rank points per second.<br><br>" + // middle 
                "Cost: <h3>16</h3> Anonymity" + // bottom
                "</div>"
            },
            // description: "Gain 5% of rank points per second.",
            cost: new Decimal(16),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        14: {
            // title: "Anonymity IV",
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "4" + 
                "</span></h2><br><br>" + // top
                "Extend the first and second softcap by x1,000.<br><br>" + // middle 
                "Cost: <h3>48</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(48),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        15: {
            title: "Anonymity V",
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "5" + 
                "</span></h2><br><br>" + // top
                "Gain 25% of rank points per second, and gain 5% of tier points per second.<br><br>" + // middle 
                "Cost: <h3>212</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(212),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        16: {
            title: "Anonymity VI",
            unlocked() { return true },
            // description: "Boost perk points based on anonymity.",
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "6" + 
                "</span></h2><br><br>" + // top
                "Boost perk points based on anonymity. (x" + format(upgradeEffect(this.layer, this.id)) + ")<br><br>" + // middle 
                "Cost: <h3>666</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(666),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            effect() {
                return player.an.anonymity.pow(0.15).div(6).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        17: {
            title: "Anonymity VII",
            unlocked() { return true },
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "7" + 
                "</span></h2><br><br>" + // top
                "Gain 100% of rank points, 25% of tier points, and 5% of tetr points on reset per second.<br><br>" + // middle 
                "Cost: <h3>2,222</h3> Anonymity" + // bottom
                "</div>"
            },
            // description: "Gain 100% of rank points per second, and gain 25% of tier points per second, and gain 5% of tetr points per second.",
            cost: new Decimal(2345),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        18: {
            title: "Anonymity VIII",
            unlocked() { return true },
            // description: "Boost anonymity based on perk points.",
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "8" + 
                "</span></h2><br><br>" + // top
                "Boost anonymity based on perk points. (x" + format(upgradeEffect(this.layer, this.id)) + ")<br><br>" + // middle 
                "Cost: <h3>15,000</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(15000),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            effect() {
                return player.pr.perkPoints.pow(0.2).div(3).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        19: {
            title: "Anonymity IX",
            unlocked() { return true },
            // description: "Extend first and second softcap based on anonymity.",
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 25px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 50%; color: #ffffff;'>" + 
                "9" + 
                "</span></h2><br><br>" + // top
                "Extend first and second softcap based on anonymity. (x" + format(upgradeEffect(this.layer, this.id)) + ")<br><br>" + // middle 
                "Cost: <h3>250,000</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(250000),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            effect() {
                return player.an.anonymity.pow(0.75).mul(6).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        21: {
            title: "Anonymity X",
            unlocked() { return true },
            // description: "Reduce repli-leaf time by 1.5s.",
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 40px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 15px; color: #ffffff;'>" + 
                "10" + 
                "</span></h2><br><br>" + // top
                "Reduce repli-leaf time by 1.5s.<br><br>" + // middle 
                "Cost: <h3>4,000,000</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(4e6),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        22: {
            title: "Anonymity XI",
            unlocked() { return true },
            // description: "Weaken second softcap based on second softcap start.",
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 40px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 15px; color: #ffffff;'>" + 
                "11" + 
                "</span></h2><br><br>" + // top
                "Weaken second softcap based on second softcap start. (/" + format(upgradeEffect(this.layer, this.id)) + ")<br><br>" + // middle 
                "Cost: <h3>60,000,000</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(6e7),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            effect() {
                return player.cp.replicantiSoftcap2Start.plus(1).log10().pow(0.65).mul(5).add(1)
            },
            effectDisplay() { return "/" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
                return look
            },
        },
        23: {
            title: "Anonymity XII",
            unlocked() { return true },
            // description: "Multiplies replicanti mult more based on anonymity.",
            fullDisplay() {
                return  "<div>" +
                "<h2><span style='display: inline-block; width: 40px; border: 2px solid #ffffff; background-color: #0c04c1; border-radius: 15px; color: #ffffff;'>" + 
                "12" + 
                "</span></h2><br><br>" + // top
                "Multiplies replicanti mult more based on anonymity. (x" + format(upgradeEffect(this.layer, this.id)) + ")<br><br>" + // middle 
                "Cost: <h3>2.00e10</h3> Anonymity" + // bottom
                "</div>"
            },
            cost: new Decimal(2e10),
            currencyLocation() { return player.an },
            currencyDisplayName: "Anonymity",
            currencyInternalName: "anonymity",
            effect() {
                return player.an.anonymity.plus(1).log10().pow(0.8).mul(1.7).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            style() {
                let look = {
                    color: "#000000bf", 
                    borderColor: "#0000007f",
                    fontSize: "14px", 
                    borderWidth: "2px", 
                    borderRadius: "10px", 
                    padding: "5px", 
                    width: "300px", 
                    height: "150px"
                }
                canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? look.color = "white" : look.color = "#000000bf"
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
            "Main": {
                buttonStyle() { return { color: "white", borderRadius: "5px" } },
                unlocked() { return true },
                content: [
                    ["blank", "10px"],
                    ["row", [
                        ["raw-html", () => { return "You have <h3>" + format(player.an.anonymity) + "</h3> anonymity." }, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", () => { return "(+" + format(player.an.anonymityToGet) + ")" }, () => {
                            let look = {color: "white", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}
                            player.an.anonymityToGet.gte(1) ? look.color = "white" : look.color = "gray"
                            return look
                        }],
                        ['raw-html', () => {return player.an.anonymityToGet.gte("1e5000") ? "[SOFTCAPPED]" : ""}, {color: "red", fontSize: "20px", fontFamily: "monospace", marginLeft: "10px"}]
                    ]],
                    ["blank", "10px"],
                    ["row", [["clickable", 11]]],
                    ["blank", "25px"],
                    ["style-row", [["upgrade", 11], ["blank", "10px"], ["upgrade", 12], ["blank", "10px"], ["upgrade", 13],], {maxWidth: "1100px"}],
                    ["blank", "10px"],
                    ["style-row", [["upgrade", 14], ["blank", "10px"], ["upgrade", 15], ["blank", "10px"], ["upgrade", 16],], {maxWidth: "1100px"}],
                    ["blank", "10px"],
                    ["style-row", [["upgrade", 17], ["blank", "10px"], ["upgrade", 18], ["blank", "10px"], ["upgrade", 19],], {maxWidth: "1100px"}],
                    ["blank", "10px"],
                    ["style-row", [["upgrade", 21], ["blank", "10px"], ["upgrade", 22], ["blank", "10px"], ["upgrade", 23],], {maxWidth: "1100px"}],
                    ["blank", "10px"],
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
    layerShown() { return player.startedGame == true && hasUpgrade("cp", 14) },
    hotkeys: [
        {
            key: "a", 
            description: "Gain Anonymity",
            onPress() {
                clickClickable(this.layer, 11)
            },
        }
	]
})
