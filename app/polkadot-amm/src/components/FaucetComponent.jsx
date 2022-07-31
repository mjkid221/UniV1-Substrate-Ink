import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function FaucetComponent(props) {
  const [amountOfA1, setAmountOfA1] = useState(0);
  const [amountOfA2, setAmountOfA2] = useState(0);

  const onChangeAmountOfA2 = (e) => {
    setAmountOfA2(e.target.value);
  };

  const onChangeAmountOfA1 = (e) => {
    setAmountOfA1(e.target.value);
  };

  // Funds the account with given amount of Tokens
  async function onClickFund() {
    if (props.contract === null || !props?.activeAccount?.address) {
      alert("Connect your wallet");
      return;
    }
    if (["", "."].includes(amountOfA1) || ["", "."].includes(amountOfA2)) {
      alert("Amount should be a valid number");
      return;
    }
    try {
      // console.log(props.contract.tx);
      // await props.contract.query.faucet(
      //   { value: 0, gasLimit: -1 },
      //   amountOfA1 * PRECISION,
      //   amountOfA2 * PRECISION
      // );
      await props.contract.tx
        .faucet(
          { value: 0, gasLimit: -1 },
          amountOfA1 * PRECISION,
          amountOfA2 * PRECISION
        )
        .signAndSend(
          props.activeAccount.address,
          { signer: props.signer },
          async (res) => {
            if (res.status.isFinalized) {
              await props.getHoldings();
              alert("Tx successful");
            }
          }
        );
      alert("Tx submitted");
      setAmountOfA1(0);
      setAmountOfA2(0);
    } catch (err) {
      alert(err);
      console.log(err);
    }
  }

  return (
    <div className="tabBody">
      <div className="tabHeader">Faucet</div>
      <BoxTemplate
        leftHeader={"Amount of A1"}
        right={<div className="coinWrapper">A1</div>}
        value={amountOfA1}
        onChange={(e) => onChangeAmountOfA1(e)}
      />
      <BoxTemplate
        leftHeader={"Amount of A2"}
        right={<div className="coinWrapper">A2</div>}
        value={amountOfA2}
        onChange={(e) => onChangeAmountOfA2(e)}
      />
      <div className="bottomDiv">
        <div className="btn" onClick={() => onClickFund()}>
          Fund
        </div>
      </div>
    </div>
  );
}
