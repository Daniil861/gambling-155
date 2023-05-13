/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';


function initSliders() {
	if (document.querySelector('.cards__slider')) {
		// Создаем слайдер
		new Swiper('.cards__slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 'auto',
			spaceBetween: 30,
			speed: 800,
		});
	}
}


window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
});