import {
    InsertVerifier,
    GetVerifier,
    DeleteVerifier
  } from "../components";
  import "../css/bootstrap.css";
  import { Link } from "react-router-dom";
  
  const VerifierPage = () => {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Verifier Basic DApp</h1>
          <br></br>
          <InsertVerifier/>
          <br></br>
          <GetVerifier/>
          <br></br>
          <DeleteVerifier/>
        </header>
      </div>
    );
  };
  
  export default VerifierPage;
  