import React, { useContext, useEffect, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { ethers } from "ethers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import lending from "../images/lending.png";
import signing from "../images/signing.png";
import timeConverter from "../utils/timeConvert";

const WithdrawDetails = ({
  isShow,
  withdrawDetails,
  setIsShowDetails,
  setWithdrawDetails,
}) => {
  const close = () => {
    setIsShowDetails(false);
    setWithdrawDetails("");
  };
  return (
    <div>
      {" "}
      <div
        className={
          "fixed left-[50%] top-[50%] min-w-[380px] w-[20%] -translate-x-[50%] -translate-y-[50%] bg-[#191b1f] mx-auto rounded-xl p-5 shadow-xl transition duration-200 scale-0 z-20 " +
          (isShow ? " scale-100" : "")
        }
      >
        <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full ">
          <IoIosCloseCircleOutline
            className="text-4xl cursor-pointer hover:text-gray-400 transition"
            onClick={() => close()}
          />
        </div>
        {withdrawDetails != "" ? (
          <div>
            <div>
              <div>Transaction Hash: </div>
              <a
                title="Link to transaction"
                target="_blank"
                rel="nonreferrer nonopennner"
                href={"https://rinkeby.etherscan.io/tx/" + withdrawDetails.hash}
                className="my-2 break-words cursor-pointer "
              >
                {withdrawDetails.hash}
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full  mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const LendList = ({
  data,
  updateLends,
  setWithdrawDetails,
  setIsShowDetails,
}) => {
  const {
    getLoanContract,
    provider,
    account,
    getUserOngoingLend,
    setContractTotalLiquidity,
  } = useContext(LendAndLoanContext);
  const [lendDate, setLendDate] = useState();
  const [lendDateGetInterest, setLendDateGetInterest] = useState();

  const handleWithdraw = async () => {
    const contract = getLoanContract(provider.getSigner());
    if (account) {
      setIsShowDetails(true);
      const res = await contract
        .withdraw(data.lendId.toNumber())
        .catch((err) => setIsShowDetails(false));
      // console.log(res);
      const details = await res.wait();
      // console.log(details);
      const lendsData = await getUserOngoingLend();
      updateLends(lendsData);
      setWithdrawDetails({
        hash: details.transactionHash,
      });
    }
    setContractTotalLiquidity();
  };
  useEffect(() => {
    const timeLendDate = timeConverter(data.timeLend.toNumber());
    const timeCanGetInterestDate = timeConverter(
      data.timeCanGetInterest.toNumber()
    );
    setLendDate(timeLendDate.toString());
    setLendDateGetInterest(timeCanGetInterestDate.toString());
  });
  return (
    <div className="mt-4 bg-[#33373f81] hover:bg-gray-800 transition px-4 py-3 rounded cursor-pointer text-gray-300">
      <div className="break-words">
        <p className="font-bold text-white underline">Lender</p>
        <p>{data.lender}</p>
      </div>
      <div className="break-words">
        <p className="font-bold text-white underline">Lend date</p>{" "}
        <p>{lendDate}</p>
      </div>
      <div className="break-words">
        <p className="font-bold text-white break-words underline">
          Date can get interest
        </p>{" "}
        <p> {lendDateGetInterest}</p>
      </div>
      <div>
        {data.isLendEther && (
          <div>
            <div className="">
              <p className="font-bold text-white underline">
                After interest date payback amount
              </p>{" "}
              <p className="break-words">
                {ethers.utils.formatEther(data.paybackAmountEther.toString())}{" "}
                ETH
              </p>
            </div>
            <div className="">
              <p className="font-bold text-white underline">Lend ETH amount</p>{" "}
              <p className="break-words">
                {ethers.utils.formatEther(data.lendAmountEther.toString())} ETH
              </p>
            </div>
          </div>
        )}
        {!data.isLendEther && (
          <div>
            <div className="">
              <p className="font-bold text-white underline">
                After interest date payback amount
              </p>{" "}
              <p className="break-words">
                {data.paybackAmountToken.toString() / 10 ** 18} BOW
              </p>
            </div>
            <div className="">
              <p className="font-bold text-white underline">Lend BOW amount</p>{" "}
              <p className="break-words">
                {data.lendAmountToken.toString() / 10 ** 18} BOW
              </p>
            </div>
          </div>
        )}
      </div>
      <div
        onClick={() => handleWithdraw()}
        className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-blue-400 cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
      >
        Withdraw
      </div>
    </div>
  );
};

const LoanList = ({
  data,
  updateLoans,
  setWithdrawDetails,
  setIsShowDetails,
}) => {
  const {
    getLoanContract,
    provider,
    account,
    getUserOngoingLoan,
    setContractTotalLiquidity,
  } = useContext(LendAndLoanContext);
  const [loanDueDate, setLoanDueDate] = useState();
  const [loanDuration, setLoanDuration] = useState();

  const handlePayback = async () => {
    const contract = getLoanContract(provider.getSigner());
    if (account) {
      setIsShowDetails(true);
      const res = await contract
        .payback(data.loanId.toNumber(), {
          value: data.paybackAmount.toString(),
        })
        .catch((err) => setIsShowDetails(false));
      console.log(res);
      const details = await res.wait();
      // console.log(details);
      const loansData = await getUserOngoingLoan();
      updateLoans(loansData);
      setWithdrawDetails({
        hash: details.transactionHash,
      });
      setContractTotalLiquidity();
    }
  };
  useEffect(() => {
    const timeLoanDueDate = timeConverter(data.loanDueDate.toNumber());
    setLoanDueDate(timeLoanDueDate.toString());
    if (data.duration.toString() == "604800") {
      setLoanDuration(7);
    } else if (data.duration.toString() == "1209600") {
      setLoanDuration(14);
    } else {
      setLoanDuration(30);
    }
  });
  return (
    <div className="mt-4 bg-[#33373f81] hover:bg-gray-800 transition px-4 py-3 rounded cursor-pointer text-gray-300">
      <div className="">
        <p className="font-bold text-white underline">Loan due date</p>{" "}
        <p className="break-words">{loanDueDate}</p>
      </div>
      <div className="">
        <p className="font-bold text-white underline">Duration</p>{" "}
        <p className="break-words">{loanDuration} days</p>
      </div>
      <div>
        <div>
          <div className="">
            <p className="font-bold text-white underline">Loan ETH amount</p>{" "}
            <p className="break-words">
              {ethers.utils.formatEther(data.loanAmount.toString())} ETH
            </p>
          </div>
          <div className="">
            <p className="font-bold text-white underline">Payback amount</p>{" "}
            <p className="break-words">
              {ethers.utils.formatEther(data.paybackAmount.toString())} ETH
            </p>
          </div>
          <div className="">
            <p className="font-bold text-white underline">Collateral amount</p>{" "}
            <p className="break-words">
              {data.collateralAmount.toString() / 10 ** 18} BOW
            </p>
          </div>
        </div>
      </div>
      <div
        onClick={() => handlePayback()}
        className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-blue-400 cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
      >
        Payback
      </div>
    </div>
  );
};

export default function Redemption() {
  const { getUserOngoingLend, getUserOngoingLoan, account, requestAccount } =
    useContext(LendAndLoanContext);
  const [lends, setLends] = useState();
  const [loans, setLoans] = useState();
  const [loading, setLoading] = useState(true);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [withdrawDetails, setWithdrawDetails] = useState("");
  useEffect(async () => {
    setLoading(true);
    const lendsData = await getUserOngoingLend();
    const loansData = await getUserOngoingLoan();
    setLends(lendsData);
    setLoans(loansData);
    console.log(loansData);
    setLoading(false);
    // console.log(lendsData);
    // console.log(loansData);
  }, [account]);

  return (
    <div className="mx-5 md:mx-auto mt-10 md:mt-24 mb-24 w-auto md:max-w-[550px]">
      <div className="text-white font-bold text-2xl mb-3">Redemption</div>
      <WithdrawDetails
        isShow={isShowDetails}
        withdrawDetails={withdrawDetails}
        setIsShowDetails={setIsShowDetails}
        setWithdrawDetails={setWithdrawDetails}
      />
      <div className="bg-[#191b1fc2] mx-auto rounded-xl  p-5">
        {loading ? (
          <div>
            <div className="w-[70%] mb-4 h-6 rounded-full animate-pulse bg-gray-700"></div>
            <div className="w-[60%] mb-4 h-6 rounded-full animate-pulse bg-gray-700"></div>
            <div className="w-full h-6 rounded-full animate-pulse bg-gray-700"></div>
            <div className="flex w-full my-4 animate-pulse">
              <div className="w-[60%] mr-4 h-6 rounded-full bg-gray-700"></div>
              <div className="w-[40%] h-6 rounded-full bg-gray-700"></div>
            </div>
            <div className="w-40% h-6 rounded-full animate-pulse bg-gray-700"></div>
            <div className="my-4 w-[70%] mb-4 h-6 rounded-full animate-pulse bg-gray-700"></div>
            <div className="flex w-full mt-4 animate-pulse">
              <div className="w-[40%] mr-4 h-6 rounded-full bg-gray-700"></div>
              <div className="w-[60%] h-6 rounded-full bg-gray-700"></div>
            </div>
          </div>
        ) : account ? (
          <div>
            <div className="font-bold text-2xl">Loan ongoing requests</div>
            <div className="my-2 h-[2px] bg-line-loan rounded-full"></div>
            {loans && loans.length == 0 ? (
              <div className="my-5">
                <div className="flex justify-center flex-col items-center">
                  {" "}
                  <img className="w-[30%] select-none" src={signing} alt="" />
                  <p className="text-2xl select-none mt-3 font-courgette">
                    No ongoing loans...
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {" "}
                {account &&
                  loans &&
                  loans.map((ele, index) => {
                    if (
                      ele.borrower.toString() !=
                      "0x0000000000000000000000000000000000000000"
                    ) {
                      return (
                        <LoanList
                          key={ele.loanId.toNumber() + ele}
                          data={ele}
                          updateLoans={setLoans}
                          setIsShowDetails={setIsShowDetails}
                          setWithdrawDetails={setWithdrawDetails}
                        />
                      );
                    }
                  })}
              </div>
            )}
            <div className="my-5"></div>
            <div className="font-bold text-2xl">Lend ongoing requests</div>
            <div className="my-2 h-[2px] bg-line-lend rounded-full"></div>
            {lends && lends.length == 0 ? (
              <div className="my-5">
                <div className="flex justify-center flex-col items-center">
                  {" "}
                  <img className="w-[30%] select-none" src={lending} alt="" />
                  <p className="text-2xl select-none mt-3 font-courgette">
                    No ongoing lends...
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {account &&
                  lends &&
                  lends.map((ele, index) => {
                    return (
                      <LendList
                        key={ele.lendId.toNumber()}
                        data={ele}
                        updateLends={setLends}
                        setIsShowDetails={setIsShowDetails}
                        setWithdrawDetails={setWithdrawDetails}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div>Please connect wallet to proceed...</div>
            <div
              onClick={() => requestAccount()}
              className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-[#5090ea] cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
            >
              Connect Wallet
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
