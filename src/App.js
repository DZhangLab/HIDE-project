import "./App.css";
import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import ConsumerPage from "./pages/ConsumerPage";
import logo from "./images/hidelogo.png";
import "./css/bootstrap.css";
import { Navbar, Nav } from "react-bootstrap";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>
            <img width="75px" src={logo} />
          </Navbar.Brand>
          <Nav>
            <div class="container">
              <div class="row">
                <div class="col-sm">
                  <Link to="/">
                    <h3> Home</h3>
                  </Link>
                </div>
                <div class="col-sm">
                  <Link to="/ur">
                    <h3>User Registry</h3>
                  </Link>
                </div>
                <div class="col-sm">
                  <Link to="/cr">
                    <h3>Consumer Registry</h3>
                  </Link>
                </div>
              </div>
            </div>
          </Nav>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ur" element={<UserPage />} />
          <Route path="/cr" element={<ConsumerPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
