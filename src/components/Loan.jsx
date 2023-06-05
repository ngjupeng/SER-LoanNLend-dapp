import { ethers } from "ethers";
import React, { useContext, useRef, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { AiFillWarning } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import LoanConfirm from "./LoanConfirm";
import "react-toastify/dist/ReactToastify.css";

const commonCss =
  "flex-1 text-center h-full px-1 py-[5px] cursor-pointer hover:text-gray-300 transition focus:text-gray-900 select-none rounded-full ";

const DaySelection = ({ content, isActive, handleOnClick }) => {
  return (
    <div
      onClick={handleOnClick}
      className={
        commonCss +
        (isActive == content
          ? "text-gray-300 shadow shadow-blue-500 duration-100 "
          : "")
      }
    >
      {content} days
    </div>
  );
};

export default function Loan() {
  const { account, requestAccount, getLoanContract, provider } =
    useContext(LendAndLoanContext);
  const [isActive, setIsActive] = useState(7);
  const [isFetchingAmont, setIsFetchingAmount] = useState(false);
  const [isValidLoanAmount, setIsValidLoanAmount] = useState(true);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isShowLoanDetails, setIsShowLoanDetails] = useState(false);
  const [loanInformation, setLoanInformation] = useState();
  const ethInputRef = useRef();
  const bowInputRef = useRef();
  const interval = 700;
  let typingTimer;

  const notify = () =>
    toast.error("Sorry, contract does not has enough liquidity!");

  const handleKeyDown = (e) => {
    if (e.keyCode == 189 || e.keyCode == 109 || e.keyCode == 107) {
      setIsFetchingAmount(false);
      e.preventDefault();
    }
  };

  const handleKeyUp = (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => handleOnChange(e), interval);
  };

  const handleOnChange = async (e) => {
    const contract = getLoanContract(provider);
    if (e.target.name == "eth") {
      // eth
      // console.log(ethInputRef.current.value);
      if (ethInputRef.current.value) {
        setIsFetchingAmount(true);
        const convertedToWei = ethers.utils.parseUnits(
          ethInputRef.current.value,
          18
        );
        const res = await contract.collateralAmount(convertedToWei);
        bowInputRef.current.value = res.toNumber();
        setIsFetchingAmount(false);
      } else {
        bowInputRef.current.value = "";
      }
    } else {
      // bow
      if (bowInputRef.current.value) {
        setIsFetchingAmount(true);
        let res = await contract.countEtherFromCollateral(
          bowInputRef.current.value
        );
        res = ethers.utils.formatEther(res);
        ethInputRef.current.value = res;
        setIsFetchingAmount(false);
      } else {
        ethInputRef.current.value = "";
      }
    }
  };

  const handleLoanProceed = async () => {
    if (ethInputRef.current.value < 0.0001 || bowInputRef.current.value < 1) {
      setIsValidLoanAmount(false);
    } else {
      setIsProceeding(true);
      const contract = getLoanContract(provider.getSigner());
      const loanAmountToWei = ethers.utils.parseUnits(
        ethInputRef.current.value,
        18
      );
      const res = await contract.checkEnoughLiquidity(loanAmountToWei);
      if (res) {
        // enough liquidity
        setIsShowLoanDetails(true);
        let date = new Date();
        date.setDate(date.getDate() + isActive);
        setIsValidLoanAmount(true);
        setLoanInformation({
          lender: account,
          loanAmount: ethInputRef.current.value,
          collateralAmount: bowInputRef.current.value,
          duration: isActive,
          dateNow: date,
          rate: isActive == 7 ? 6 : isActive == 14 ? 7 : isActive == 30 ? 8 : 0,
        });
        // const res = await contract.loanEther(loanAmountToWei, isActive);
        // console.log(res);
      } else {
        notify();
      }
      setIsProceeding(false);
    }
  };

  return (
    <div className="mt-10 md:mt-10">
      <LoanConfirm
        ethRef={ethInputRef}
        bowRef={bowInputRef}
        cancel={() => setIsShowLoanDetails(false)}
        isShow={isShowLoanDetails}
        information={loanInformation ? loanInformation : {}}
      />

      <ToastContainer theme="dark" />
      <div className="w-auto mx-5 md:max-w-[450px] md:mx-auto ">
        <div className="text-white font-bold text-2xl mb-3">Loan</div>
        <div className="bg-[#191b1fc2] p-4  shadow-xl  h-auto rounded-xl ">
          {" "}
          <div className="mt-3">
            <p className="my-1 mb-2 font-thin">
              How much do you want to borrow?
            </p>
            <div className="flex items-center w-full rounded h-16 outline-none bg-[#33373f81] px-5  border-[1px] border-transparent hover:border-gray-600 transition  font-inter">
              <input
                name="eth"
                ref={ethInputRef}
                onKeyUp={(e) => handleKeyUp(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                min="0"
                className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
                placeholder="0.0"
                autoComplete="off"
              />
              <span className="text-2xl ml-5  cursor-auto select-none">
                ETH
              </span>
            </div>
          </div>
          <div className="mt-5 z-[-1] flex items-center w-full rounded h-16 outline-none bg-[#33373f81] px-5  border-[1px] border-transparent hover:border-gray-600 transition">
            <input
              name="bow"
              ref={bowInputRef}
              onKeyUp={(e) => handleKeyUp(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              type="number"
              className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
              placeholder="0.0"
              autoComplete="off"
            />
            <span className="text-2xl ml-5 cursor-auto select-none">BOW</span>
          </div>
          <p className="my-1 mb-2 font-thin">Specify collateral to deposit</p>
          {!isValidLoanAmount && (
            <p className="font-light text-red-500 flex items-center select-none">
              <AiFillWarning className="mr-2" />
              Minumum loan amount is 0.0001 ether
            </p>
          )}
          {isFetchingAmont && (
            <div className="mt-4 flex items-center">
              <div className="w-5 h-5 border-t-2 border-blue-700 rounded-full animate-spin "></div>
              <div className="ml-3 font-thin text-sm animate-pulse">
                Fetching best price...
              </div>
            </div>
          )}
          <p className="text-gray-200 text-right text-sm select-none cursor-auto my-1 mb-2 font-thin">
            Rate:{" "}
            {isActive == 7 ? 6 : isActive == 14 ? 7 : isActive == 30 ? 8 : 0}%
          </p>
          <div className="mb-4 mt-2 flex items-center shadow shadow-gray-500 justify-center   w-[80%] mx-auto rounded-full shadow">
            {[7, 14, 30].map((element, index) => (
              <DaySelection
                key={element + index}
                content={element}
                handleOnClick={() => setIsActive(element)}
                isActive={isActive}
              />
            ))}
          </div>
          {!account ? (
            <div
              onClick={() => requestAccount()}
              className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-[#5090ea] cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
            >
              Connect Wallet
            </div>
          ) : !isProceeding ? (
            <div
              onClick={() => handleLoanProceed()}
              className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-[#5090ea] cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
            >
              Proceed
            </div>
          ) : (
            <div className="my-10 w-20 h-20 animate-spin rounded-full border-blue-700 border-b-2 mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
}
