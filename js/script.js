//webp-image
function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }
});
//file-clip
$(document).ready(function () {
    $("#fl_inp").change(function () {
        var filename = $(this).val().replace(/.*\\/, "");
        $("#fl_nm").html(filename);
    });
});
//file-clip-end
//webp-image-end
//let swiperModelAuto = new Swiper('.cars-name-slider-main-container', {
//    slidesPerView: 2,
//    spaceBetween: 10,
//    loop: true,
//    navigation: {
//        nextEl: '.cars-name-slider-main-button-next',
//        prevEl: '.cars-name-slider-main-button-prev',
//    },
//    breakpoints: {
//        // when window width is >= 320px
//        576: {
//            slidesPerView: 3,
//            spaceBetween: 20
//        },
//        // when window width is >= 480px
//        768: {
//            slidesPerView: 5,
//        },
//        // when window width is >= 640px
//        992: {
//            slidesPerView: 7,
//        },
//        1230: {
//            slidesPerView: 8,
//        }
//    }
//});
let swiper = new Swiper('.first-section__content-slider', {
    fadeEffect: {
        crossFade: true
    },
    slidesPerView: 1,
    spaceBetween: 10,
    allowTouchMove: false,
    loop: true,
    autoplay: {
        delay: 9800,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.slider-head-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return `<div class="dot-line swiper-pagination-bullet">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" class="loader">
                <circle class="progress" fill="none" stroke-linecap="round" cx="20" cy="20" r="15.915494309" />
            </svg>
            <div class="dot-line-item"></div>
        </div>`;
        },
    },
});
//tabs
let tab = function () {
    let tabNav = document.querySelectorAll('.tabs-service__wrap-nav-main-item'),
        tabContent = document.querySelectorAll('.tabs-service__wrap-content-item'),
        tabName;

    tabNav.forEach(item => {
        item.addEventListener('click', selectTabNav)
    });

    function selectTabNav() {
        tabNav.forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
        tabName = this.getAttribute('data-tab-name');
        selectTabContent(tabName);
    }

    function selectTabContent(tabName) {
        tabContent.forEach(item => {
            item.classList.contains(tabName) ? item.classList.add('active') : item.classList.remove('active');
        })
    }

};


tab();
//end-tabs


//dinamic-adaptive
(function () {
    let originalPositions = [];
    let daElements = document.querySelectorAll('[data-da]');
    let daElementsArray = [];
    let daMatchMedia = [];
    //Заполняем массивы
    if (daElements.length > 0) {
        let number = 0;
        for (let index = 0; index < daElements.length; index++) {
            const daElement = daElements[index];
            const daMove = daElement.getAttribute('data-da');
            if (daMove != '') {
                const daArray = daMove.split(',');
                const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
                const daDestination = document.querySelector('.' + daArray[0].trim())
                if (daArray.length > 0 && daDestination) {
                    daElement.setAttribute('data-da-index', number);
                    //Заполняем массив первоначальных позиций
                    originalPositions[number] = {
                        "parent": daElement.parentNode,
                        "index": indexInParent(daElement)
                    };
                    //Заполняем массив элементов 
                    daElementsArray[number] = {
                        "element": daElement,
                        "destination": document.querySelector('.' + daArray[0].trim()),
                        "place": daPlace,
                        "breakpoint": daBreakpoint,
                        "type": daType
                    }
                    number++;
                }
            }
        }
        dynamicAdaptSort(daElementsArray);

        //Создаем события в точке брейкпоинта
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daBreakpoint = el.breakpoint;
            const daType = el.type;

            daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
            daMatchMedia[index].addListener(dynamicAdapt);
        }
    }
    //Основная функция
    function dynamicAdapt(e) {
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daElement = el.element;
            const daDestination = el.destination;
            const daPlace = el.place;
            const daBreakpoint = el.breakpoint;
            const daClassname = "_dynamic_adapt_" + daBreakpoint;

            if (daMatchMedia[index].matches) {
                //Перебрасываем элементы
                if (!daElement.classList.contains(daClassname)) {
                    let actualIndex = indexOfElements(daDestination)[daPlace];
                    if (daPlace === 'first') {
                        actualIndex = indexOfElements(daDestination)[0];
                    } else if (daPlace === 'last') {
                        actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                    }
                    daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                    daElement.classList.add(daClassname);
                }
            } else {
                //Возвращаем на место
                if (daElement.classList.contains(daClassname)) {
                    dynamicAdaptBack(daElement);
                    daElement.classList.remove(daClassname);
                }
            }
        }
        customAdapt();
    }

    //Вызов основной функции
    dynamicAdapt();

    //Функция возврата на место
    function dynamicAdaptBack(el) {
        const daIndex = el.getAttribute('data-da-index');
        const originalPlace = originalPositions[daIndex];
        const parentPlace = originalPlace['parent'];
        const indexPlace = originalPlace['index'];
        const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
    }
    //Функция получения индекса внутри родителя
    function indexInParent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
    }
    //Функция получения массива индексов элементов внутри родителя 
    function indexOfElements(parent, back) {
        const children = parent.children;
        const childrenArray = [];
        for (let i = 0; i < children.length; i++) {
            const childrenElement = children[i];
            if (back) {
                childrenArray.push(i);
            } else {
                //Исключая перенесенный элемент
                if (childrenElement.getAttribute('data-da') == null) {
                    childrenArray.push(i);
                }
            }
        }
        return childrenArray;
    }
    //Сортировка объекта
    function dynamicAdaptSort(arr) {
        arr.sort(function (a, b) {
            if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
        });
        arr.sort(function (a, b) {
            if (a.place > b.place) { return 1 } else { return -1 }
        });
    }
    //Дополнительные сценарии адаптации
    function customAdapt() {
        //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
}());
//dinamic-adaptive-end
////menu-burger
$('.menu-burger').on('click', function () {
    $(this).toggleClass('open');
    $('.header__main-content-downgroup').toggleClass('active');
    $('body').toggleClass('lock');
})


window.onscroll = function () { myFunction() };
var header = document.getElementById("Header");
var sticky = header.offsetTop;
const heightSticky = header.clientHeight;

function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        if ($("div").is(".first-section")) {
            $('#first-section').css({ 'padding-top': heightSticky + 'px' });
        }
        else {
            $('#wrapper').css({ 'padding-top': heightSticky + 'px' });
        }

    } else {
        header.classList.remove("sticky");
        $('#first-section').removeAttr('style');
        $('#wrapper').removeAttr('style');
    }
}

const cars = new Swiper('.cars .swiper-container', {
    loop: true,
    speed: 400,
    spaceBetween: 50,
    navigation: {
      nextEl: '.cars__arrow_next',
      prevEl: '.cars__arrow_prev',
    },
  });
  
  document.querySelectorAll('.work__button:nth-child(1)').forEach(button=>button.onclick=()=>cars.slidePrev())
  document.querySelectorAll('.work__button:nth-child(2)').forEach(button=>button.onclick=()=>cars.slideNext())