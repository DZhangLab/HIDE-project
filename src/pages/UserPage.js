import {
  Insert,
  GetEntry,
  GetTotalEntries,
  DeleteEntry,
  QRCode,
  UpdateEntry,
} from "../components";
import "../css/bootstrap.css";
import { Link } from "react-router-dom";

const UserPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>User Registry Basic DApp</h1>
        <br></br>
        <Insert></Insert>
        <br></br>
        <GetEntry></GetEntry>
        <br></br>
        <DeleteEntry></DeleteEntry>
        <br></br>
        <GetTotalEntries></GetTotalEntries>
      </header>
    </div>
  );
};

export default UserPage;
