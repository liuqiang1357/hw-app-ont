# Ledger javascript API for ONT and NEO

## Usage

```javascript
import Transport from "@ledgerhq/hw-transport-node-hid";
import App from "@ont-dev/hw-app-ont";
import { Crypto, Transaction } from 'ontology-ts-sdk';

(async function run() {
  const transport = await Transport.create();
  transport.setExchangeTimeout(15000);
  const app = new App(transport);

  const ledgerPath = "44'/1024'/0'/0/0";

  const publicKey = app.getPublicKey(ledgerPath);
  console.log(publicKey);

  const ontTransaction = Transaction.deserialize('0123456789abcdef....');
  const result = await this.app.signMessage(ledgerPath, ontTransaction.serializeUnsignedData());
  const signature = new Crypto.Signature(
    Crypto.SignatureScheme.ECDSAwithSHA256,
    result,
  ).serializeHex();
  console.log(signature);
})();

```
