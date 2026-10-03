/* =====================================================
   STOPWATCH VARIABLES
===================================================== */

let startTime = 0;

let elapsedTime = 0;

let timer = null;

let laps = [];

let lastLapTime = 0;


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const display =
    document.getElementById("display");

const startButton =
    document.getElementById("start");

const lapButton =
    document.getElementById("lap");

const resetButton =
    document.getElementById("reset");

const status =
    document.getElementById("status");

const statusText =
    document.getElementById("status-text");

const lapsContainer =
    document.getElementById("laps");

const lapCount =
    document.getElementById("lap-count");

const totalTime =
    document.getElementById("total-time");

const totalLaps =
    document.getElementById("total-laps");

const fastestLap =
    document.getElementById("fastest-lap");

const averageLap =
    document.getElementById("average-lap");


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(milliseconds) {

    const totalCentiseconds =
        Math.floor(milliseconds / 10);

    const centiseconds =
        totalCentiseconds % 100;

    const totalSeconds =
        Math.floor(totalCentiseconds / 100);

    const seconds =
        totalSeconds % 60;

    const totalMinutes =
        Math.floor(totalSeconds / 60);

    const minutes =
        totalMinutes % 60;

    const hours =
        Math.floor(totalMinutes / 60);


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(centiseconds).padStart(2, "0")
    );
}


/* =====================================================
   FORMAT SHORT TIME
===================================================== */

function formatShortTime(milliseconds) {

    const totalSeconds =
        Math.floor(milliseconds / 1000);

    const seconds =
        totalSeconds % 60;

    const totalMinutes =
        Math.floor(totalSeconds / 60);

    const minutes =
        totalMinutes % 60;

    const hours =
        Math.floor(totalMinutes / 60);


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}


/* =====================================================
   UPDATE DISPLAY
===================================================== */

function updateDisplay() {

    if (timer !== null) {

        elapsedTime =
            Date.now() - startTime;

    }


    display.textContent =
        formatTime(elapsedTime);

    totalTime.textContent =
        formatShortTime(elapsedTime);

}


/* =====================================================
   START STOPWATCH
===================================================== */

function startStopwatch() {

    if (timer === null) {

        startTime =
            Date.now() - elapsedTime;


        timer =
            setInterval(
                updateDisplay,
                10
            );


        startButton.textContent =
            "PAUSE";


        statusText.textContent =
            "RUNNING";


        status.classList.add(
            "running"
        );

        status.classList.remove(
            "paused"
        );

        lapButton.disabled = false;

    }

}


/* =====================================================
   PAUSE STOPWATCH
===================================================== */

function pauseStopwatch() {

    if (timer !== null) {

        elapsedTime =
            Date.now() - startTime;


        clearInterval(timer);

        timer = null;


        updateDisplay();


        startButton.textContent =
            "RESUME";


        statusText.textContent =
            "PAUSED";


        status.classList.remove(
            "running"
        );

        status.classList.add(
            "paused"
        );

    }

}


/* =====================================================
   START / PAUSE BUTTON
===================================================== */

startButton.addEventListener(
    "click",
    function () {

        if (timer === null) {

            startStopwatch();

        } else {

            pauseStopwatch();

        }

    }
);


/* =====================================================
   RECORD LAP
===================================================== */

function recordLap() {

    if (elapsedTime <= 0) {

        return;

    }


    /*
       Calculate the current lap duration.
       Example:

       Lap 1 total = 5 seconds
       Lap 2 total = 12 seconds

       Lap 2 duration = 12 - 5
                      = 7 seconds
    */

    const lapDuration =
        elapsedTime - lastLapTime;


    const lap = {

        number: laps.length + 1,

        total: elapsedTime,

        duration: lapDuration

    };


    laps.push(lap);


    lastLapTime =
        elapsedTime;


    displayLaps();

    updateStatistics();

}


/* =====================================================
   LAP BUTTON
===================================================== */

lapButton.addEventListener(
    "click",
    recordLap
);


/* =====================================================
   DISPLAY LAP HISTORY
===================================================== */

function displayLaps() {

    lapsContainer.innerHTML = "";


    if (laps.length === 0) {

        lapsContainer.innerHTML = `
            <div class="empty-state">
                No laps recorded yet
            </div>
        `;

        return;

    }


    /*
       Reverse the array so the
       latest lap appears first.
    */

    const reversedLaps =
        [...laps].reverse();


    reversedLaps.forEach(
        function (lap) {

            const row =
                document.createElement("div");


            row.className =
                "lap-row";


            row.innerHTML = `

                <span class="lap-number">
                    LAP ${lap.number}
                </span>

                <span class="lap-total">
                    ${formatTime(lap.total)}
                </span>

                <span class="lap-duration">
                    ${formatTime(lap.duration)}
                </span>

            `;


            lapsContainer.appendChild(row);

        }
    );


    lapCount.textContent =
        `${laps.length} ${
            laps.length === 1
                ? "LAP"
                : "LAPS"
        }`;

}


/* =====================================================
   UPDATE STATISTICS
===================================================== */

function updateStatistics() {

    totalLaps.textContent =
        laps.length;


    if (laps.length === 0) {

        fastestLap.textContent =
            "--";

        averageLap.textContent =
            "--";

        return;

    }


    /* Find fastest lap */

    const fastest =
        Math.min(
            ...laps.map(
                lap => lap.duration
            )
        );


    fastestLap.textContent =
        formatTime(fastest);


    /* Calculate average */

    const totalLapDuration =
        laps.reduce(
            function (sum, lap) {

                return sum + lap.duration;

            },
            0
        );


    const average =
        totalLapDuration /
        laps.length;


    averageLap.textContent =
        formatTime(average);

}


/* =====================================================
   RESET STOPWATCH
===================================================== */

function resetStopwatch() {

    clearInterval(timer);

    timer = null;

    startTime = 0;

    elapsedTime = 0;

    laps = [];

    lastLapTime = 0;


    updateDisplay();

    displayLaps();

    updateStatistics();


    startButton.textContent =
        "START";


    statusText.textContent =
        "READY";


    status.classList.remove(
        "running"
    );

    status.classList.remove(
        "paused"
    );

    lapButton.disabled = true;

}


/* =====================================================
   RESET BUTTON
===================================================== */

resetButton.addEventListener(
    "click",
    resetStopwatch
);


/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {


        /* SPACE → Start / Pause */

        if (event.code === "Space") {

            event.preventDefault();

            if (timer === null) {

                startStopwatch();

            } else {

                pauseStopwatch();

            }

        }


        /* L → Lap */

        if (
            event.key.toLowerCase() === "l"
        ) {

            recordLap();

        }


        /* R → Reset */

        if (
            event.key.toLowerCase() === "r"
        ) {

            resetStopwatch();

        }

    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

lapButton.disabled = true;

updateDisplay();

displayLaps();

updateStatistics();