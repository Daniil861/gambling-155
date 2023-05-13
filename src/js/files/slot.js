import gsap from 'gsap';

import { startData } from './startData.js';
import { deleteMoney, noMoney, addMoney } from './functions.js';
import { showFinalScreen } from './script.js';

let tl = gsap.timeline({ defaults: { ease: "Power1.easeInOut", duration: 1.5 } });

// export const configSlot = {
// 	currentWin: 0,
// 	winCoeff_3: 20,
// 	isAutMode: false,
// 	isWin: false,
// 	autospin: false,
// 	images: ['1', '2', '3', '4']
// }
// const configGSAP = {
// 	duration_1: 3,
// 	duration_3: 3
// }

const configSlot = {
	currentWin: 0,
	winCoeff_3: 60,
	isAutMode: false,
	isWin: false
}

const configGSAP = {
	duration_1: 3,
	duration_3: 3
}

function upProgress() {
	const progress = +sessionStorage.getItem('progress');

	if (progress < 18) {
		sessionStorage.setItem('progress', progress + 1);
	}
}
export function writeProgress() {
	const progress = +sessionStorage.getItem('progress');
	const countProgress = progress * 500;

	document.querySelector('.check-star').textContent = `${countProgress} / 9000`;
}

if (document.querySelector('.slot__body')) {
	document.querySelector('.score').textContent = sessionStorage.getItem('money');

	writeProgress();

	initBet();
}

function initBet() {
	if (+sessionStorage.getItem('money') >= 50) {
		sessionStorage.setItem('current-bet', 50);
		document.querySelector(startData.nameBetScore).textContent = sessionStorage.getItem('current-bet');
	} else {
		sessionStorage.setItem('current-bet', 0);
		document.querySelector(startData.nameBetScore).textContent = 0;
	}
}

function updateScreenCurrentWin() {
	const winBox = document.querySelector('.total-win');
	winBox.textContent = configSlot.currentWin;
}


//========================================================================================================================================================
//=====

let slot3 = null;

class Slot3 {
	constructor(domElement, config = {}) {
		Symbol3.preload();

		this.currentSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["2", "3", "4"],
			["5", "6", "3"],
		];

		this.nextSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["2", "3", "4"],
			["5", "6", "3"],
		];

		this.container = domElement;

		this.reels = Array.from(this.container.getElementsByClassName("reel3")).map(
			(reelContainer, idx) =>
				new Reel3(reelContainer, idx, this.currentSymbols[idx])
		);

		this.spinButton = document.querySelector('.controls-slot__button-spin');
		this.spinButton.addEventListener("click", () => {
			//при запуске сбрасываем интервал запуска между слотами
			tl.to(this.spinButton, {});

			if ((+sessionStorage.getItem('money') >= +sessionStorage.getItem('current-bet'))) {
				this.spin();

			} else {
				noMoney('.score');
			}
		});

		this.maxBetButton = document.querySelector('.controls-slot__max');
		this.maxBetButton.addEventListener("click", () => {
			//при запуске сбрасываем интервал запуска между слотами
			tl.to(this.spinButton, {});

			const money = +sessionStorage.getItem('money');
			let bet = 0;
			if (money > 550) {
				bet = 500;
				sessionStorage.setItem('current-bet', bet);
				this.spin();
			} else if (money < 500 && money > 50) {
				bet = money - 50;
				sessionStorage.setItem('current-bet', bet);
				this.spin();
			} else {
				noMoney('.score');
			}
		});

		this.casinoAutoSpinCount = 0;
		this.autoSpinButton = document.querySelector('.controls-slot__auto');

		this.autoSpinButton.addEventListener("click", () => {
			tl.to(this.spinButton, {});
			var oThis = this;
			this.casinoAutoSpinCount = 0;
			configSlot.isAutMode = true;

			if ((+sessionStorage.getItem('money') > +sessionStorage.getItem('current-bet'))) {
				this.casinoAutoSpinCount++;
				this.spin();
			}
			this.casinoAutoSpin = setInterval(function () {
				tl.to(oThis.spinButton, {});

				oThis.casinoAutoSpinCount++;
				if (oThis.casinoAutoSpinCount >= 9) configSlot.isAutMode = false;
				if (oThis.casinoAutoSpinCount < 10 && (+sessionStorage.getItem('money') >= +sessionStorage.getItem('current-bet'))) {
					oThis.spin();
				} else {
					clearInterval(oThis.casinoAutoSpin);
					noMoney('.check');
					configSlot.isAutMode = false;
				}
			}, 5500);
		});

		if (config.inverted) {
			this.container.classList.add("inverted");
		}
		this.config = config;
	}

	async spin() {
		this.currentSymbols = this.nextSymbols;
		this.nextSymbols = [
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
		];

		this.onSpinStart(this.nextSymbols);

		await Promise.all(
			this.reels.map((reel) => {
				reel.renderSymbols(this.nextSymbols[reel.idx]);
				return reel.spin(this.nextSymbols);
			})
		);
	}

	onSpinStart(symbols) {
		deleteMoney(+sessionStorage.getItem('current-bet'), '.score', 'money');

		this.spinButton.classList.add('_hold');
		this.maxBetButton.classList.add('_hold');
		this.autoSpinButton.classList.add('_hold');
		document.querySelector('.bet-box').classList.add('_lock');

		if (symbols)
			this.config.onSpinStart(symbols);
	}

	onSpinEnd(symbols) {
		if (!configSlot.isAutMode) {
			this.spinButton.classList.remove('_hold');
			this.maxBetButton.classList.remove('_hold');
			this.autoSpinButton.classList.remove('_hold');
			document.querySelector('.bet-box').classList.remove('_lock');
		}

		upProgress();
		writeProgress();

		if (symbols && configSlot.isAutMode) {
			this.config.onSpinEnd(symbols, this.casinoAutoSpin, this.spinButton, this.maxBetButton, this.autoSpinButton);
		} else {
			this.config.onSpinEnd(symbols);
		}
	}
}

