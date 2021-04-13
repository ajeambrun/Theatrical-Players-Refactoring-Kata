function calculateVolumeCredits(perf) {
    let volumeCredits = Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === perf.play.type) volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}



function playForPerformance(plays, perf) {
    return plays[perf.playID];
}

function prepare(invoice, plays) {
    let result = {...invoice};
    result.performances.map(perf => {
        perf.play = playForPerformance(plays, perf);
        perf.amount = calculateAmount(perf);
        perf.volumeCredits = calculateVolumeCredits(perf);
    });

    result.totalAmount = 0;
    result.volumeCredits = 0;
    for (let perf of result.performances) {
        result.volumeCredits += perf.volumeCredits;
        result.totalAmount += perf.amount;
    }

    return result;
}

function USD(amount) {
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
    return format(amount/100);
}

function rawTextStatement(invoice) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        result += ` ${perf.play.name}: ${USD(perf.amount)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${USD(invoice.totalAmount)}\n`;
    result += `You earned ${invoice.volumeCredits} credits\n`;
    return result;
}

function statement (invoice, plays) {
    return rawTextStatement(prepare(invoice, plays));
}

function calculateAmount(perf) {
    let thisAmount = 0;
    switch (perf.play.type) {
        case "tragedy":
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case "comedy":
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error(`unknown type: ${perf.play.type}`);
    }
    return thisAmount;
}

module.exports = statement;
