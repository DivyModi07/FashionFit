import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/users/hello-api/")
      .then(response => setMessage(response.data.message))
      .catch(error => setMessage("Error: " + error.message));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Django + React Test</h1>
      <p className="mt-4">{message}</p>
    </div>
  );
}

export default App;