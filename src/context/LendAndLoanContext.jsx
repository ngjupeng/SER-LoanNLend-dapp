import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  loanAbi,
  loanContractAddress,
  tokenAbi,
  tokenContractAddress,
} from "../utils/constants";

export const LendAndLoanContext = createContext();

export const LendAndLoanProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [networkId, setNetworkId] = useState();
  const [contractLiquidity, setContractLiquidity] = useState();
  const [isSupportMetaMask, setIsSupportMetaMask] = useState(false);
  let provider;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = undefined;
  }

  const requestAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };
  const getLoanContract = (providerOrSigner) => {
    const loanContract = new ethers.Contract(
      loanContractAddress,
      loanAbi,
      providerOrSigner
    );
    return loanContract;
  };
  const getTokenContract = (providerOrSigner) => {
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenAbi,
      providerOrSigner
    );
    return tokenContract;
  };
  const getAccBalance = async () => {
    if (provider) {
      if (account) {
        let balance = await provider.getBalance(account);
        return Number(ethers.utils.formatEther(balance.toString())).toFixed(2);
      }
    }
  };
  const getUserOngoingLend = async () => {
    let arr = [];
    if (provider) {
      const contract = getLoanContract(provider.getSigner());
      if (account) {
        const lends = await contract.getUserNotRetrieveLend();

        lends.forEach((item) => {
          if (item.lender != "0x0000000000000000000000000000000000000000") {
            arr.push(item);
          }
        });
      }
      return arr;
    }
  };
  const getUserOngoingLoan = async () => {
    if (provider) {
      const contract = getLoanContract(provider.getSigner());
      if (account) {
        const loans = await contract.getUserOngoingLoans();
        return loans;
      }
    }
  };
  const setContractTotalLiquidity = async () => {
    if (provider) {
      const contract = getLoanContract(provider);
      const res = await contract.totalLiquidity();
      setContractLiquidity(
        Number(ethers.utils.formatEther(res.toString())).toFixed(3)
      );
    }
  };
  const loadWeb3 = async () => {
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      setIsSupportMetaMask(true);
    } else {
      setIsSupportMetaMask(false);
    }
  };
  const handleStartUp = async () => {
    if (typeof window.ethereum != undefined) {
      const acc = await provider.listAccounts();
      if (acc) {
        setAccount(acc[0]);
      }
      setContractTotalLiquidity();
      setNetworkId(window.ethereum.networkVersion);
      window.ethereum.on("chainChanged", function (networkId) {
        // Time to reload your interface with the new networkId
        setNetworkId(networkId);
      });
      window.ethereum.on("accountsChanged", async function (acc) {
        if (acc) {
          // changed account
          setAccount(acc[0]);
        } else {
          // disconnect
          setAccount([]);
        }
      });
    }
  };
  useEffect(async () => {
    await loadWeb3();
    await handleStartUp();
    await getAccBalance();
    await getUserOngoingLoan();
    await getUserOngoingLend();
  }, [account]);
  return (
    <LendAndLoanContext.Provider
      value={{
        requestAccount,
        account,
        provider,
        getLoanContract,
        networkId,
        getTokenContract,
        getAccBalance,
        getUserOngoingLend,
        getUserOngoingLoan,
        contractLiquidity,
        setContractTotalLiquidity,
        isSupportMetaMask,
      }}
    >
      {children}
    </LendAndLoanContext.Provider>
  );
};
