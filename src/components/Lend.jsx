import React, { useEffect, useRef, useState, useContext } from "react";
import { HiArrowSmDown } from "react-icons/hi";
import { FaEthereum } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { AiFillWarning } from "react-icons/ai";
import { ethers } from "ethers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BiHappyBeaming } from "react-icons/bi";
import { loanContractAddress } from "../utils/constants";

const LendDetail = ({
  isShow,
  setIsShow,
  information,
  isLendEther,
  setIsProceeding,
  lendRef,
}) => {
  const { getTokenContract, provider, account, getLoanContract } =
    useContext(LendAndLoanContext);
  const [isApproving, setIsApproving] = useState(false);
  const [tokenBalance, setTokenBalance] = useState();
  const [goingToConfirm, setGoingToConfirm] = useState(false);
  const [approveTransactionDetail, setApproveTransactionDetail] = useState();
  const [lendTokenHash, setLendTokenHash] = useState();
  const [isConfirm, setIsConfirm] = useState();
  const [isDone, setIsDone] = useState(false);

  const getUserTokenBalance = async () => {
    if (account) {
      const contract = getTokenContract(provider);
      const res = await contract.balanceOf(account);
      setTokenBalance(res.toString() / 10 ** 18);
    }
  };
  const close = () => {
    setIsShow(false);
    setTimeout(() => {
      setIsApproving(false);
      setGoingToConfirm(false);
      setIsConfirm(false);
      setIsDone(false);
      setIsProceeding(false);
      setApproveTransactionDetail({});
      lendRef.current.value = "";
    }, 300);
  };
  const handleApprove = async () => {
    setIsApproving(true);
    const contract = getTokenContract(provider.getSigner());
    const res = await contract
      .approve(
        loanContractAddress,
        ethers.utils.parseUnits(information.amount, 18)
      )
      .catch((err) => setIsApproving(false));
    const data = await res.wait();
    // console.log(data);
    // console.log(res);
    setApproveTransactionDetail({
      hash: data.transactionHash,
    });
    setGoingToConfirm(true);
  };
  const handleLendToken = async () => {
    setIsConfirm(true);
    const contract = getLoanContract(provider.getSigner());
    const res = await contract
      .lendToken(ethers.utils.parseUnits(information.amount, 18))
      .catch((err) => setIsConfirm(false));
    const data = await res.wait();
    setLendTokenHash(data.transactionHash);
    setIsConfirm(false);
    setIsDone(true);
    // setTimeout(() => {
    //   setLendTokenHash(
    //     "0xc3727cf6283038402435f29b52faf8d1fe8011cba1f83ff3c4fe455d08648e95"
    //   );
    //   setIsConfirm(false);
    //   setIsDone(true);
    // }, 1000);
  };
  useEffect(() => {
    getUserTokenBalance();
  }, []);
  return (
    <div
      className={
        "absolute left-[50%] top-[50%] w-[90%] md:max-w-[380px] -translate-x-[50%] -translate-y-[50%] bg-[#191b1f] mx-auto rounded-xl p-5 shadow-xl transition duration-200 scale-0 z-20 " +
        (isShow ? "scale-100" : "")
      }
    >
      <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full ">
        <IoIosCloseCircleOutline
          className="text-4xl cursor-pointer hover:text-gray-400 transition"
          onClick={() => close()}
        />
      </div>
      {isLendEther ? (
        <div>
          <div className="text-2xl flex items-center">
            Lend status:{" "}
            <b className="ml-1 text-green-500 flex items-center">
              Success <BiHappyBeaming className="ml-1" />
            </b>
          </div>
          <div className="mt-5">
            <a
              title="Link to transaction"
              target="_blank"
              rel="nonreferrer nonopennner"
              href={"https://rinkeby.etherscan.io/tx/" + information.hash}
              className="my-2 break-words cursor-pointer "
            >
              Transaction Hash: {information.hash}
            </a>
            <p className="my-2 break-words">Lender: {information.lender}</p>
            <p className="my-2 break-words">
              Lend Amount: {information.amount} ETH
            </p>
          </div>
        </div>
      ) : (
        <div>
          {isDone ? (
            <div>
              <div className="text-2xl flex items-center">
                Lend status:{" "}
                <b className="ml-1 text-green-500 flex items-center">
                  Success <BiHappyBeaming className="ml-1" />
                </b>
              </div>
              <div className="break-words mt-5">
                Transaction Hash:
                <a
                  rel="noreferrer noopenner"
                  target="_blank"
                  href={"https://rinkeby.etherscan.io/tx/" + lendTokenHash}
                >
                  {lendTokenHash}
                </a>
              </div>
            </div>
          ) : goingToConfirm ? (
            <div>
              <div>Lend amount: {information.amount} BOW</div>
              <div className="break-words">
                Approve Transaction Hash:{" "}
                <a
                  target="_blank"
                  rel="noopenner noreferrer"
                  href={
                    "https://rinkeby.etherscan.io/tx/" +
                    approveTransactionDetail.hash
                  }
                >
                  {approveTransactionDetail.hash}
                </a>
              </div>
              {isConfirm ? (
                <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full  mx-auto"></div>
              ) : (
                <div
                  onClick={() => handleLendToken()}
                  className="rounded mx-auto my-5 px-3 py-2 bg-3clr-gradient opacity-80 select-none w-fit text-center cursor-pointer text-xl md:text-2xl shadow font-bold hover:opacity-100 transition"
                >
                  Confirm Lend
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="break-words my-2">
                Approve spender address:{" "}
                <a
                  title="Open contract"
                  target="_blank"
                  rel="noopenner noreferrer"
                  href={
                    "https://rinkeby.etherscan.io/address/" +
                    loanContractAddress
                  }
                >
                  {loanContractAddress}
                </a>
              </div>
              <div className="my-2">
                Approve amount: {information.amount} BOW
              </div>
              <div className="my-2">
                {" "}
                {tokenBalance >= information.amount ? (
                  isApproving ? (
                    <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full  mx-auto"></div>
                  ) : (
                    <div
                      onClick={() => handleApprove()}
                      className="rounded mx-auto my-5 px-3 py-2 bg-3clr-gradient opacity-80 select-none w-40 text-center cursor-pointer text-xl md:text-2xl shadow font-bold hover:opacity-100 transition"
                    >
                      Approve
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center text-red-500">
                    <AiFillWarning className="mr-2" />
                    Not enough balance!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Lend() {
  const {
    account,
    requestAccount,
    getLoanContract,
    provider,
    getAccBalance,
    setContractTotalLiquidity,
  } = useContext(LendAndLoanContext);
  const [isDropDown, setIsDropDown] = useState(false);
  const [isLendEther, setIsLendEther] = useState(true);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isValidLendAmount, setIsValidLendAmount] = useState(true);
  const [isEnoughFund, setIsEnoughFund] = useState(true);
  const [isShowLendDetail, setIsShowLendDetail] = useState(false);
  const [lendSuccessInformation, setLendSuccessInformation] = useState();
  const dropDownRef = useRef();
  const lendInputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.keyCode == 189 || e.keyCode == 109 || e.keyCode == 107) {
      e.preventDefault();
    }
  };

  const handleClickOutside = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setIsDropDown(false);
    }
  };

  const handleLend = async () => {
    const contract = getLoanContract(provider.getSigner());
    if (isLendEther) {
      if (lendInputRef.current.value >= 0.0001) {
        const balance = await getAccBalance();
        if (balance < lendInputRef.current.value) {
          setIsEnoughFund(false);
        } else {
          setIsProceeding(true);
          setIsEnoughFund(true);
          const res = await contract
            .lendEther({
              value: ethers.utils.parseUnits(lendInputRef.current.value, 18),
            })
            .catch((err) => setIsProceeding(false));
          const data = await res.wait();
          // console.log(res);
          // console.log(data);
          setLendSuccessInformation({
            hash: res.hash,
            lender: res.from,
            amount: lendInputRef.current.value,
          });
          setIsShowLendDetail(true);
          lendInputRef.current.value = "";
        }
      } else {
        setIsValidLendAmount(false);
        setIsEnoughFund(true);
      }
      setIsProceeding(false);
    } else {
      if (lendInputRef.current.value >= 1) {
        setIsProceeding(true);
        //const res = await contract.lendToken(lendInputRef.current.value);
        setLendSuccessInformation({
          lender: account,
          amount: lendInputRef.current.value,
        });
        setIsShowLendDetail(true);
      } else {
        setIsValidLendAmount(false);
      }
    }
    setContractTotalLiquidity();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-10 md:mt-24">
      <LendDetail
        lendRef={lendInputRef}
        setIsProceeding={setIsProceeding}
        isLendEther={isLendEther}
        isShow={isShowLendDetail}
        setIsShow={setIsShowLendDetail}
        information={lendSuccessInformation ? lendSuccessInformation : {}}
      />

      <div className="mx-5 md:mx-auto w-[fit-content]">
        <div className="text-white font-bold text-2xl">Lend Order</div>
        <div className="mt-3 mx-auto w-full bg-[#191b1fc2] h-auto rounded-xl shadow-xl px-5 py-4">
          <div>
            <p className="my-1 mb-2 font-thin">How much do you want to lend?</p>
            <div className="flex items-center w-full rounded h-16 outline-none bg-[#33373f81] px-5  border-[1px] border-transparent hover:border-gray-600 transition  font-inter">
              <input
                ref={lendInputRef}
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
                placeholder="0.0"
                autoComplete="off"
              />
              <div className="relative ml-5 group">
                <div
                  ref={dropDownRef}
                  onClick={() => {
                    isDropDown ? setIsDropDown(false) : setIsDropDown(true);
                  }}
                  className="cursor-pointer relative flex items-center bg-[#1a1c20c2] px-2 py-2 md:px-3 rounded-2xl hover:bg-gray-700 cursor-pointer transition text-xl md:text-2xl select-none text-center"
                >
                  {isLendEther ? (
                    <p className="px-2">ETH</p>
                  ) : (
                    <p className="px-1">BOW</p>
                  )}{" "}
                  <HiArrowSmDown className="text-2xl md:text-3xl" />
                </div>
                {isDropDown ? (
                  <div className="absolute top-[110%] bg-[#1a1c20c2] shadow shadow-gray-400 rounded hover:shadow-gray-600 overflow-hidden">
                    <div
                      onClick={() => setIsLendEther(true)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <FaEthereum className="mr-2" />
                      ETH{" "}
                    </div>
                    <div
                      onClick={() => setIsLendEther(false)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      BOW{" "}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="my-4 text-right text-sm cursor-auto select-none">
              APY: 5%
            </div>
            <div></div>
            {!isValidLendAmount && (
              <div className="p-0 flex justify-center items-center text-red-500">
                <AiFillWarning className="mr-2" />
                <div>Minimum lend amount 0.0001 ETH or 1 BOW token</div>
              </div>
            )}
            {!isEnoughFund && (
              <div className="p-0 flex justify-center items-center text-red-500">
                <AiFillWarning className="mr-2" />
                <div>Insufficient fund!</div>
              </div>
            )}
            <div className="p-0 flex justify-center items-center text-yellow-300">
              <AiFillWarning className="mr-2 text-2xl md:text-base" />
              <div className="text-sm md:text-base">
                Only lend for more than 30 days can get 5% interest when
                withdraw !
              </div>
            </div>
            {!account ? (
              <div
                onClick={() => requestAccount()}
                className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-[#5090ea] cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
              >
                Connect Wallet
              </div>
            ) : isProceeding ? (
              <div className="my-10 w-20 h-20 animate-spin rounded-full border-blue-700 border-b-2 mx-auto"></div>
            ) : (
              <div
                onClick={() => handleLend()}
                className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-[#5090ea] cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
              >
                Lend
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
