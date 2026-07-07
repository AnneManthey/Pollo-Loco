
function getDialogWonTemplate(score) {
    return /*html*/ `
        <section class="dialog-won">
            <div>
                <h2>Congratulations!</h2>
                <h3>Your Score</h3>
                <p>${score}</p>
            </div>
            <div class="dialog-button-wrapper">
                <button onclick="location.reload();">Play Again</button>
                <button><a href="index.html">Back</a></button>
            </div>
        </section>
    `;
}

function getDialogLostTemplate() {
    return /*html*/ `
        <section class="dialog-lost">
            <div class="dialog-button-wrapper">
                <button onclick="location.reload();">Play Again</button>
                <button><a href="index.html">Back</a></button>
            </div>
        </section>
    `;
}

