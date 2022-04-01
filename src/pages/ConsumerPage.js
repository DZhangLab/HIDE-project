import { InsertConsumer, GetConsumer, UpdateConsumer, DeleteConsumer, VerifyAttestationWithSig, TotalConsumers } from "../components";
import "../css/bootstrap.css";
import { Link } from "react-router-dom";

const ConsumerPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Consumer Registry Basic DApp</h1>
        <Link to="/">
          <p>back</p>
        </Link>
        <br></br>
        <InsertConsumer></InsertConsumer>
        <br></br>
        <GetConsumer></GetConsumer>
        <br></br>
        <UpdateConsumer></UpdateConsumer>
        <br></br>
        <DeleteConsumer></DeleteConsumer>
        <br></br>
        <TotalConsumers></TotalConsumers>
        <br></br>
        <VerifyAttestationWithSig></VerifyAttestationWithSig>
        <br></br>
      </header>
    </div>
  );
};

export default ConsumerPage;
