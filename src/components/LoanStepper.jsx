import React from "react";
import { BiDetail } from "react-icons/bi";
import { FaHandsHelping } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";

export default function LoanStepper({ step }) {
  return (
    <div>
      <div className="p-2 md:p-5">
        <div className="mx-4 md:p-4">
          <div className="flex items-center">
            <div className="flex items-center text-teal-600 relative">
              <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600 flex items-center justify-center bg-teal-600">
                <BiDetail className="text-white text-xl" />
              </div>
              <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">
                Loan Details
              </div>
            </div>
            <div
              className={
                "flex-auto border-t-2 transition duration-500 ease-in-out " +
                (step >= 2 ? "border-teal-600" : "border-white")
              }
            ></div>
            <div className="flex items-center text-white relative">
              <div
                className={
                  "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2  flex items-center justify-center " +
                  (step >= 2 ? "bg-teal-600 border-teal-600" : "")
                }
              >
                <FaHandsHelping className="text-white text-xl" />
              </div>
              <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">
                Approve
              </div>
            </div>
            <div
              className={
                "flex-auto border-t-2 transition duration-500 ease-in-out  " +
                (step >= 3 ? "border-teal-600" : "border-gray-300")
              }
            ></div>
            <div className="flex items-center text-gray-500 relative">
              <div
                className={
                  "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2  flex justify-center items-centers " +
                  (step >= 3
                    ? "border-teal-600 bg-teal-600"
                    : "border-gray-300")
                }
              >
                <GiConfirmed className="text-white text-xl" />
              </div>
              <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">
                Confirm
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
