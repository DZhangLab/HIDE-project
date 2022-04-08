import "../css/bootstrap.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div class="container">
      <div className="App">
        <header class="text-left">
          <h1 class="text-center">Home</h1>
          <div class="card">
            <h5 class="card-header">GitHub</h5>
            <div class="card-body">
              <h5 class="card-title">About the repository</h5>
              <p class="card-text">Here is the GitHub...</p>
              <a href="https://github.com/DZhangLab" class="btn btn-primary">
                DZhangLab GitHub
              </a>
            </div>
          </div>
          <br></br>
          <p>
            HIDE Lab’s mission is to develop a decentralized rare disease
            identity system (RDIS) to provide participants of rare disease
            communities—and beyond—with uniform representations and management
            of their identities used in clinical communications. This
            infrastructure will increase the security and interoperability of
            patient data significantly reducing the financial and social costs
            of identity mismatching related medical errors. The project will
            consist of three parts: a standardized patient identity model, the
            RDIS infrastructure for sharing and managing of data, and an
            integrated evaluation to assess the solution’s efficac
          </p>
          <br></br>
          <p>
            In case nav bar is not functional, can access the regristries here:
          </p>

          <Link to="/ur" style={{ color: "#000" }}>
            User Registry
          </Link>
          <br></br>
          <Link to="/cr" style={{ color: "#000" }}>
            Consumer Registry
          </Link>
        </header>
      </div>

    </div>
  );
};

export default Home;
