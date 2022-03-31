import "../css/bootstrap.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Home Page</h1>
        <Link to="/ur">
          <li>User Registry</li>
        </Link>
        <Link to="/cr">
          <li>Consumer Registry</li>
        </Link>
      </header>
    </div>
  );
};

export default Home;
