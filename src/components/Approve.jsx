import React, { useContext, useEffect, useState } from "react";
import { MdNavigateBefore } from "react-icons/md";
import { tokenContractAddress } from "../utils/constants";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { AiFillWarning } from "react-icons/ai";
import { loanContractAddress } from "../utils/constants";
import Fetching from "./Fetching";
import { ethers } from "ethers";
import { MdOutlineNavigateNext } from "react-icons/md";

export default function Approve({
  setStep,
  stepNow,
  information,
  setIsApproved,
  isApproved,
}) {
  const { getTokenContract, provider, account } =
    useContext(LendAndLoanContext);
  const [balance, setBalance] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    const tokenContract = getTokenContract(provider.getSigner());
    setIsApproving(true);
    const res = await tokenContract
      .approve(
        loanContractAddress,
        ethers.utils.parseUnits(information.collateralAmount, 18)
      )
      .catch((err) => setIsApproving(false));
    await res.wait();
    setIsApproved(true);
    setTimeout(() => {
      setIsApproving(false);
      setStep(stepNow + 1);
    }, 500);
  };
  const getUserBalance = async () => {
    const tokenContract = getTokenContract(provider);
    if (account) {
      setTimeout(async () => {
        const res = await tokenContract.balanceOf(account);
        setBalance(res.toString() / 10 ** 18);
      }, 500);
    }
  };
  useEffect(() => {
    getUserBalance();
  }, [account]);

  return (
    <div className="p-3 mt-3">
      {balance != null ? (
        <div>
          <div className="my-2 break-words">
            Approve spender address: {tokenContractAddress}
          </div>
          <div className="my-2 break-words">
            Approve spender amount: {information.collateralAmount} BOW
          </div>
          <div className="my-2 break-words mb-10">
            User balances: {balance} BOW
          </div>
          {balance < information.collateralAmount ? (
            <div className="my-2 mx-auto w-fit">
              {" "}
              <p className="mx-auto font-light text-red-500 flex items-center select-none">
                <AiFillWarning className="mr-2" />
                Not enough balance!
              </p>
            </div>
          ) : isApproving ? (
            <div className="w-[50px] h-[50px] border-t-2 border-teal-600 animate-spin rounded-full my-10 mx-auto"></div>
          ) : isApproved ? (
            <></>
          ) : (
            <div
              onClick={() => handleApprove()}
              className="rounded mx-auto mt-10 py-1 md:px-3 md:py-2 bg-3clr-gradient opacity-80 select-none w-32 md:w-40 text-center cursor-pointer text-xl md:text-2xl shadow font-bold hover:opacity-100 transition"
            >
              Approve
            </div>
          )}
          <div
            className="flex items-center justify-center absolute left-0 bottom-2 
            cursor-pointer transition px-3 py-2 text-center rounded-full hover:text-gray-300 text-sm md:text-xl"
            onClick={() => setStep(stepNow - 1)}
          >
            <MdNavigateBefore className="text-sm md:text-xl" />
            Previous
          </div>
          {isApproved ? (
            <div
              onClick={() => setStep(stepNow + 1)}
              className="text-sm md:text-xl flex items-center justify-center absolute right-0 bottom-2 cursor-pointer transition px-3 py-2 text-center rounded-full hover:text-gray-300"
            >
              Next <MdOutlineNavigateNext className="text-sm md:text-xl" />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <Fetching />
      )}
    </div>
  );
}
