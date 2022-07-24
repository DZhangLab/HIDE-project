import { InsertVerifier, GetVerifier, DeleteVerifier } from "../components";

import Verifiers from "../components/verifiers/Verifiers";
import "../css/bootstrap.css";
import { Link } from "react-router-dom";

const VerifierPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Verifier Basic DApp</h1>
        <br></br>
        <InsertVerifier />
        <br></br>
        <GetVerifier />
        <br></br>
        <DeleteVerifier />
        <br></br>
        <Verifiers />
      </header>
    </div>
  );
};

export default VerifierPage;
