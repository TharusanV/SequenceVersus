import { HashRouter, Routes, Route } from "react-router-dom";

import { Lobby } from "./components";

function App() {

  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Lobby />} />

        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
