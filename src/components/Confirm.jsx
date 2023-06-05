import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { MdOutlineNavigateNext, MdNavigateBefore } from "react-icons/md";
import { LendAndLoanContext } from "../context/LendAndLoanContext";

export default function Confirm({
  information,
  setStep,
  stepNow,
  hash,
  setHash,
}) {
  const { getLoanContract, provider, account, setContractTotalLiquidity } =
    useContext(LendAndLoanContext);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (account) {
      setIsConfirming(true);
      const contract = await getLoanContract(provider.getSigner());
      const res = await contract
        .loanEther(
          ethers.utils.parseUnits(information.loanAmount, 18),
          information.duration
        )
        .catch((err) => setIsConfirming(false));
      const data = await res.wait();
      setHash(data.transactionHash);
      setIsConfirming(false);
      setContractTotalLiquidity();
    }
  };
  return (
    <div className="p-3 mt-5">
      <div className="my-2">Confirm loan for {information.loanAmount} ETH</div>
      <div className="my-2">
        Confirm deposit collateral of {information.collateralAmount} BOW
      </div>
      {!isConfirming ? (
        !hash ? (
          <div
            onClick={() => handleConfirm()}
            className="rounded mx-auto mt-7 py-1 md:px-3 md:py-2 bg-3clr-gradient opacity-80 select-none w-40 text-center cursor-pointer text-2xl shadow font-bold hover:opacity-100 transition"
          >
            Confirm
          </div>
        ) : (
          <a
            target="_blank"
            rel="noopenner noreferrer"
            href={"https://mumbai.polygonscan.com/tx/" + hash}
            className="block break-words md:mb-10"
          >
            Transaction hash: {hash}
          </a>
        )
      ) : (
        <div className="w-[50px] h-[50px] border-t-2 border-teal-600 animate-spin rounded-full my-10 mx-auto"></div>
      )}
      <div
        className="flex items-center justify-center absolute left-0 bottom-2 cursor-pointer transition px-3 py-2 text-center rounded-full hover:text-gray-300 text-sm md:text-xl"
        onClick={() => setStep(stepNow - 1)}
      >
        <MdNavigateBefore className="text-sm md:text-xl" />
        Previous
      </div>
    </div>
  );
}
