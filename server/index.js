const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const msg = "DeepakArulananthan";

app.use(cors());
app.use(express.json());

const balances = {
  //Private:b7f37cdcabdb3588e23cd95a4a5e893f0ac66201c54b24fb30a809419e9f689a
  //Public:047b232c3cbb75ae4537ddbd2daf99adc611f762ace1824bbc95333ba9d65e6042f0fb73092a6f26251ca33d0974100a91897ba07c4b86d164dbebdb442e464527
  //Address:55a303ab2e0d6497dd8c6585ae103cd2d24956ac
  //Signature:304402206ebe61a820554329774368e92052d0b869d9fe2d7c8fcee54ae0e8cec2a287f0022045ba8bb2bae472b1e82099073650dc121a130aff80525909fcb7686e1337c212,1
  "55a303ab2e0d6497dd8c6585ae103cd2d24956ac": 100,

  //Private:7c30da1038152416f58f4e02a49afb37ab132da6c9d8a619615dc4c86b6af165
  //Public:04e73611a9625b0937152dcbb83ed82a19cac8d0e5462500ccc7f8bd749fe63c01c9cafef24031a3f661878b449555018b5b119b9d4063eb7a5b9620414bd7f45d
  //Address:275113e2e3d9fd95c6b92b02f978db712246d626
  //Signature:3045022100fccc94630daddc95ebd10c41a99d5cedd7c9b33d1c581b40a1f004a9a03904a40220073b9e72e78b1e19c28cc5fc5848feccff4416b8d549f1cc401718f9803e2089,0
  "275113e2e3d9fd95c6b92b02f978db712246d626": 50,

  //Private:2552d337b296aae1c9048b0bd860fd1f624c768a6d477636611c7d6125d66537
  //Public:0490dbc43329da315ca666b36266dd1a6aaa5de8a927e6714789cd812ebf726161001240538ddf49c56d0844be9ed71300b3344bef696b1fbaeaf2f139ebebf7c4
  //Address:9b6d3483d87b5c560f11a0b05963ef1bcc96af31
  //Signature:304502210097d2fd8598bd78298927af7b455dee142ca528524c31b99ea57bf6589a8eab1a022018adac6a784364001dc5e74504d47775bcce8ad10a847a560d92ac881cfaf834,1
  "9b6d3483d87b5c560f11a0b05963ef1bcc96af31": 75,
};

app.get("/balance/:signature", (req, res) => {
  const { signature } = req.params;
  const address = toHex(getAddress(signature));
  const balance = balances[address] || 0;
  res.send({ balance, address });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getPublicKey(signature) {
  const sign = signature.split(",");
  const publicKey = secp.recoverPublicKey(
    hash(msg),
    sign[0],
    parseInt(sign[1]),
    false
  );
  return publicKey;
}

function getAddress(signature) {
  const publicKey = getPublicKey(signature);
  let bytes = publicKey.slice(1);
  const byteHash = keccak256(bytes);
  bytes = byteHash.slice(byteHash.length - 20);
  return bytes;
}

function hash(msg) {
  const bytes = utf8ToBytes(msg);
  const hashMsg = keccak256(bytes);
  return hashMsg;
}
