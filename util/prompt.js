export function prompt(question) {
    const stdin = process.stdin;
    const stdout = process.stdout;
    return new Promise(resolve => {
        stdout.write(question);
        stdin.resume();
        stdin.once("data", (data) => {
            stdin.pause();
            resolve(data.toString().trim());
        });
    });
}