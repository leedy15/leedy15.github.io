(function () {

    /* About Scroll Reveal */
            sr.reveal('.intro', {
                duration: 3000,
                origin: 'top',
                distance: '150px'
            });
            sr.reveal('#cardbottom', {
                duration: 5000,
                origin: 'bottom',
                distance: '200px'
            });
            sr.reveal('#cardleft', {
                duration: 5000,
                origin: 'left',
                distance: '1000px'
            });
            sr.reveal('#cardright', {
                duration: 5000,
                origin: 'right',
                distance: '1000px'
            });
            sr.reveal('.scroll-to-next', {
                duration: 5000,
                origin: 'left',
                distance: '1000px'
            });

})();
