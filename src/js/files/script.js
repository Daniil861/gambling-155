import gsap from 'gsap';
import { deleteMoney, checkRemoveAddClass, noMoney, getRandom, addMoney, getRandom_2 } from './functions.js';
import { startData } from './startData.js';
import { writeProgress } from './slot.js';

if (sessionStorage.getItem('privacy') && document.querySelector('.preloader')) {
	document.querySelector('.preloader').classList.add('_hide');
}


export function initStartData() {

	if (sessionStorage.getItem('money')) {
		writeScore();
	} else {
		sessionStorage.setItem('money', startData.bank);
		writeScore();
	}

	if (!sessionStorage.getItem('current-bet')) {
		sessionStorage.setItem('current-bet', startData.countBet);
		writeCurrentBet();
	} else {
		writeCurrentBet();
	}

	if (!sessionStorage.getItem('progress')) sessionStorage.setItem('progress', 0);
}

function writeScore() {
	if (document.querySelector(startData.nameScore)) {
		document.querySelectorAll(startData.nameScore).forEach(el => {
			el.textContent = sessionStorage.getItem('money');
		})
	}
}

export function writeCurrentBet() {
	const betItem = document.querySelectorAll(startData.nameBetScore);
	if (betItem.length) {
		betItem.forEach(item => {
			item.textContent = sessionStorage.getItem('current-bet');
		})
	}

}

initStartData();


initStartData();

let tl = gsap.timeline({ defaults: { ease: "Power1.easeInOut", duration: 1.5 } });

// Функция присвоения случайного класса анимациии money icon
const anim_items = document.querySelectorAll('.icon-anim');
function getRandomAnimate() {
	let number = getRandom(0, 3);
	let arr = ['jump', 'scale', 'rotate'];
	let random_item = getRandom(0, anim_items.length);
	anim_items.forEach(el => {
		if (el.classList.contains('_anim-icon-jump')) {
			el.classList.remove('_anim-icon-jump');
		} else if (el.classList.contains('_anim-icon-scale')) {
			el.classList.remove('_anim-icon-scale');
		} else if (el.classList.contains('_anim-icon-rotate')) {
			el.classList.remove('_anim-icon-rotate');
		}
	})
	setTimeout(() => {
		anim_items[random_item].classList.add(`_anim-icon-${arr[number]}`);
	}, 100);
}

if (anim_items.length) {
	setInterval(() => {
		getRandomAnimate();
	}, 20000);
}
//========================================================================================================================================================
//main
if (document.querySelector('.main')) {
	document.querySelector('.main').classList.add('_active');
	writeProgress();
}

//========================================================================================================================================================


export function showFinalScreen(count = 0) {
	const final = document.querySelector('.final');
	const finalCheck = document.querySelector('.final-check');

	finalCheck.textContent = count;

	setTimeout(() => {
		final.classList.add('_visible');
	}, 500);
}