class Reel3 {
	constructor(reelContainer, idx, initialSymbols) {
		this.reelContainer = reelContainer;
		this.idx = idx;

		this.symbolContainer = document.createElement("div");
		this.symbolContainer.classList.add("icons");
		this.reelContainer.appendChild(this.symbolContainer);

		initialSymbols.forEach((symbol) =>
			this.symbolContainer.appendChild(new Symbol3(symbol).img)
		);
	}

	get factor() {
		return 3 + Math.pow(this.idx / 2, 2);
	}

	renderSymbols(nextSymbols) {
		const fragment = document.createDocumentFragment();

		for (let i = 3; i < 3 + Math.floor(this.factor) * 10; i++) {
			const icon = new Symbol3(
				i >= 10 * Math.floor(this.factor) - 2
					? nextSymbols[i - Math.floor(this.factor) * 10]
					: undefined
			);
			fragment.appendChild(icon.img);
		}

		this.symbolContainer.appendChild(fragment);
	}

	async spin(symbols) {
		// запускаем анимацию смещения колонки
		this.param = ((Math.floor(this.factor) * 10) / (3 + Math.floor(this.factor) * 10)) * 100;

		await tl.fromTo(this.symbolContainer, { translateY: 0, }, {
			translateY: `${-this.param}%`,
			duration: configGSAP.duration_3,
			onComplete: () => {

				// определяем какое количество картинок хотим оставить в колонке
				const max = this.symbolContainer.children.length - 3; // 3 - количество картинок в одной колонке после остановки

				gsap.to(this.symbolContainer, { translateY: 0, duration: 0 });

				// запускаем цикл, в котором оставляем определенное количество картинок в конце колонки
				for (let i = 0; i < max; i++) {
					this.symbolContainer.firstChild.remove();
				}
			}
		}, '<10%');

		// После выполнения анимации запускаем сценарий разблокировки кнопок и проверки результата
		slot3.onSpinEnd(symbols);
	}
}

const cache3 = {};

class Symbol3 {
	constructor(name = Symbol3.random()) {
		this.name = name;

		if (cache3[name]) {
			this.img = cache3[name].cloneNode();
		} else {

			this.img = new Image();
			this.img.src = `img/game-1/slot-${name}.png`;

			cache3[name] = this.img;
		}
	}

	static preload() {
		Symbol3.symbols.forEach((symbol) => new Symbol3(symbol));
	}

	static get symbols() {
		return [
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
		];
	}

	static random() {
		return this.symbols[Math.floor(Math.random() * this.symbols.length)];
	}
}

