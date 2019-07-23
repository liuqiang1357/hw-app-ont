# Ledger javascript API for ONT and NEO

## Usage

```javascript
import Transport from "@ledgerhq/hw-transport-node-hid";
import App from "@ont-dev/hw-app-ont";
import * as elliptic from 'elliptic';
import { Crypto, Transaction } from 'ontology-ts-sdk';

(async function run() {
  const ledgerPath = "44'/1024'/0'/0/0";
  const transactionHex = '0123456789abcdef....';

  const transport = await Transport.create();
  transport.setExchangeTimeout(15000);
  const app = new App(transport);

  const uncompressedPublicKey = await app.getPublicKey(ledgerPath);
  console.log(uncompressedPublicKey);
  const ec = new elliptic.ec(Crypto.CurveLabel.SECP256R1.preset);
  const keyPair = ec.keyFromPublic(uncompressedPublicKey, 'hex');
  const compressedPublicKey = keyPair.getPublic(true, 'hex');
  console.log(compressedPublicKey);
  const ontPublicKey = new Crypto.PublicKey(compressedPublicKey);
  const ontAddress = Crypto.Address.fromPubKey(ontPublicKey);
  const addressBase58 = ontAddress.toBase58();
  console.log(addressBase58);

  const ontTransaction = Transaction.deserialize(transactionHex);
  const unsignedData = ontTransaction.serializeUnsignedData();
  const result = await this.app.signMessage(ledgerPath, unsignedData);
  const ontSignature = new Crypto.Signature(Crypto.SignatureScheme.ECDSAwithSHA256, result);
  const signatureHex = ontSignature.serializeHex();
  console.log(signatureHex);
})();
```
