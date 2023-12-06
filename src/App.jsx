import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import mintTokenAbi from "./mintTokenAbi.json";
import Web3 from "web3";
// In Node.js use: const Web3 = require('web3'); / common JS 를 React에 맞게 변경함
import "animate.css";
import TokenCard from "./components/TokenCard";
import contractAddress from "./contractAddress.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  // set provider for all later instances to use
  //Contract.setProvider('ws://localhost:8546'); 를 react로 변경
  const { sdk, provider } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setContract(
      new web3.eth.Contract(
        mintTokenAbi,
        "0xBa164456466F8c59a09e98aA6e6b0cE91A8F77B5"
      )
    );
  }, [web3]);
  // new Contract(jsonInterface, address);의 형태 , jsonInterface의 경우 솔리디티의 데이터를 필요로 하기에 별도의 후처리가 필요 ABI를 통해 JS에서도 쓸 수 있도록 만들어줌

  useEffect(() => console.log(contract), [contract]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-yellow-100 20% via-orange-100 50% to-orange-200 70% ">
      {account ? (
        <>
          <div className="text-orange-500 text-4xl font-bold mt-4">
            Welcome, {account.substring(0, 7)}...
            {account.substring(account.length - 5)}
          </div>
          {contractAddress.map((v, i) => (
            <TokenCard
              key={i}
              account={account}
              web3={web3}
              address={v.address}
              owner={v.owner}
              walletAccount={v.walletAccount}
            />
          ))}
          <button
            className="mt-6 bg-orange-500 text-white text-xl font-bold hover:bg-orange-500 active:bg-orange-700 shadow-lg px-4 py-2 rounded-2xl animate__animated animate__tada"
            onClick={() => setAccount("")}
          >
            🦊 MetaMask Logout
          </button>
        </>
      ) : (
        <button
          className="mt-6 bg-orange-500 text-white text-xl font-bold hover:bg-orange-500 active:bg-orange-700 shadow-lg px-4 py-2 rounded-2xl animate__animated animate__tada"
          onClick={onClickMetaMask}
        >
          🦊 MetaMask Login
        </button>
      )}
    </div>
  );
};

export default App;

// className="bg-orange-500 text-white text-xl font-bold hover:bg-orange-500 active:bg-orange-700 shadow-lg px-4 py-2 rounded-2xl animate__animated animate__tada"
