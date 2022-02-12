const INITIAL_STATE = {
    songList: [],
    count: 0,
    error: null,
    fetching: false,
    fetched: false
  }
  
  export default function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'GET_SONGS_PENDING':
      case 'ADD_SONG_PENDING':
        return { ...state, error: null, fetching: true, fetched: false }
      case 'GET_SONGS_FULFILLED':
      case 'ADD_SONG_FULFILLED':
        return { ...state, songList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
      case 'GET_SONGS_REJECTED':
      case 'ADD_SONG_REJECTED':
        return { ...state, songList: [], error: action.payload, fetching: false, fetched: true }
      default:
        return state
    }
  }