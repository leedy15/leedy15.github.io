﻿

(function () {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true,
        compressionfactorh, compressionfactorw, mainb;

    $(window).resize(function () {
        resize();
    })

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth - (window.innerWidth * .02);
        height = (window.innerHeight + 800);
        target = { x: width / 2, y: height / 2 };

        largeHeader = document.getElementById('node-background');

        canvas = document.getElementById('moving-nodes');
        mainb = document.getElementsByClassName('mainbackground')[0];
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        compressionfactorw = width / 250;
        compressionfactorh = height / 250;
        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / (6 * compressionfactorw)) {
            for (var y = 0; y < height; y = y + height / (30)) {
                var px = x + Math.random() * width / 20;
                var py = y + Math.random() * height / 8;
                var p = { x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 6 closest points
        for (var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if (!(p1 == p2)) {
                    var placed = false;
                    for (var k = 0; k < 6; k++) {
                        if (!placed) {
                            if (closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for (var k = 0; k < 6; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for (var i in points) {
            var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(250, 250, 250, 0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        initHeader();
    }

    // animation
    function initAnimation() {
        animate();
        for (var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height + 500);
            for (var i in points) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 99999999999999) {
                    points[i].active = 0.2;
                    points[i].circle.active = 10.6;
                } else if (Math.abs(getDistance(target, points[i])) < 20) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if (Math.abs(getDistance(target, points[i])) < 0) {
                    points[i].active = 0;
                    points[i].circle.active = 2000.01;
                } else {
                    points[i].active = 10000;
                    points[i].circle.active = 1000;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
            x: p.originX - 0 + Math.random() * 10,
            y: p.originY - 0 + Math.random() * 15,
            ease: Circ.easeInOut,
            onComplete: function () {
                shiftPoint(p);
            }
        });
    }

    // Canvas manipulation
    function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(250, 250, 250,' + p.active + ')';
            ctx.stroke();
        }
    }

    function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function () {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function () {
            if (!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(250, 250, 250,' + _this.active + ')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();

