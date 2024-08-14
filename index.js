const readline = require("readline/promises");
const _ = require('lodash')
const prompt = async (message) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await rl.question(message);
    rl.close();
    return answer;
};
function GenCards() {
    const runNumber = [
        "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "King", "Queen", "Jack"
    ]
    const suits = ["Clubs", "Diamonds", "Hearts", "Spades"]
    let cards = []
    runNumber.forEach(number => {
        const card = suits.map(e => `${e}-${number}`)
        cards = [...cards, ...card]
    })
    return cards
}
function GenPlayers(num) {
    const players = { You: [] }
    for (let i = 2; i <= num - 1; i++) {
        players[`player${i}`] = []
    }
    players['dealer'] = []
    return players
}
function shuffled(cards) {
    let curIndex = cards.length
    while (curIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * curIndex)
        curIndex--
        [cards[curIndex], cards[randomIndex]] = [cards[randomIndex], cards[curIndex]]
    }
    return cards
}
function drawCards(cards, players) {
    let round = 0
    let cardIndex = 0
    while (round < 2) {
        for (let item in players) {
            players[item].push(cards[cardIndex])
            cardIndex++
        }
        round++
    }
    for (let item in players) {
        console.log(`${item} get ${players[item].join(', ')}`);
    }
    return players
}
function calPoint(cards) {
    let point = 0
    cards.forEach(el => {
        const number = el.split('-')[1]
        switch (number) {
            case "Ace":
                point += 1
                break;
            case "King":
            case "Queen":
            case "Jack":
                point += 10
                break;
            default:
                point += Number(number)
                break;
        }
    })
    point = point % 10
    return point
}
function points(players) {
    let pointOfPlayers = {}
    for (let player in players) {
        const point = calPoint(players[player])
        pointOfPlayers[player] = point
    }
    return pointOfPlayers
}
function checkPoint(points, bet) {
    if (points['You'] > points['dealer']) {
        console.log(`You won!!!, received ${bet} chips`);
        return bet
    } else if (points['You'] === points['dealer']) {
        console.log(`You tie!!!, received 0 chips`);
        return 0
    } else {
        console.log(`You lose!!!, losed ${bet} chips`);
        return -bet
    }
}
async function startGame() {
    const cards = GenCards()
    let goAhead = "Yes"
    console.log('Please put your bet');
    const myBet = Number(await prompt(""));
    console.log('Please put num of player');
    const numOfPlayers = Number(await prompt(""));
    let myEarned = myBet
    while (goAhead === "Yes") {
        const playersInGame = GenPlayers(numOfPlayers)
        const shuffledCards = shuffled(cards)
        const cardDrawed = drawCards(shuffledCards, playersInGame)
        const pointOfPlayers = points(cardDrawed)
        const earned = checkPoint(pointOfPlayers, myBet)
        myEarned += earned
        console.log("Wanna play more (Yes/No)?")
        goAhead = await prompt("")
    }
    console.log(`You got total ${myEarned} chips`);
}
startGame()