const config3 = {
	inverted: false,
	onSpinStart: (symbols) => {

	},
	onSpinEnd: (symbols, autospin, spinButton, maxBetButton, autoSpinButton) => {
		if (symbols[0][0] == symbols[1][0] && symbols[1][0] == symbols[2][0] && symbols[2][0] == symbols[3][0] ||
			symbols[0][1] == symbols[1][1] && symbols[1][1] == symbols[2][1] && symbols[2][1] == symbols[3][1] ||
			symbols[0][2] == symbols[1][2] && symbols[1][2] == symbols[2][2] && symbols[2][2] == symbols[3][2]
		) {

			if (configSlot.isAutMode) {
				clearInterval(autospin);
				configSlot.isAutMode = false;

				spinButton.classList.remove('_hold');
				maxBetButton.classList.remove('_hold');
				autoSpinButton.classList.remove('_hold');
				document.querySelector('.bet-box').classList.remove('_lock');
			}

			let currintWin = +sessionStorage.getItem('current-bet') * configSlot.winCoeff_3;

			// Записываем сколько выиграно на данный момент
			configSlot.currentWin += currintWin;

			updateScreenCurrentWin();

			addMoney(currintWin, '.score', 1000, 2000);

			showFinalScreen(currintWin);

		}
	},
};

if (document.querySelector('.wrapper_game-3')) {
	slot3 = new Slot3(document.getElementById("slot3"), config3);
}

//========================================================================================================================================================
let slot1 = null;

class Slot1 {
	constructor(domElement, config = {}) {
		Symbol1.preload();

		this.currentSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["7", "1", "2"],
			["3", "4", "5"],
		];

		this.nextSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["7", "1", "2"],
			["3", "4", "5"],
		];

		this.container = domElement;

		this.reels = Array.from(this.container.getElementsByClassName("reel1")).map(
			(reelContainer, idx) =>
				new Reel1(reelContainer, idx, this.currentSymbols[idx])
		);

		this.spinButton = document.querySelector('.controls-slot__button-spin');
		this.spinButton.addEventListener("click", () => {
			//при запуске сбрасываем интервал запуска между слотами
			tl.to(this.spinButton, {});

			if ((+sessionStorage.getItem('money') >= +sessionStorage.getItem('current-bet'))) {
				this.spin();

			} else {
				noMoney('.score');
			}
		});

		this.maxBetButton = document.querySelector('.controls-slot__max');
		this.maxBetButton.addEventListener("click", () => {
			//при запуске сбрасываем интервал запуска между слотами
			tl.to(this.spinButton, {});

			const money = +sessionStorage.getItem('money');
			let bet = 0;
			if (money > 550) {
				bet = 500;
				sessionStorage.setItem('current-bet', bet);
				this.spin();
			} else if (money < 500 && money > 50) {
				bet = money - 50;
				sessionStorage.setItem('current-bet', bet);
				this.spin();
			} else {
				noMoney('.score');
			}
		});

		this.casinoAutoSpinCount = 0;
		this.autoSpinButton = document.querySelector('.controls-slot__auto');

		this.autoSpinButton.addEventListener("click", () => {
			tl.to(this.spinButton, {});
			var oThis = this;
			this.casinoAutoSpinCount = 0;
			configSlot.isAutMode = true;

			if ((+sessionStorage.getItem('money') > +sessionStorage.getItem('current-bet'))) {
				this.casinoAutoSpinCount++;
				this.spin();
			}
			this.casinoAutoSpin = setInterval(function () {
				tl.to(oThis.spinButton, {});

				oThis.casinoAutoSpinCount++;
				if (oThis.casinoAutoSpinCount >= 9) configSlot.isAutMode = false;
				if (oThis.casinoAutoSpinCount < 10 && (+sessionStorage.getItem('money') >= +sessionStorage.getItem('current-bet'))) {
					oThis.spin();
				} else {
					clearInterval(oThis.casinoAutoSpin);
					noMoney('.check');
					configSlot.isAutMode = false;
				}
			}, 5500);
		});

		if (config.inverted) {
			this.container.classList.add("inverted");
		}
		this.config = config;
	}

	async spin() {
		this.currentSymbols = this.nextSymbols;
		this.nextSymbols = [
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
		];

		this.onSpinStart(this.nextSymbols);

		await Promise.all(
			this.reels.map((reel) => {
				reel.renderSymbols(this.nextSymbols[reel.idx]);
				return reel.spin(this.nextSymbols);
			})
		);
	}

	onSpinStart(symbols) {
		deleteMoney(+sessionStorage.getItem('current-bet'), '.score', 'money');

		this.spinButton.classList.add('_hold');
		this.maxBetButton.classList.add('_hold');
		this.autoSpinButton.classList.add('_hold');
		document.querySelector('.bet-box').classList.add('_lock');

		if (symbols)
			this.config.onSpinStart(symbols);
	}

	onSpinEnd(symbols) {
		if (!configSlot.isAutMode) {
			this.spinButton.classList.remove('_hold');
			this.maxBetButton.classList.remove('_hold');
			this.autoSpinButton.classList.remove('_hold');
			document.querySelector('.bet-box').classList.remove('_lock');
		}

		upProgress();
		writeProgress();

		if (symbols && configSlot.isAutMode) {
			this.config.onSpinEnd(symbols, this.casinoAutoSpin, this.spinButton, this.maxBetButton, this.autoSpinButton);
		} else {
			this.config.onSpinEnd(symbols);
		}
	}
}

