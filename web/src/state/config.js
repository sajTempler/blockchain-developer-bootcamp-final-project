// be vary
// address is different in contracts/build SimpleStorage.json
// than address in CLI from truffle

export const CONTRACT_MAP = {
  SimpleStorage: {
    address: "0x070c925033e523043Df697DB17f0766C5b83a550",
    abi: [
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "x",
            "type": "uint256"
          }
        ],
        "name": "store",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "retrieve",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
}
