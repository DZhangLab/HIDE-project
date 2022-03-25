import "./App.css";
import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import ConsumerPage from "./pages/ConsumerPage";
import "./css/bootstrap.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
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
