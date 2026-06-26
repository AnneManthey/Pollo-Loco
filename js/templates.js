
function getDialogWonTemplate() {
    return /*html*/ `
        <section >
            <div>
                <h2 Congratulations!></h2>
                <h3>Your Score</h2>
                <p></p>
            </div>
            <div>
                <button onclick="location.reload();">Play Again</button>
                <button><a href="index.html">Back</a></button>
            </div>
        </section>
    `
};

function getDialogLostTemplate() {
    return /*html*/ `
        <section>
            <div>
                <h2 You lost. Try again?></h2>
                <h3>Your Score</h2>
                <p></p>
            </div>
            <div>
                <button onclick="location.reload();">Play Again</button>
                <button><a href="index.html">Back</a></button>
            </div>
        </section>
    `
}

