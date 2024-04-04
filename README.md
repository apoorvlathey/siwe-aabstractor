# SIWE AAbstractor

**Link: [siwe.aabstr.actor](https://siwe.aabstr.actor/)**

UI to connect your Smart Accounts to dapps via SIWE (Sign-In With Ethereum).

Steps:

1. Connect to [siwe.aabstr.actor](https://siwe.aabstr.actor/) with EOA which controls the Smart Account.
2. Enter the address of your smart account.
3. Go to your dapp, select WalletConnect and copy the URI into the input field.
4. Press "Connect" button.
5. When the dapp sends signature request, press "Accept" and confirm in your Metamask or other connected wallet.\
   NOTE: Metamask might show a warning because the origin of the request is the dapp, but you are signing via this tool. It's safe (you may check the code in this repo) as you are not giving any approvals for the assets in your address.
6. The dapp should now be logged-in as your smart account.
