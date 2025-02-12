import { HashRouter, Routes, Route } from "react-router-dom";

import { Home, GameLobby } from "./components";

function App() {

  return (
    <HashRouter>
      <div>
        <Routes>
          {/*<Route path="/" element={<Home />} />*/}
          <Route path="/" element={<GameLobby />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
