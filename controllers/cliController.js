import readline from 'readline';
import { executeCommand } from '../routes/cliRoutes.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const startCLI = () => {
    console.log("Welcome to Portfolio Manager CLI! Type 'help' for available commands.");
    
    rl.on("line", (input) => {
        executeCommand(input.trim());
    });
};

export { startCLI };


