$(document).ready(function() {
    let imgItems = $('.slider li').length;
    let imgPos = 1;
    let pause = 3000;

    let $slideShow = $('.slideshow');

    let interval;

    for (let i=0; i<imgItems; i++) {
        $('.pagination').append('<li><span class="fa fa-circle"></span></li>')
    }

    $('.slider li').hide();
    $('.slider li:first').show();
    $('.pagination li:first').css({'color': '#CD6E2E'});


    $('.pagination li').on('click', onPagClick);
    $('.right span').on('click', nextSlider);
    $('.left span').on('click', prevSlider);

    function startSlider() {
        interval = setInterval(nextSlider, pause);
    }

    function pauseSlider() {
        clearInterval(interval);
    }

    $slideShow.on('mouseenter', pauseSlider);
    $slideShow.on('mouseleave', startSlider);

    function onPagClick() {
        let paginationPos = $(this).index() + 1;

        $('.slider li').hide();
        $('.slider li:nth-child('+paginationPos+')').fadeIn();
        imgPos = paginationPos;

        $('.pagination li').css({'color': '#858585'})
        $(this).css({'color': '#CD6E2E'});
    }

    function nextSlider() {
        imgPos += 1;
        imgPos = (imgPos > imgItems) ? 1 : imgPos;

        $('.pagination li').css({'color': '#858585'});
        $('.pagination li:nth-child('+imgPos+')').css({'color': '#CD6E2E'});
                
        $('.slider li').hide();
        $('.slider li:nth-child('+imgPos+')').fadeIn();
    }

    function prevSlider() {
        imgPos -= 1;
        imgPos = (imgPos < 1) ? imgItems : imgPos;

        $('.pagination li').css({'color': '#858585'});
        $('.pagination li:nth-child('+imgPos+')').css({'color': '#CD6E2E'});
                
        $('.slider li').hide();
        $('.slider li:nth-child('+imgPos+')').fadeIn();
    }

    startSlider();



});