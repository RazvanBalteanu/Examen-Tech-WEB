import PlaylistList from "./PlaylistList";
import { Routes, Route, HashRouter } from "react-router-dom";
import SongList from "./SongList";

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
        <Route
            path="/"
            element={<PlaylistList/>}
          />
          <Route
            path="/playlists/:playlistId/songs"
            element={<SongList/>}
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
