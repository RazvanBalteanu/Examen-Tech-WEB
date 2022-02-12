const INITIAL_STATE = {
    playlistList: [],
    count: 0,
    error: null,
    fetching: false,
    fetched: false
  }
  
  export default function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'GET_PLAYLISTS_PENDING':
      case 'ADD_PLAYLIST_PENDING':
      case 'SAVE_PLAYLIST_PENDING':
      case 'DELETE_PLAYLIST_PENDING':
        return { ...state, error: null, fetching: true, fetched: false }
      case 'GET_PLAYLISTS_FULFILLED':
      case 'ADD_PLAYLIST_FULFILLED':
      case 'SAVE_PLAYLIST_FULFILLED':
      case 'DELETE_PLAYLIST_FULFILLED':
        return { ...state, playlistList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
      case 'GET_PLAYLISTS_REJECTED':
      case 'ADD_PLAYLIST_REJECTED':
      case 'SAVE_PLAYLIST_REJECTED':
      case 'DELETE_PLAYLIST_REJECTED':
        return { ...state, playlistList: [], error: action.payload, fetching: false, fetched: true }
      default:
        return state
    }
  }