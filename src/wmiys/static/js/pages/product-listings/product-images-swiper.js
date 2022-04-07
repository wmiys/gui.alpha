


export const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    // direction: 'horizontal',
    // // loop: true,
    // centeredSlides: true,
    slidesPerView: 1,
    // slidesPerView: "auto",
    cssMode: true,

    breakpoints: {
        // 320: {
        //     slidesPerView: 2,
        //     // spaceBetween: 20
        // },
        // // when window width is >= 480px
        // 480: {
        //     slidesPerView: 3,
        //     // spaceBetween: 30
        // },
        // when window width is >= 640px
        768: {
            slidesPerView: 3,
            // spaceBetween: 40
        },

        992: {
            slidesPerView: 4,
        },
    },


    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});