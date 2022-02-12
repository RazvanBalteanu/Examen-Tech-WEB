import { SERVER } from "../config/global";

export const getPlaylists = (
  filterString, page, pageSize, sortField, sortOrder
) => {
  return {
    type: "GET_PLAYLISTS",
    payload: async () => {
      const response = await fetch(
        `${SERVER}/playlists?${filterString}&sortField=${
          sortField || ""
        }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
          pageSize || ""
        }`
      );
      const data = await response.json();
      return data;
    },
  };
};

export const addPlaylist = (
  playlist, filterString, page, pageSize, sortField, sortOrder
) => {
  return {
    type: "ADD_PLAYLIST",
    payload: async () => {
      let response = await fetch(`${SERVER}/playlists`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlist),
      });
      response = await fetch(
        `${SERVER}/playlists?${filterString}&sortField=${
          sortField || ""
        }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
          pageSize || ""
        }`
      );
      const data = await response.json();
      return data;
    },
  };
};

export const savePlaylist = (
  id, playlist, filterString, page, pageSize, sortField, sortOrder
) => {
  return {
    type: "SAVE_PLAYLIST",
    payload: async () => {
      let response = await fetch(`${SERVER}/playlists/${id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlist),
      });
      response = await fetch(
        `${SERVER}/playlists?${filterString}&sortField=${
          sortField || ""
        }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
          pageSize || ""
        }`
      );
      const data = await response.json();
      return data;
    },
  };
};

export const deletePlaylist = (
  id, filterString, page, pageSize, sortField, sortOrder
) => {
  return {
    type: "DELETE_PLAYLIST",
    payload: async () => {
      let response = await fetch(`${SERVER}/playlists/${id}`, {
        method: "delete",
      });
      response = await fetch(
        `${SERVER}/playlists?${filterString}&sortField=${
          sortField || ""
        }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${
          pageSize || ""
        }`
      );
      const data = await response.json();
      return data;
    },
  };
};


export const getSongs = (playlistId) => {
  return {
    type: "GET_SONGS",
    payload: async () => {
      const response = await fetch(`${SERVER}/playlists/${playlistId}/songs`);
      const data = await response.json();
      return data;
    },
  };
};

export const addSong = (playlistId, song) => {
  return {
    type: "ADD_SONG",
    payload: async () => {
      let response = await fetch(`${SERVER}/playlists/${playlistId}/songs`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(song),
      });
      response = await fetch(`${SERVER}/playlists/${playlistId}/songs`);
      const data = await response.json();
      return data;
    },
  };
};



