// function fadeOut(content) {
//     console.log('fade out');
//     alpha -= delta;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     ctx.globalAlpha = alpha;
//     content();
//     if (alpha > 0) {
//         requestAnimationFrame(fadeOut.bind(this, content));
//     }
//     else {
//         alpha = 1;
//         ctx.globalAlpha = alpha;
//     }
// }

// function fadeIn(content) {
//     console.log('fade in');
//     alpha += delta;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     ctx.globalAlpha = alpha;
//     content();

//     if (alpha < 1) {
//         requestAnimationFrame(fadeIn.bind(this, content));
//     }
//     else {
//         alpha = 1;
//         ctx.globalAlpha = alpha;
//     }
// }

// requestAnimationFrame(fadeOut.bind(this, drawMap.bind(this, MAP1)));
// requestAnimationFrame(fadeIn.bind(this, drawMap.bind(this, MAP1)));


function animateInterpolationSequence (callback, ...sequence) {
    if (sequence.length == 0) {
        return null;
    }

    // this script supports 10 microseconds of precision without rounding errors
    let animationTimeStart = Math.floor(performance.now() * 100);
    let timeStart = animationTimeStart;
    let duration = 0;
    let easing;
    let valueStart;
    let valueEnd = sequence[0].start;
    let nextId = 0;
    let looped = (typeof sequence[sequence.length - 1].end != 'number');
    let alive = true;
    let rafRequestId = null;

    // callback of requestAnimationFrame
    function update (time) {

        time = (rafRequestId == null)
            ? animationTimeStart
            : Math.floor(time * 100);

        // iterate over finished sequence items
        while (time - timeStart >= duration) {

            if (sequence.length > nextId) {
                // proceed to the next item
                let currentItem = sequence[nextId++];
                let action =
                    (sequence.length > nextId)
                        ? 'continue':
                    (looped)
                        ? 'looping'
                        : 'finishing';
                if (action == 'looping') {
                    nextId = 0;
                }
                timeStart += duration;
                duration = Math.floor(currentItem.duration * 100);
                easing = (typeof currentItem.easing == 'function')? currentItem.easing: null;
                valueStart = valueEnd;
                valueEnd = (action == 'finishing')? currentItem.end: sequence[nextId].start;
            }

            else {
                // the animation is finished
                safeCall(() => callback((time - animationTimeStart) / 100, valueEnd, true));
                return;
            }
        }

        // interpolation math
        let x = (time - timeStart) / duration;
        if (easing) {
            x = safeCall(() => easing(x), x);
        }
        let value = valueStart + (valueEnd - valueStart) * x;

        // continue the animation
        safeCall(() => callback((time - animationTimeStart) / 100, value, false));
        if (alive) {
            rafRequestId = window.requestAnimationFrame(update);
        }
    }

    // exceptions are our friends
    // if they have to say something, we'll give them the opportunity
    function safeCall (callback, defaultResult) {
        try {
            return callback();
        }
        catch (e) {
            window.setTimeout(() => { throw e; });
            return defaultResult;
        }
    }

    update();
    return function stopAnimation () {
        window.cancelAnimationFrame(rafRequestId);
        alive = false;
    };
}

function renderStar (alpha, rotation, corners, density) {

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.save();

    // erase
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw checkerboard
    ctx.fillStyle = 'rgba(0, 0, 0, .2)';
    let gridSize = 20;
    for (let y = 0; y * gridSize < canvas.height; y++) {
        for (let x = 0; x * gridSize < canvas.width; x++) {
            if ((y + x + 1) & 1) {
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }

    // star: geometry math
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = Math.min(centerX, centerY) * 0.9;
    function getCornerCoords (corner) {
        let angle = rotation + (Math.PI * 2 * corner / corners);
        return [
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        ];
    }

    // star: build path
    ctx.beginPath();
    ctx.moveTo(...getCornerCoords(0));
    for (let i = density; i != 0; i = (i + density) % corners) {
        ctx.lineTo(...getCornerCoords(i));
    }
    ctx.closePath();

    // star: draw
    ctx.shadowColor = 'rgba(0, 0, 0, .5)';
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 5;
    ctx.fillStyle = `rgba(255, 220, 100, ${alpha})`;
    ctx.fill();
    ctx.restore();
}

// quintic easing
function easeOutQuint (x) {
    return 1 - Math.pow(1 - x, 5);
}

// the demo
animateInterpolationSequence(
    (time, value, finished) => {
        renderStar(value, Date.now() / 1000, 5, 2);
    },

    { start: 1, duration: 2000 }, // 0 to 2 sec: opaque

    { start: 1, duration: 500  }, // 2 to 3 sec: linear fade-out + fade-in
    { start: 0, duration: 500  },
    { start: 1, duration: 500  }, // 3 to 4 sec: again
    { start: 0, duration: 500  },

    { start: 1, duration: 2000 }, // 4 to 6 sec: opaque

    { start: 1, duration: 500,    // 6 to 7 sec: fade-out + fade-in
      easing: easeOutQuint     }, //             with custom easing
    { start: 0, duration: 500,
      easing: easeOutQuint     },
    { start: 1, duration: 500,    // 7 to 8 sec: again
      easing: easeOutQuint     },
    { start: 0, duration: 500,
      easing: easeOutQuint     },

    { start: 1, duration: 2000 }, // 8 to 10 sec: opaque
    { start: 1, duration: 0    }, // instant switch ahead

    ...((delay, times) => {       // 10 to 11 sec: flicker
        let items = [
            { start: .75, duration: delay }, // wait
            { start: .75, duration: 0     }, // instant switch .75 -> .25
            { start: .25, duration: delay }, // wait
            { start: .25, duration: 0     }  // instant switch .25 -> .75
        ];
        while (--times) {
            items.push(items[0], items[1], items[2], items[3]);
        }
        return items;
    })(50, 20)
);
