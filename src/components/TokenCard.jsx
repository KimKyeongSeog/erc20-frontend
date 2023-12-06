import { useEffect, useState } from "react";
import mintTokenAbi from "../mintTokenAbi.json";
import "animate.css";
import contractAddress from "../contractAddress.json";
import OptionCard from "./OptionCard";

const TokenCard = ({ account, web3, address, owner, walletAccount }) => {
  const [name, setName] = useState("TOKEN");
  const [symbol, setSymbol] = useState("TOKEN");
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [inputAccount, setInputAccount] = useState("");
  const [inputValue, setInputValue] = useState("");

  const getName = async () => {
    try {
      const respone = await contract.methods.name().call();

      setName(respone);
    } catch (error) {
      console.log(error);
    }
  };
  // contract에 대한 정보를 불러오기 위해 getName을 설정함. contract가 우선적으로 실행되어야되기 때문에 비동기 함수로 설정, useEffect로 실행

  const getSymbol = async () => {
    try {
      const response = await contract.methods.symbol().call();

      setSymbol(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalanceOf = async () => {
    try {
      const response = await contract.methods.balanceOf(account).call();

      setBalance(web3.utils.fromWei(response, "ether"));
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(typeof response) 으로 찍었을 때 bigint로 출력된다는 점 참고
  // 해결법 Number((response));
  // web3.utils.fromWei 이더 단위로 출력
  // call() 값을 조회할 때 씀(블록체인에 영향을 끼치지 않음)

  const onSubmitSend = async (e) => {
    try {
      e.preventDefault();

      await contract.methods
        .transfer(inputAccount, web3.utils.toWei(inputValue, "ether"))
        .send({
          from: account
        });
//send는 옵션값이 필요
      getBalanceOf();

      setInputAccount("");
      setInputValue("");
      alert("성공적으로 토큰을 전송하였습니다.");
    } catch (error) {
      console.log(error);
    }
  };

  const onClickClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(walletAccount);
    } catch (error) {
      console.error(error);
    }
    return alert("지갑주소가 정상적으로 복사되었습니다.");
  };

  useEffect(() => {
    if (!contract || !account) return;

    getName();
    getSymbol();
    getBalanceOf();
  }, [contract, account]);

  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(mintTokenAbi, address));
  }, [web3]);

  useEffect(() => console.log(inputAccount), [inputAccount]);
  return (
    <div className="bg-white p-4 mt-6 w-96 border-4 hover:scale-125 active:scale-100 duration-500 delay-150 border-orange-500 rounded-2xl">
      <div>
        <button
          className="pt-2 pl-4 font-bold underline"
          onClick={onClickClipBoard}
        >
          {owner}
        </button>
        님께서 발행한 코인
      </div>
      <div>
        <div className="flex flex-col my-2 py-2">
          <span className="mx-12 border-b-[1px] text-sm font-semibold border-black">
            - 코인발행자 : {name}
          </span>

          <span className="mx-12 border-b-[1px] text-sm font-semibold border-black">
            - 코인명 : {symbol}
          </span>
          <span className="mx-12 border-b-[1px] text-sm font-semibold border-black">
            - 총발행량 : {balance}
          </span>
          <span className="mx-12 border-b-[1px] text-sm font-semibold border-black">
            - 지갑주소 : {walletAccount.substring(0, 7)}...
            {walletAccount.substring(walletAccount.length - 5)}
          </span>
        </div>
        <form className=" flex">
          <div className="pl-4 pb-4">
            {/* <input
              placeholder="수신자의 지갑주소를 입력해주세요."
              className=" border-b-2 border-black px-2 mr-2 text-sm w-64 h-8 "
              type="text"
              value={inputAccount}
              onChange={(e) => setInputAccount(e.target.value)}
            /> */}

            <select
              className="py-2"
              value={inputAccount}
              onChange={(e) => setInputAccount(e.target.value)}
            >
              <option value=""></option>
              {contractAddress.map((v, i) => (
                <OptionCard
                  key={i}
                  owner={v.owner}
                  walletAccount={v.walletAccount}
                />
              ))}
            </select>
            <input
              placeholder="보내실 Token의 크기를 입력해주세요."
              className=" border-b-2 inline-block-hidden border-black px-2 mr-2 text-sm w-64 h-8 "
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button
            className="bg-black mt-2 text-white hover:bg-gradient-to-r from-yellow-500 30% via-orange-500 30% to-orange-400 40% font-bold h-16 px-2 rounded-2xl"
            type="submit"
            onClick={onSubmitSend}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default TokenCard;
