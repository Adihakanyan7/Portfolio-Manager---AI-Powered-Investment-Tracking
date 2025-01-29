import axios from 'axios';
import { createTransaction } from "../controllers/transactionController.js";

export const executeCommand = (input) => {
    const args = input.split(" ");
    const command = args[0]?.toLowerCase();
    args[2] = parseInt(args[2], 10);

    switch (command) {
        case "transaction":
            if (args.length < 3 || typeof args[1] !== 'string' || isNaN(parseInt(args[2]))) {
                return console.log("Usage: Transaction <symbol: string> <amount: number>");
            }
            axios.post('http://localhost:3000/api/transactions', { stockName: args[1], quantity: args[2] })
                .then(response => {
                    if (response.data && response.data.message) {
                        console.log(response.data.message);
                    } else {
                        console.log("✅ Transaction completed successfully.");
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.error) {
                        console.error(`Error: ${error.response.data.error}`);
                    } else {
                        console.error("An unexpected error occurred.");
                    }
                });
            break;

        case "help":
            console.log(`Available commands:
                            1. transaction <symbol> <amount>
                            6. exit
                            `);
            break;

        case "exit":
            console.log("Exiting...");
            process.exit(0);

        default:
            console.log("Unknown command. Type 'help' for a list of commands.");
    }
};