class Reel1 {
	constructor(reelContainer, idx, initialSymbols) {
		this.reelContainer = reelContainer;
		this.idx = idx;

		this.symbolContainer = document.createElement("div");
		this.symbolContainer.classList.add("icons");
		this.reelContainer.appendChild(this.symbolContainer);

		initialSymbols.forEach((symbol) =>
			this.symbolContainer.appendChild(new Symbol1(symbol).img)
		);
	}

	get factor() {
		return 3 + Math.pow(this.idx / 2, 2);
	}

	renderSymbols(nextSymbols) {
		const fragment = document.createDocumentFragment();

		for (let i = 3; i < 3 + Math.floor(this.factor) * 10; i++) {
			const icon = new Symbol1(
				i >= 10 * Math.floor(this.factor) - 2
					? nextSymbols[i - Math.floor(this.factor) * 10]
					: undefined
			);
			fragment.appendChild(icon.img);
		}

		this.symbolContainer.appendChild(fragment);
	}

	async spin(symbols) {
		// запускаем анимацию смещения колонки
		this.param = ((Math.floor(this.factor) * 10) / (3 + Math.floor(this.factor) * 10)) * 100;

		await tl.fromTo(this.symbolContainer, { translateY: 0, }, {
			translateY: `${-this.param}%`,
			duration: configGSAP.duration_3,
			onComplete: () => {

				// определяем какое количество картинок хотим оставить в колонке
				const max = this.symbolContainer.children.length - 3; // 3 - количество картинок в одной колонке после остановки

				gsap.to(this.symbolContainer, { translateY: 0, duration: 0 });

				// запускаем цикл, в котором оставляем определенное количество картинок в конце колонки
				for (let i = 0; i < max; i++) {
					this.symbolContainer.firstChild.remove();
				}
			}
		}, '<10%');

		// После выполнения анимации запускаем сценарий разблокировки кнопок и проверки результата
		slot1.onSpinEnd(symbols);
	}
}

const cache1 = {};

class Symbol1 {
	constructor(name = Symbol1.random()) {
		this.name = name;

		if (cache1[name]) {
			this.img = cache1[name].cloneNode();
		} else {

			this.img = new Image();
			this.img.src = `img/game-2/slot-${name}.png`;

			cache1[name] = this.img;
		}
	}

	static preload() {
		Symbol1.symbols.forEach((symbol) => new Symbol1(symbol));
	}

	static get symbols() {
		return [
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7'
		];
	}

	static random() {
		return this.symbols[Math.floor(Math.random() * this.symbols.length)];
	}
}

const config1 = {
	inverted: false,
	onSpinStart: (symbols) => {

	},
	onSpinEnd: (symbols, autospin, spinButton, maxBetButton, autoSpinButton) => {
		if (symbols[0][0] == symbols[1][0] && symbols[1][0] == symbols[2][0] && symbols[2][0] == symbols[3][0] ||
			symbols[0][1] == symbols[1][1] && symbols[1][1] == symbols[2][1] && symbols[2][1] == symbols[3][1] ||
			symbols[0][2] == symbols[1][2] && symbols[1][2] == symbols[2][2] && symbols[2][2] == symbols[3][2]
		) {

			if (configSlot.isAutMode) {
				clearInterval(autospin);
				configSlot.isAutMode = false;

				spinButton.classList.remove('_hold');
				maxBetButton.classList.remove('_hold');
				autoSpinButton.classList.remove('_hold');
				document.querySelector('.bet-box').classList.remove('_lock');
			}

			let currintWin = +sessionStorage.getItem('current-bet') * configSlot.winCoeff_3;

			// Записываем сколько выиграно на данный момент
			configSlot.currentWin += currintWin;

			updateScreenCurrentWin();

			addMoney(currintWin, '.score', 1000, 2000);
		}
	},
};

if (document.querySelector('.wrapper_game-1')) {
	slot1 = new Slot1(document.getElementById("slot1"), config1);
}

