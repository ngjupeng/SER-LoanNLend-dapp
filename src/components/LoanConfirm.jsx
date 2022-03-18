import React, { useState } from "react";
import LoanStepper from "./LoanStepper";
import LoanDetails from "./LoanDetails";
import Approve from "./Approve";
import Confirm from "./Confirm";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function LoanConfirm({
  information,
  cancel,
  isShow,
  ethRef,
  bowRef,
}) {
  const [step, setStep] = useState(1);
  const [isApproved, setIsApproved] = useState(false);
  const [hash, setHash] = useState();
  const handleClose = async () => {
    cancel();
    setStep(1);
    setIsApproved(false);
    setHash("");
    ethRef.current.value = "";
    bowRef.current.value = "";
  };
  return (
    <div
      className={
        "absolute w-[90%] left-[50%] top-[50%] md:w-[500px] -translate-x-[50%] -translate-y-[50%] bg-[#191b1f] mx-auto rounded-xl pb-8 pt-5 p-2 md:p-5 shadow-xl transition duration-200 scale-0 z-20 " +
        (isShow ? "scale-100" : "")
      }
    >
      <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full ">
        <IoIosCloseCircleOutline
          className="text-2xl md:text-4xl cursor-pointer hover:text-gray-400 transition"
          onClick={() => handleClose()}
        />
      </div>
      {/* stepper */}
      <div>
        <LoanStepper step={step} />
      </div>
      <div>
        {step == 1 && (
          <LoanDetails
            information={information}
            setStep={setStep}
            stepNow={step}
          />
        )}
        {step == 2 && (
          <Approve
            setStep={setStep}
            stepNow={step}
            information={information}
            setIsApproved={setIsApproved}
            isApproved={isApproved}
          />
        )}

        {step == 3 && (
          <Confirm
            information={information}
            setStep={setStep}
            stepNow={step}
            setHash={setHash}
            hash={hash}
          />
        )}
      </div>
      {/* <Routes>
          <Route path="/lend/details" element={<LoanDetails />} />
          <Route path="/lend/approve" element={<Approve />} />
          <Route path="/lend/confirm" element={<Confirm />} />
        </Routes> */}
    </div>
  );
}
