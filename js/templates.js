
function getDialogWonTemplate(score) {
    return /*html*/ `
        <section class="dialog-won">
            <div>
                <p>Your Score: <span style="color: red; font-size: 2.2rem;"> ${score}</span></p>
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

