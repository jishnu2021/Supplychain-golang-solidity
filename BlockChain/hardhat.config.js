// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// // You need to export an object to set up your config
// // Go to https://hardhat.org/config/ to learn more

// /**
//  * @type import('hardhat/config').HardhatUserConfig
//  */
// module.exports = {
//   solidity: {
//     version: "0.8.20",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
//   networks: {
//     // Development networks
//     hardhat: {
//       chainId: 31337,
//       // If you want to use hardhat with a forked network
//       // forking: {
//       //   url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
//       //   blockNumber: 14390000
//       // }
//     },
//     localhost: {
//       url: "http://127.0.0.1:8545",
//       chainId: 31337,
//     },
//     // Free testnets
//     sepolia: {
//       url: process.env.SEPOLIA_URL || `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//       chainId: 11155111,
//     },
//     holesky: {
//       url: process.env.HOLESKY_URL || "https://ethereum-holesky.publicnode.com",
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//       chainId: 17000,
//     },
//     // Polygon free testnet
//     mumbai: {
//       url: process.env.MUMBAI_URL || "https://rpc-mumbai.maticvigil.com",
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//       chainId: 80001,
//     },
//     // Base Goerli testnet
//     baseGoerli: {
//       url: "https://goerli.base.org",
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//       chainId: 84531,
//     },
//     // Optimism Goerli testnet
//     optimismGoerli: {
//       url: "https://goerli.optimism.io",
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//       chainId: 420,
//     }
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY
//   },
//   paths: {
//     sources: "./contracts",
//     tests: "./test",
//     cache: "./cache",
//     artifacts: "./artifacts"
//   },
//   gasReporter: {
//     enabled: process.env.REPORT_GAS !== undefined,
//     currency: "USD",
//     coinmarketcap: process.env.COINMARKETCAP_API_KEY,
//   }
// };


//1 .for localhost

// require("@nomicfoundation/hardhat-toolbox");

// module.exports = {
//   defaultNetwork: "localhost",
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545",
//       chainId: 31337, // Default chain ID used by Hardhat
//     },
//   },
//   solidity: {
//     version: "0.8.20",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200,
//       },
//     },
//   },
// };

//2 .for Holesky testnet

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    holesky: {
      url: "https://eth-holesky.g.alchemy.com/v2/AwRVKLSRwjQC-KsDK84kkpq4e-TlWodv", // or Infura/Alchemy Holesky URL
      chainId: 17000,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      holesky: process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api", // double-check if your key is for this endpoint
          browserURL: "https://holesky.etherscan.io",
        },
      },
    ],
  },
};
