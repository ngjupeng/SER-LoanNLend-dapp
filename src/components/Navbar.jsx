import React, { useState, useEffect, useContext, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiTrendingUp } from "react-icons/fi";
import { FaFaucet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { shortenAddress } from "../utils/shortenAddress";
import { ethers } from "ethers";

let commonCss =
  "font-bold px-2 md:px-4 py-1  cursor-pointer rounded-2xl hover:text-white transition duration-200 flex ";

const NavItem = ({ active, content, handleOnClick }) => {
  return content == "Contract" ? (
    <a
      className={commonCss + "text-gray-300"}
      href="https://mumbai.polygonscan.com/address/0x305C40132aCd1e9Ae0fE945BEa8192736F2B7B8f"
      target="_blank"
      rel="noopenner noreferrer"
    >
      {content} <FiTrendingUp className="ml-1 text-bold" />
    </a>
  ) : (
    <Link to={"/" + (content == "Loan" ? "" : content)}>
      <div
        onClick={handleOnClick}
        className={
          commonCss +
          (active == content
            ? "bg-[#212429] text-white hover:text-gray-400"
            : "text-gray-300")
        }
      >
        {content}
      </div>
    </Link>
  );
};

export default function Navbar() {
  const { requestAccount, account, provider, getTokenContract } =
    useContext(LendAndLoanContext);
  const [isActive, setIsActive] = useState("Loan");
  const [isDropDown, setIsDropDown] = useState(false);
  const [isShowingToken, setIsShowingToken] = useState(false);
  const [userBalance, setUserBalance] = useState();
  const dropdownRef = useRef();
  const navMenu = ["Loan", "Lend", "Redemption", "Contract"];

  const handleClickOutside = (e) => {
    if (!dropdownRef.current.contains(e.target)) {
      setIsDropDown(false);
    }
  };

  useEffect(async () => {
    const url = window.location.href;
    let param = url.substring(url.lastIndexOf("/") + 1);
    param == "" ? setIsActive("Loan") : setIsActive(param);
    if (account) {
      let balance = await provider.getBalance(account);
      setUserBalance(
        Number(ethers.utils.formatEther(balance.toString())).toFixed(2)
      );
    }
    //balance = ethers.utils.formatEther(balance);

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [account]);

  const changeBalance = async () => {
    let statusNow = !isShowingToken;
    setIsShowingToken(!isShowingToken);
    if (statusNow) {
      let tokenBalance = getTokenContract(provider);
      const tokenAmount = await tokenBalance.balanceOf(account);
      setUserBalance(tokenAmount.toString() / 10 ** 18);
    } else {
      let balance = await provider.getBalance(account);
      setUserBalance(
        Number(ethers.utils.formatEther(balance.toString())).toFixed(2)
      );
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 p-5">
      <div className="w-[fit-content] font-festive text-3xl cursor-pointer hover:scale-125 transition duration-200">
        SER
      </div>
      <div className="fixed bottom-5 left-[50%] translate-x-[-50%] md:static md:translate-x-[%] p-[3px] bg-[#191b1f] flex rounded-full md:w-[fit-content] place-self-center">
        {navMenu.map((item, index) => (
          <NavItem
            key={item + index}
            active={isActive}
            content={item}
            handleOnClick={() => setIsActive(item)}
          />
        ))}
      </div>
      <div className="flex justify-self-end  md:justify-self-end  items-center justify-center">
        <a
          href="https://mumbai.polygonscan.com/"
          className="min-w-[170px] hidden 2xl:flex items-center mr-2 px-4 py-2 rounded-2xl bg-[#191b1f] cursor-pointer"
          target="_blank"
          rel="noopenner noreferrer"
        >
          <div className="w-[9px] h-[9px] bg-yellow-500 mr-2 rounded-full"></div>
          Mumbai Testnet
        </a>
        {!account ? (
          <div
            onClick={() => requestAccount()}
            className="bg-[#153d6f70] text-center w-[130px] text-sm md:text-base md:w-auto px-2 md:px-4 py-2 rounded-2xl cursor-pointer outline outline-[1px] outline-[#191b1f] text-[#5090ea] hover:text-[#5da0ff] border-[1px] border-transparent hover:border-[#3d8be970] transition duration-200"
          >
            Connect Wallet
          </div>
        ) : (
          <div className="bg-[#191b1f] flex items-center rounded-2xl p-[1px]">
            <div
              title={userBalance + " " + (isShowingToken ? "BOW" : "ETH")}
              onClick={() => changeBalance()}
              className="hidden lg:flex rounded-tl-2xl rounded-bl-2xl py-2  cursor-pointer hover:border-gray-600 border-r-[0px] border-l-[1px] border-y-[1px] border-transparent transition duration-200"
            >
              <p className="px-3 select-none max-w-[120px] truncate">
                {userBalance}
              </p>
              <p className="mr-2">{isShowingToken ? "BOW" : "rETH"}</p>
            </div>
            <a
              target="_blank"
              rel="noopenner noreferrer"
              href={`https://mumbai.polygonscan.com/address/${account}`}
              className="px-4 py-2 bg-[#222529] rounded-2xl  cursor-pointer hover:border-gray-600 border-[1px] border-transparent transition duration-200"
            >
              {shortenAddress(account)}
            </a>
          </div>
        )}
        <div
          className="relative"
          ref={dropdownRef}
          onClick={() => {
            isDropDown ? setIsDropDown(false) : setIsDropDown(true);
          }}
        >
          <div className="flex items-center h-10 px-3 bg-[#191b1f] rounded-xl cursor-pointer ml-2 border-[1px] border-transparent transition duration-200 hover:border-gray-600">
            <BsThreeDots className="text-2xl" />
          </div>
          {isDropDown ? (
            <div className="absolute right-0 top-[100%] mt-2 w-48 px-5 py-3 shadow rounded-md shadow-lg bg-[#212429] text-gray-300 font-semibold select-none">
              <a
                href="https://bow-token-faucet.vercel.app/"
                target="_blank"
                rel="noopenner noreferrer"
                className="flex justify-between items-center py-1 hover:text-white"
              >
                <div className="">Faucet</div>
                <FaFaucet className="text-xl" />
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
