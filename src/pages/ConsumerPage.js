import { InsertConsumer } from "../components";
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
      </header>
    </div>
  );
};

export default ConsumerPage;
