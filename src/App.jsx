import { useSDK } from "@metamask/sdk-react";

const App = () => {
  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      console.log(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-red-100 min-h-screen flex flex-col justify-center items-center">
      <button onClick={onClickMetaMask}>🦊 MetaMask Login</button>
    </div>
  );
};

export default App;
