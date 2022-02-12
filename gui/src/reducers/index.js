import { combineReducers } from 'redux'
import playlist from './PLAYLISTS-reducer'
import song from './SONG-reducer'

export default combineReducers({
  playlist, song
})