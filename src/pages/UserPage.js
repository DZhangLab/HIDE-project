import {
  Insert,
  GetEntry,
  GetTotalEntries,
  DeleteEntry,
  QRCode,
  UpdateEntry,
  CheckUser,
} from "../components";
import "../css/bootstrap.css";
import { Link } from "react-router-dom";

const UserPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>User Registry Basic DApp</h1>
        <br></br>
        <Insert />
        <br></br>
        <CheckUser />
        <br></br>
        <GetEntry />
        <br></br>
        <DeleteEntry />
        <br></br>
        <GetTotalEntries />
      </header>
    </div>
  );
};

export default UserPage;
