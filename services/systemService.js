const { exec } = require('child_process');


const execService = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Execution failed: ${error.message}`));
            }
            if (stderr) {
                return reject(new Error(`Error occurred: ${stderr}`));
            }
            resolve(stdout);
        });
    });
};

module.exports = { execService };