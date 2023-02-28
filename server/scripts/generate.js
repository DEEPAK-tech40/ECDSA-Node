const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const msg = "DeepakArulananthan";
async function main() {
  // const privateKey = secp.utils.randomPrivateKey();
  // console.log("Private key: " + toHex(privateKey));
  console.log(toHex(hash(msg)));
  const privateKey =
    "b7f37cdcabdb3588e23cd95a4a5e893f0ac66201c54b24fb30a809419e9f689a";

  const publicKey = secp.getPublicKey(privateKey);
  console.log("Public key: " + toHex(publicKey));

  const address = getAddress(publicKey);
  console.log("Address: " + toHex(address));

  const [sig, recBit] = await getSignature(msg);
  console.log("Signature: " + toHex(sig) + "; RecoveryBit: " + recBit);

  console.log(
    "PublicKey: " +
      toHex(
        secp.recoverPublicKey(
          toHex(hash(msg)),
          "304402206ebe61a820554329774368e92052d0b869d9fe2d7c8fcee54ae0e8cec2a287f0022045ba8bb2bae472b1e82099073650dc121a130aff80525909fcb7686e1337c212",
          1,
          false
        )
      )
  );

  function getAddress(publicKey) {
    let bytes = publicKey.slice(1);
    let byteHash = keccak256(bytes);
    bytes = byteHash.slice(byteHash.length - 20);
    return bytes;
  }

  async function getSignature(msg) {
    const hashMsg = hash(msg);
    const s = secp.sign(hashMsg, privateKey, { recovered: true });
    return s;
  }

  function hash(msg) {
    const bytes = utf8ToBytes(msg);
    const hashMsg = keccak256(bytes);
    return hashMsg;
  }
}

main();
