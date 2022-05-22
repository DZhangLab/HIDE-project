import "../css/bootstrap.css";

import { useState } from "react";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

const client = create("https://ipfs.infura.io:5001/api/v0");



const IpfsPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [url, setUrl] = useState("")
  const [json, setJson] = useState({})

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
      
    };
  
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const buf = Buffer.from(file);
      const created = await client.add(buf);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setResult(url);
    } catch (error) {
      console.log(error.message);
    }
  };

 
  function retreiveJson() {
    console.log(url)
    return fetch(`${url}`)
    .then((response) => response.json())
    .then((responseJson) => {
      setJson(responseJson)
    })
    .catch((error) => {
      console.error(error);
    });
 }

  return (
    <div className="App">
      <header className="App-header">
        IPFS Sample Upload and Link with API
      </header>

      <div className="main">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={retrieveFile} />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
        <div>
          {result ? (
            <a href={result} style={{ color: "#000" }}>
              Access file using hash
            </a>
          ) : null}
        </div>

        <br />
        {result}
      </div>
      <header className="App-header">
        Rendering a JSON Object with URL
      </header>
      <input
          type="text"
          required
          placeholder="URL"
          onChange={(e) => setUrl(e.target.value)}
        />
         <button className="btn btn-outline-secondary" onClick={retreiveJson}>
            Render JSON
          </button>
          <div>
            <h4>JSON Object Rendered (string)</h4>
            {JSON.stringify(json)}
          </div>
    </div>
  );
};

export default IpfsPage;
