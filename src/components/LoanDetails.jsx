import React from "react";
import { MdOutlineNavigateNext } from "react-icons/md";

export default function LoanDetails({ information, setStep, stepNow }) {
  return (
    <div className="p-3 mt-3">
      <div className="my-2 break-words">Lender: {information.lender}</div>
      <div className="my-2 break-words">
        Loan amount: {information.loanAmount} ETH
      </div>
      <div className="my-2 break-words">
        Collateral amount: {information.collateralAmount} BOW
      </div>
      <div className="my-2 break-words">
        Duration: {information.duration} days
      </div>
      <div className="my-2 break-words">
        Deadline to repay:{" "}
        {information.dateNow
          ? information.dateNow.toString().replace("GMT+0800", "")
          : ""}{" "}
      </div>
      <div className="my-2">Rate: {information.rate}%</div>
      <div
        onClick={() => setStep(stepNow + 1)}
        className="text-sm md:text-xl flex items-center justify-center absolute right-2 bottom-2 cursor-pointer transition px-3 py-2 text-center rounded-full hover:text-gray-300"
      >
        Next <MdOutlineNavigateNext className="text-sm md:text-xl" />
      </div>
    </div>
  );
}
