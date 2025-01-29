import axios from 'axios';

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


        case "show_securities": 
            axios.get('http://localhost:3000/api/get-all-securities')
                .then(response => {
                    if (!response.data || response.data.length === 0) {
                        console.log("No securities available.");
                    } else {
                        console.log("📊 Securities List:");
                        response.data.forEach(security => {
                            console.log(`- ${security.name} | Type: ${security.type} | Shares: ${security.shares} | Price: $${security.currentPrice || "N/A"}`);
                        });
                    }
                })
                .catch(error => {
                    console.error(`❌ Error: ${error.response?.data?.message || "An unexpected error occurred."}`);
                });
            break;

        case "help":
            console.log(`Available commands:
                            1. transaction <symbol> <amount>
                            2. show_securities
                            3. exit
                            `);
            break;

        case "exit":
            console.log("Exiting...");
            process.exit(0);

        default:
            console.log("Unknown command. Type 'help' for a list of commands.");
    }
};

