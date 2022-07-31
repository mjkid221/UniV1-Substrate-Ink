import { useEffect, useState } from "react";
import "../styles.css";
import SwapComponent from "./SwapComponent";
import ProvideComponent from "./ProvideComponent";
import WithdrawComponent from "./WithdrawComponent";
import FaucetComponent from "./FaucetComponent";
import AccountComponent from "./AccountComponent";
import { PRECISION } from "../constants";
import { MdSwapVert } from "react-icons/md";
import { GiWaterDrop } from "react-icons/gi";
import { RiRefundFill, RiHandCoinFill, RiWallet3Fill } from "react-icons/ri";

export default function ContainerComponent(props) {
  const activeTab = props.selectedTab;
  const setActiveTab = props.setActiveTab;
  const [amountOfA1, setAmountOfA1] = useState(0);
  const [amountOfA2, setAmountOfA2] = useState(0);
  const [amountOfShare, setAmountOfShare] = useState(0);
  const [totalA1, setTotalA1] = useState(0);
  const [totalA2, setTotalA2] = useState(0);
  const [totalShare, setTotalShare] = useState(0);
  const [tradingFees, setTradingFees] = useState(0);

  useEffect(() => {
    getHoldings();
  });

  // Fetch the pool details and personal assets details.
  async function getHoldings() {
    if (props.contract === null || !props?.activeAccount?.address) {
      return;
    }
    try {
      await props.contract.query
        .getMyHoldings(props.activeAccount.address, { value: 0, gasLimit: -1 })
        .then((res) => {
          if (res.result.toHuman().Err)
            throw new Error(res.result.toHuman().Err.Module.message);
          else return res.output.toHuman();
        })
        .then((res) => {
          setAmountOfA1(res[0].replace(/,/g, "") / PRECISION);
          setAmountOfA2(res[1].replace(/,/g, "") / PRECISION);
          setAmountOfShare(res[2].replace(/,/g, "") / PRECISION);
        })
        .catch((err) => {
          console.log("Couldn't fetch asset details :-", err);
          alert(err);
        });
      await props.contract.query
        .getPoolDetails(props.activeAccount.address, { value: 0, gasLimit: -1 })
        .then((res) => {
          if (res.result.toHuman().Err)
            throw new Error(res.result.toHuman().Err.Module.message);
          else return res.output.toHuman();
        })
        .then((res) => {
          setTotalA1(res[0].replace(/,/g, "") / PRECISION);
          setTotalA2(res[1].replace(/,/g, "") / PRECISION);
          setTotalShare(res[2].replace(/,/g, "") / PRECISION);
          setTradingFees(res[3].replace(/,/g, "") / 10);
        })
        .catch((err) => {
          console.log("Couldn't fetch pool details :-", err);
        });
    } catch (err) {
      console.log("Couldn't Fetch holdings", err);
    }
  }

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { name: "Swap", icon: <MdSwapVert className="swapIcon" /> },
    { name: "Provide", icon: <GiWaterDrop className="provideIcon" /> },
    { name: "Withdraw", icon: <RiRefundFill className="withdrawIcon" /> },
    { name: "Faucet", icon: <RiHandCoinFill className="faucetIcon" /> },
    { name: "Account", icon: <RiWallet3Fill className="accountIcon" /> },
  ];

  return (
    <div className="centerBody">
      <div className="selectTab">
        {tabs.map((tab) => {
          return (
            <div
              tabIndex={0}
              className={
                "tabStyle " + (activeTab === tab.name ? "activeTab" : "")
              }
              onClick={() => changeTab(tab.name)}
            >
              <div
                className={
                  activeTab === tab.name ? "activeTabIcon" : "tabIcon "
                }
              >
                {tab.icon}
              </div>
              <div
                className={
                  "tabName " + (activeTab === tab.name ? "activeTabName" : "")
                }
              >
                {tab.name}
              </div>
            </div>
          );
        })}
      </div>
      <div className="centerContainer">
        {activeTab === "Swap" && (
          <SwapComponent
            contract={props.contract}
            getHoldings={() => getHoldings()}
            activeAccount={props.activeAccount}
            signer={props.signer}
            holding={{ amountOfA1, amountOfA2, tradingFees }}
          />
        )}
        {activeTab === "Provide" && (
          <ProvideComponent
            contract={props.contract}
            getHoldings={() => getHoldings()}
            activeAccount={props.activeAccount}
            signer={props.signer}
            holding={{ amountOfA1, amountOfA2 }}
          />
        )}
        {activeTab === "Withdraw" && (
          <WithdrawComponent
            contract={props.contract}
            maxShare={amountOfShare}
            getHoldings={() => getHoldings()}
            activeAccount={props.activeAccount}
            signer={props.signer}
          />
        )}
        {activeTab === "Faucet" && (
          <FaucetComponent
            contract={props.contract}
            getHoldings={() => getHoldings()}
            activeAccount={props.activeAccount}
            signer={props.signer}
          />
        )}
        {activeTab === "Account" && (
          <AccountComponent
            contract={props.contract}
            getHoldings={() => getHoldings()}
            activeAccount={props.activeAccount}
            signer={props.signer}
            setActiveAccount={props.setActiveAccount}
            connect={() => props.connect()}
            holding={{
              amountOfA1,
              amountOfA2,
              amountOfShare,
              totalShare,
              totalA1,
              totalA2,
              tradingFees,
            }}
          />
        )}
      </div>
    </div>
  );
}
