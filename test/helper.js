var expectations = 0,
    fulfilled = 0;

function expect (num) {
    num = num || 1;
    expectations = expectations + num;
}
function fulfill () {
    fulfilled++;
}

process.on('exit', function () {
    if (expectations > fulfilled) {
        throw new Error((expectations - fulfilled) + ' expectations not met.');
    }

    console.log("All %s expectations met.", expectations);
});
