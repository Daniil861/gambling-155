import { deleteMoney, checkRemoveAddClass, noMoney, addMoney } from './functions.js';
import { initStartData } from './script.js';
import { configSlot } from './slot.js';
import { startData } from './startData.js';

const preloader = document.querySelector('.preloader');

// Объявляем слушатель событий "клик"

document.addEventListener('click', (e) => {
	let targetElement = e.target;

	const money = +sessionStorage.getItem('money');
	const currentBet = +sessionStorage.getItem('current-bet');
	initStartData();

	if (targetElement.closest('[data-privacy]') && preloader.classList.contains('_hide')) {
		preloader.classList.remove('_hide');
	}

	if (targetElement.closest('.preloader__button')) {
		preloader.classList.add('_hide');
		sessionStorage.setItem('privacy', true);
	}

	if (targetElement.closest('[data-btn="game-1"]')) {
		setTimeout(() => {
			location.href = 'game-1.html';
		}, 500);
	}

	if (targetElement.closest('[data-btn="game-2"]')) {
		setTimeout(() => {
			location.href = 'game-2.html';
		}, 500);
	}

	//========================================================================================================================================================
	// bet-box

	if (targetElement.closest('.bet-box__minus') && currentBet > startData.countBet) {
		sessionStorage.setItem('current-bet', currentBet - startData.countBet);
		if (document.querySelector(startData.nameBetScore)) document.querySelector(startData.nameBetScore).textContent = sessionStorage.getItem('current-bet');
	}

	if (targetElement.closest('.bet-box__plus') && money > currentBet + startData.countBet && currentBet < startData.maxBet) {
		sessionStorage.setItem('current-bet', currentBet + startData.countBet);
		if (document.querySelector(startData.nameBetScore)) document.querySelector(startData.nameBetScore).textContent = sessionStorage.getItem('current-bet');
	}

	//===
	if (targetElement.closest('.final__button') && document.querySelector('.final').classList.contains('_visible')) {
		document.querySelector('.final').classList.remove('_visible');
	}
})