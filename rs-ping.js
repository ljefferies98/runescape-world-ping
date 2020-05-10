var ping = require("net-ping");
var axios = require("axios")

var options = {
	retries: 3,
	timeout: 2000
};

var session = ping.createSession(options);

session.on("error", function (error) {
	console.trace(error.toString());
});

var targets = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	28,
	29,
	30,
	31,
	32,
	33,
	34,
	35,
	36,
	37,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	46,
	47,
	48,
	49,
	50,
	51,
	52,
	53,
	54,
	55,
	56,
	57,
	58,
	59,
	60,
	61,
	62,
	63,
	64,
	65,
	66,
	67,
	68,
	69,
	70,
	71,
	72,
	73,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	82,
	83,
	84,
	85,
	86,
	87,
	88,
	89,
	91,
	92,
	96,
	97,
	98,
	99,
	100,
	103,
	104,
	105,
	106,
	108,
	114,
	115,
	116,
	117,
	119,
	120,
	123,
	124,
	134,
	135,
	136,
	137,
	138,
	139,
	140,
	141
];

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

async function loadIps() {
	let domains = [];
	let ips = [];

	targets.forEach(target => {
		let domain = "world" + target + ".runescape.com";
		domains.push({ name: "World " + target, data: domain });
	});

	for (let index = 0; index < domains.length; index++) {
		console.log("Completed: " + index + " Domains")
		let resp = await resolveDomain(domains[index].data);

		ips.push({ name: domains[index].name, data: resp.data["query"] });
	}

	pingIps(ips)
}

async function resolveDomain(domain) {
	return new Promise(resolve => {
		setTimeout(async () => {
			let resp = await axios.get("http://ip-api.com/json/" + domain);
			console.log(resp.data["query"]);
			resolve(resp);
		}, 2000);
	});
}

async function pingIps(ips) {
	let validWorlds = [];

	for (var i = 0; i < ips.length; i++) {
		let ping = {}
		ping.name = ips[i].name;
		ping.data = await sendPing(ips[i].data);
		validWorlds.push(ping);
	}

	console.log(validWorlds);

	let sortedWorlds = validWorlds.sort(function (a, b) {
		return a.data - b.data;
	});

	for(let i = 0; i < 5; i++) {
		let world = sortedWorlds[i];
		console.log(world.name + ": " + world.data + "ms");
	}

};

async function sendPing(target) {
	return new Promise((resolve) => {
		session.pingHost(target, function (error, target, sent, rcvd) {
			var ms = rcvd - sent;
			if (error) {
				if (error instanceof ping.RequestTimedOutError)
					console.log(target + ": Not alive (ms=" + ms + ")");
				else
					console.log(target + ": " + error.toString() + " (ms="
						+ ms + ")");
			} else {
				resolve(ms);
			}
		});
	});
}

function start() {
	loadIps();
}

start();