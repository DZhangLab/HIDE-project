import "./App.css";
import { Insert, GetEntry, GetTotalEntries, DeleteEntry } from "./components";
import "./css/bootstrap.css";

const App = () => {
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

export default App;
