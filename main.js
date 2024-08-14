const readline = require("readline/promises");

const prompt = async (message) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await rl.question(message);
    rl.close();
    return answer;
};
function GenDesk() {
    const runNumber = [
        "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "King", "Queen", "Jack"
    ]
    const suits = ["Clubs", "Diamonds", "Hearts", "Spades"]
    let deck = []
    runNumber.forEach(number => {
        const card = suits.map(e => `${e}-${number}`)
        deck = [...deck, ...card]
    })
    return deck
}
async function dealCardAndCalPoint(shuffled, player) {
    const deal = shuffled.slice(0, 2)
    console.log(`${player} got ${deal.join(', ')}`);
    let point = 0
    deal.forEach(el => {
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
    return [shuffled.slice(2), point]
}
async function calPoint(cards) {
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
async function dealCardAndCalPointV2(shuffled) {
    const numPlayer = 3
    const total_player = { player1: [], player2: [], player3: [] }
    shuffled.forEach((fl, index) => {
        const to = index % 3
        switch (to) {
            case 0:
                total_player.player1.push(fl)
                break;

            default:
                break;
        }
    })
    const player = [shuffled[0], shuffled[2]]
    console.log(`player got ${player.join(', ')}`);
    const dealer = [shuffled[1], shuffled[3]]
    console.log(`dealer got ${dealer.join(', ')}`);
    const myPoint = await calPoint(player)
    const dealerPoint = await calPoint(dealer)
    return { myPoint, dealerPoint }
}
async function shuffledArray(desks) {
    let curIndex = desks.length
    while (curIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * curIndex);
        curIndex--;
        [desks[curIndex], desks[randomIndex]] = [
            desks[randomIndex], desks[curIndex]];
    }
    return desks
}
async function dealCardToPlayer(desks) {
    let shuffled = await shuffledArray(desks)
    // [shuffled, myPoint] = await dealCardAndCalPoint(shuffled, "You");
    // [shuffled, dealerPoint] = await dealCardAndCalPoint(shuffled, "The dealer");
    return await dealCardAndCalPointV2(shuffled)
}
async function checkPoint(my, deal, bets) {
    if (my > deal) {
        console.log(`You won!!!, received ${bets} chips`);
        return bets
    } else if (my === deal) {
        console.log(`You tie!!!, received 0 chips`);
        return 0
    } else {
        console.log(`You won!!!, losed ${bets} chips`);
        return -bets
    }
}
async function playGame(desks, myBets) {
    const { myPoint, dealerPoint } = await dealCardToPlayer(desks)
    const earned = await checkPoint(myPoint, dealerPoint, Number(myBets))
    return earned
}
async function startGame() {
    const desks = GenDesk()
    let goAhead = "Yes"
    console.log('Please put your bet');
    const myBets = Number(await prompt(""));
    let myEarned = myBets
    while (goAhead === "Yes") {
        const earned = await playGame(desks, myBets)
        myEarned += earned
        console.log("Wanna play more (Yes/No)?")
        goAhead = await prompt("")
    }
    console.log(`You got total ${myEarned} chips`);
}
startGame()

