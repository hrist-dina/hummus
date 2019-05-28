$(function(){

	function bgHeader() {
		var top = $(document).scrollTop();
		if (top < 30) {
			$(".navigation").removeClass('bg-color');
		} else {
			$(".navigation").addClass('bg-color');
		}
	};

	bgHeader();

	// Слайдер в шапке
	$('.slider').slick({
		dots: true,
		arrows: false,
		autoplay: true,
  		autoplaySpeed: 3000,
  		fade: true
	});

	window.sr = ScrollReveal();

	sr.reveal('.info__block, .info h2', {
		// origin: 'top',
		distance: '50px',
		reset: true,
		mobile: false,
		duration: 1000,

		beforeReveal: function (e) {
			$(e).addClass('active');
		},

		afterReset: function(e) {
			$(e).removeClass('active');
		}
	});

	$('.production .items').slick({
		dots: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 2000,
		fade: true
	});

	var translate = function(elem, x, y, rotate) {
		$(elem).css({
			'transform': 'translate3d(' + x + 'px,' + y + 'px, 0px) rotate('+ -rotate +'deg)',
			'-webkit-backface-visibility': 'hidden',
			'-webkit-perspective': 1000,
			'will-change': 'transform'
		});
	};

	//menu
	$(window).scroll(function() {
		bgHeader();

		// parallax
		var top = $(document).scrollTop();

		translate("#sec-1", 0, 0, top/40);
		translate("#sec-2", 0, 0, -top/20);
		translate("#sec-3", 0, 0, top/27);

		translate("#sec-5", 0, top / 5, 0);
		translate("#sec-6", 0, -top / 6, 0);
		translate("#sec-7", 0, -top / 2, 0);

		translate("#sec-8", 0, top / 4, 0);
		translate("#sec-9", 0, -top / 6, 0);

		translate("#sec-10", 0, -top / 4, 0);
		translate("#sec-11", 0, -top / 5, 0);
		translate("#sec-12", 0, top / 5, 0);

		translate("#sec-14", 0, top / 5, 0);

		translate("#sec-15", 0, -top / 5, 0);
		translate("#sec-16", 0, top / 5, 0);

		translate("#sec-17", 0, -top / 5, 0);
		translate("#sec-18", 0, -top / 5, 0);
	});

	// Навигация
	$(".navigation li:not(.city) a").on("click", function() {
		$(".navigation li").removeClass('active');
		$(this).parent().addClass('active');

		var el = $(this).attr("href");
		var destination = $(el).offset().top - 100;

		jQuery("html:not(:animated),body:not(:animated)").animate({
			scrollTop: destination
		}, 800);

		return false;
	});

	// Прокрутка на карте
	$(window).on("load",function(){
		$(".map-tabs .tabs__caption").mCustomScrollbar();
	});

	$('.tabs').each(function() {
		if($(this).children('.tabs__caption').children('li').length) {
			$(this).children('.tabs__content').eq(0).addClass('active');
			$(this).children('.tabs__caption').children('li').eq(0).addClass('active');
		}
	});

	// modal
	$(".product .item").on('click', function(e) {
		e.preventDefault();
		//var img = $(this).find('.item-modal').data('image-modal');
		//console.log(img);
		$('.modal.modal-product .content').html($(this).find('.item-modal').html());
		$('.modal.modal-product .image').css('background-image', 'url('+$(this).find('.item-modal').data('image-modal')+')');
		$('.modal.modal-product').addClass('active');
		$('body').addClass('hidden');
	});

	$('section.news').on('click','.news-item',function(e) {
		e.preventDefault();

        var newsId = $(this).data('news-id');
        var newUrl = '?news='+newsId;
        history.pushState('', '', newUrl);

		//заголовок
		$('.modal.modal-news .modal-news__title').html($(this).find('.news-item__title').html());
		//картинка
        $('.modal.modal-news .modal-news__image img').attr('src', $(this).find('.item-modal').data('image-modal'));
        //текст
        $('.modal.modal-news .modal-news__content').html($(this).find('.item-modal').html());
        $('.modal.modal-news').addClass('active');
		$('body').addClass('hidden');
	});

	$('section.news').on('click','.showMoreNews',function () {
		var sectionNews = $('section.news'),
		 	postsInBlock = sectionNews.data('posts-in-block'),
			allPosts = sectionNews.data('all-posts');

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            data: {
            	'action' : 'showmore',
            	'postsInBlock' : postsInBlock,
				'allPosts' : allPosts
			},
            success: function(data) {
                sectionNews.html(data);
                sectionNews.data('posts-in-block',postsInBlock+6)
            }
        });
		return false;
    });
	
	$(".close").on('click', function(e) {
		e.preventDefault();
        history.pushState('', '', '/');
		$('.modal').removeClass('active');
	});

	$('.modal .bg').on('click', function() {
		$('.modal').removeClass('active');
	});

	// При клике на кнопку в модалке, добавляем в локальное хранилище
	$('.modal-city-submit').on('click', function(){

		var city = $(this).data('val');

		onlineShops(city);

		$('.modal-city-submit').removeClass('active');
		$(this).addClass('active');
		localStorage.setItem("city", city);

		// Проверяем есть ли у города адреса
		if($('.map-tabs .tabs__caption').find('li[data-city='+city+']').length > 0){
			// Здесь работаем с картой

			$('.map-tabs .tabs__caption').find('li').css('margin', '7px 0'); // Задаю дефотный отступ

			$('.map-tabs .tabs__caption').find('li').hide();
			$('.map-tabs .tabs__caption').find('li').removeClass('active')
			$('.map-tabs .tabs__caption').find('li[data-city='+city+']').show();

			//$('.map-tabs li:visible').eq(0).addClass('active'); // Меняю активный элемент
			$('.map-tabs .tabs__caption li:visible').eq(0).css('margin', '0px 0px 7px 0px'); // добавляю отступ
			$('.map-tabs .tabs__caption li:visible').eq(-1).css('margin', '7px 0px 0px 0px'); // добавляю отступ последнему элементу

			$('.map-tabs .tabs__caption li:visible').eq(0).click();
		}else{
			// Здесь формируем общую карту
			$('.map-tabs .tabs__caption').find('li').show();
		}
 		$('.modal-city').removeClass('active');
		$('.update-city').text(city);

		$('#maps').html('');
        maps();


		return false;
	});

	// Формируем карту
    var city = localStorage.getItem("city");

    if(city != null && city != ''){


		// Проверяем есть ли у города адреса
		if($('.map-tabs .tabs__caption').find('li[data-city='+city+']').length > 0){


			$('.map-tabs .tabs__caption').find('li').hide();
			$('.map-tabs .tabs__caption').find('li').removeClass('active');
			$('.map-tabs .tabs__caption').find('li[data-city='+city+']').show();

			$('.map-tabs .tabs__caption li:visible').eq(0).addClass('active'); // Меняю активный элемент

			$('.map-tabs .tabs__caption').find('.tabs__content').removeClass('active');
			$('.map-tabs .tabs__caption').find('.tabs__content[data-city='+city+']').eq(0).addClass('active');


			$('.map-tabs .tabs__caption li:visible').eq(0).css('margin', '0px 0px 7px 0px'); // добавляю отступ
			$('.map-tabs .tabs__caption li:visible').eq(-1).css('margin', '7px 0px 0px 0px'); // добавляю отступ последнему элементу


		}else{

			// Здесь формируем общую карту
			$('.tabs__content').removeClass('active');

		}

        $('#maps').html('');
        maps();
		$('.update-city').text(city);
		$('.modal-city-submit').removeClass('active');
		$('.modal-city-submit[data-val='+city+']').addClass('active');



    }else{

        $('.modal-city').addClass('active');
        $('.update-city').text('Выбрать город');
        $('#maps').html('');
        maps();
	}


	// Показывыаем модалку при клике на ссылку
	$('.update-city').on('click', function(){
		$('.modal-city').addClass('active');
		return false;
	})



	// Лайтбокс
	lightbox.option({
		positionFromTop: 200
	});

	$('ul.tabs__caption').on('click', 'li:not(.active)', function() {
		$(this).addClass('active')
			   .siblings()
			   .removeClass('active')
			   .closest('div.tabs')
			   .find('div.tabs__content')
			   .removeClass('active')
			   .eq($(this).index())
			   .addClass('active');
	});

	function onlineShops(city) {
		$('.map-tabs').removeClass('online-show');
		$('.online__shop').hide();

		var maptabs = $('.map-tabs');

		$('.online__shop').each(function(i, shop) {

			if ($(shop).data('city').indexOf(city) >= 0) {
				$(maptabs).addClass('online-show');
				$(shop).show();
			}

		});
	}

	onlineShops($('.update-city').text());

});





function maps(){

    function init() {
		var myMap = new ymaps.Map('maps', {
            center: [53.352075, 83.75672],
            zoom: 3,

        });

        $('body').find('.maps__list:visible').each(function(){

            var x = $(this).data('x');
            var y = $(this).data('y');
            var city = $(this).data('city');
            var title = $(this).data('title');

            if(x !='' && y != '' && title != ''){
                myPlacemark = new ymaps.Placemark([x,y],{ balloonContent: '<p>'+ city +', '+title+'</p>' },{

                });

                myMap.geoObjects.add(myPlacemark);
            }
        });
    }
    ymaps.ready(init);
}
