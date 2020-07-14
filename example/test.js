import Transport from "@ledgerhq/hw-transport-node-hid";
import App from "@ont-dev/hw-app-ont";
import * as elliptic from 'elliptic';
import { Crypto } from 'ontology-ts-sdk';

async function test() {
  const path = "44'/1024'/0'/0/0";
  const hash = '7bc067238eab7ce5873a33b7e35f25681099f687caf6db86ad596a28d8e7c451';

  const transport = await Transport.create();
  const app = new App(transport);

  const uncompressedPublicKey = await app.getPublicKey(path);
  console.log(uncompressedPublicKey);

  const ec = new elliptic.ec(Crypto.CurveLabel.SECP256R1.preset);
  const keyPair = ec.keyFromPublic(uncompressedPublicKey, 'hex');
  const compressedPublicKey = keyPair.getPublic(true, 'hex');
  console.log(compressedPublicKey);

  const ontPublicKey = new Crypto.PublicKey(compressedPublicKey);
  const ontAddress = Crypto.Address.fromPubKey(ontPublicKey);
  const ontAddressBase58 = ontAddress.toBase58();
  console.log(ontAddressBase58);

  const signature = await app.signMessage(path, hash);
  console.log(signature);

  const ontSignature = new Crypto.Signature(Crypto.SignatureScheme.ECDSAwithSHA256, signature);
  const ontSignatureHex = ontSignature.serializeHex();
  console.log(ontSignatureHex);
}

test().catch(console.error);