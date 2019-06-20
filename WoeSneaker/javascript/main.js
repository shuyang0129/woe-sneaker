/////////////////////////////////////////////////
// Variable
/////////////////////////////////////////////////

var btnGoTop = document.getElementById('btn__go-to-top'),
    btnExpand = document.querySelector('.btn__expand'),
    navBar = document.getElementById('navbar'),
    header = document.querySelector('.home#header'),
    slideGalleryThumbnail = document.querySelectorAll('.slideshow-gallery__thumbnail-item'),
    slideGalleryImg = document.querySelectorAll('.slideshow-gallery__slide > img'),
    tabLink = document.querySelectorAll('.customized-tab-link'),
    tabContent = document.querySelectorAll('.customized-tab-item__content'),
    slide = document.querySelectorAll('.slide'),
    slideDot = document.querySelectorAll('.slideshow-indicators__dot'),
    btnNext = document.querySelector('.btn__view-next'),
    btnPrev = document.querySelector('.btn__view-prev'),
    latestList = document.querySelector('.new-latest-list'),
    latestItem = document.querySelector('.new-latest-item');

var currentSlideIndex = 0,
    autoSlideInterval = null,
    autoSildeDuration = 5000,
    currentIndex = 0;

var isBtnGoUpShow = false,
    isMainNavOpen = false;

/////////////////////////////////////////////////
// Event
/////////////////////////////////////////////////

window.addEventListener('load', function (e) {
    toggleBtnGoTop();
    toggleHeader();
    if (slide.length > 0 && slideDot.length > 0) {
        playAutoSlide();
    }
    if (btnNext) {        
        btnNext.addEventListener('click', function() {
            TweenMax
            .to(latestList, 1, {
                scrollLeft: function(index, target) {
                    return target.scrollLeft + latestItem.clientWidth;
                }
            });
        });
    }
    if (btnPrev) {
        btnPrev.addEventListener('click', function() {
            TweenMax
            .to(latestList, 1, {
                scrollLeft: function(index, target) {
                    return target.scrollLeft - latestItem.clientWidth;
                }
            });
        });
    }
});

window.addEventListener('scroll', function (e) {
    toggleBtnGoTop();
    toggleHeader();
});

window.addEventListener('click', function (e) {
    if (e.target !== btnExpand && e.target !== this.document.querySelector('.btn__expand i') && isMainNavOpen) {
        btnExpand.classList.remove('is-active');
    }
});

window.addEventListener('touchend', function (e) {
    if (e.target[0] !== btnExpand && e.target[0] !== this.document.querySelector('.btn__expand i') && isMainNavOpen) {
        btnExpand.classList.remove('is-active');
    }
});

btnGoTop.addEventListener('click', function () {
    scrollToTop();
});

btnExpand.addEventListener('click', function() {
    btnExpand.classList.toggle('is-active');
    isMainNavOpen = true;
});


for (let index = 0; index < slideGalleryThumbnail.length; index++) {
    slideGalleryThumbnail[index].addEventListener('click', function () {
        //Remove active statement of thumbnail
        document.querySelector('.slideshow-gallery__thumbnail-item.is-active').classList.remove('is-active');
        //Remove show statement of slideshow gallery's slide
        document.querySelector('.slideshow-gallery__slide > img.is-show').classList.remove('is-show');
        //Active the thumnail
        slideGalleryThumbnail[index].classList.add('is-active');
        //Show the image
        slideGalleryImg[index].classList.add('is-show');
    });
}

for (let index = 0; index < tabLink.length; index++) {
    tabLink[index].addEventListener('click', function (e) {
        //Remove active statement of tab link
        document.querySelector('.customized-tab-link.is-active').classList.remove('is-active');
        //Remove show statement of tab content
        document.querySelector('.customized-tab-item__content.is-show').classList.remove('is-show');
        //Active the tab link
        tabLink[index].classList.add('is-active');
        //Show the tab content
        tabContent[index].classList.add('is-show');
    });
}

for (let i = 0; i < slideDot.length; i++) {
    slideDot[i].addEventListener('click', function() {
        if (i !== currentIndex) {            
            var nextIndex = i > slideDot.length ? 0 : i;
            stopAutoSlide();
            goToSlide(nextIndex);
            playAutoSlide();
        }
    });
}

/////////////////////////////////////////////////
// Function
/////////////////////////////////////////////////

//Function - Toggle go-top-button
function toggleBtnGoTop() {
    if (this.document.body.scrollTop > 800 || this.document.documentElement.scrollTop > 800) {
        btnGoTop.classList.add('is-show');
    } else {
        btnGoTop.classList.remove('is-show');
    }
}

//Function - Toggle header background style
function toggleHeader() {
    if (header) {
        if (this.document.body.scrollTop > 30 || this.document.documentElement.scrollTop > 30) {
            header.classList.add('is-active');
        } else {
            header.classList.remove('is-active');
        }
    }
}

//Function - Back to top of the page
function scrollToTop() {
    if( document.body.scrollTop > 0 || document.documentElement.scrollTop > 0 ) {
        TweenMax.to(document.documentElement, 0.5, { 
            scrollTop: 0,
            ease: Power3.easeOut
        });
        TweenMax.to(document.body, 0.5, { 
            scrollTop: 0,
            ease: Power3.easeOut
        });
    }
}

//Function - Set interval for slideshow
function playAutoSlide(index, duration) {
    autoSlideInterval =this.setInterval(function() {
        if (currentIndex + 1 > slide.length) {                
            goToSlide(0);
        } else {
            goToSlide(currentIndex + 1);
        }
    }, 5000)
}

//Function - Stop auto slide animation
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlide = null;
}

//Function - Go to target slide
function goToSlide(nIndex) {
    nIndex = nIndex < slide.length ? nIndex : 0;
    var currentSlide = slide[currentIndex];
    var nextSlide    = slide[nIndex];
    var tl           = new TimelineLite();
    slideDot[currentIndex].classList.remove('is-active');
    slideDot[nIndex].classList.add('is-active');
    
    tl
    .set(nextSlide, {
        className: '+=is-show',
        zIndex: 21,
    })
    .fromTo(nextSlide, 1,{
        left: nIndex < currentIndex ? "-100%" : '+100%'
    }, {
        left: '0%',
        ease: Power4.easeOut,
        onComplete: function() {
            currentSlide.classList.remove('is-show');
            nextSlide.style.zIndex = 20;
            currentIndex = nIndex;
        }
    })
    .staggerFrom(document.querySelectorAll(`#slide-${nIndex + 1} .slide-content-item`), 0.8, {
        alpha: 0,
        y: '100%',
        ease: Power0.easeNone
    }, 0.5)
}