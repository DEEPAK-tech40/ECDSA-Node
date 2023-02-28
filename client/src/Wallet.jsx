import server from "./server";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  signature,
  setSignature,
}) {
  async function onChange(evt) {
    const signature = evt.target.value;
    setSignature(signature);

    if (signature) {
      const {
        data: { balance, address },
      } = await server.get(`balance/${signature}`);
      setBalance(balance);
      setAddress(address);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Signature
        <input
          placeholder="Enter your signature"
          value={signature}
          onChange={onChange}
        ></input>
      </label>
      <div>Address: {address.slice(0, 10)}...</div>
      {/* <div>{console.log()}</div> */}
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
