import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getPlaylists,
  addPlaylist,
  savePlaylist,
  deletePlaylist,
} from "../actions";

const playlistSelector = (state) => state.playlist.playlistList;
const playlistCountSelector = (state) => state.playlist.count;

function PlaylistList() {
  const [isDialogShown, setIsDialogShown] = useState(false);
  const [descriere, setDescriere] = useState("");
  const [data, setData] = useState("");
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [filterString, setFilterString] = useState("");
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  const [page, setPage] = useState(0);
  const [first, setFirst] = useState(0);

  const playlists = useSelector(playlistSelector);
  const count = useSelector(playlistCountSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPlaylists(filterString, page, 4, sortField, sortOrder));
  }, [filterString, page, sortField, sortOrder]);

  const handleAddClick = (evt) => {
    setIsDialogShown(true);
    setIsNewRecord(true);
    setDescriere("");
    setData("");
  };

  const hideDialog = () => {
    setIsDialogShown(false);
  };

  const handleSaveClick = () => {
    if (isNewRecord) {
      if (descriere.length >= 3) {
        dispatch(addPlaylist({ descriere, data}));
        toast.success("Playlistul a fost adaugat!");
        setIsDialogShown(false);
        setSelectedPlaylist(null);
        setDescriere("");
        setData("");
      } else {
        if (descriere.length < 3) {
          toast.error("Descrierea trebuie sa aiba cel putin 3 caractere!");
        }
      }
    } else {
        if (descriere.length >= 3) {
        dispatch(
          savePlaylist(selectedPlaylist, { descriere, data})
        );
        toast.success("Playlistul a fost actualizat!");
        setIsDialogShown(false);
        setSelectedPlaylist(null);
        setDescriere("");
        setData("");
      } else {
        if (descriere.length < 3) {
            toast.error("Descrierea trebuie sa aiba cel putin 3 caractere!");
          } 
      }
    }
  };

  const editPlaylist = (rowData) => {
    setSelectedPlaylist(rowData.id);
    setDescriere(rowData.descriere);
    setData(rowData.data);
    setIsDialogShown(true);
    setIsNewRecord(false);
  };

  const handleDeletePlaylist = (rowData) => {
    dispatch(deletePlaylist(rowData.id));
    toast.success("Playlistul a fost sters!");
  };

  const redirect = (rowData) => {
    setSelectedPlaylist(rowData.id);
    navigate(`/playlists/${rowData.id}/songs`);
  };

  const tableFooter = (
    <div className="flex justify-content-around">
      <Button label="Adauga Playlist" icon="pi pi-plus" onClick={handleAddClick} />
    </div>
  );

  const dialogFooter = (
    <div>
      <Button label="Salveaza Playlist" icon="pi pi-save" onClick={handleSaveClick} />
    </div>
  );

  const opsColumn = (rowData) => {
    return (
      <>
        <Button className="mx-3"
          label="Editeaza Playlist"
          icon="pi pi-pencil"
          onClick={() => editPlaylist(rowData)}
        />
        <Button className="mx-3"
          label="Sterge Playlist"
          icon="pi pi-times"
          className="p-button p-button-danger"
          onClick={() => handleDeletePlaylist(rowData)}
        />
        <Button className="mx-3"
          label="Vezi melodii"
          icon="pi pi-eye"
          onClick={() => redirect(rowData)}
        />
      </>
    );
  };

  const handlePageChange = (evt) => {
    setPage(evt.page);
    setFirst(evt.page * 4);
  };

  const handleSort = (evt) => {
    console.warn(evt);
    setSortField(evt.sortField);
    setSortOrder(evt.sortOrder);
  };

  return (
    <div className="flex flex-column">
      <ToastContainer />
      <div>
          <h3>Lista Playlist-urilor:</h3>
      </div>
      <DataTable
        value={playlists}
        footer={tableFooter}
        lazy
        paginator
        onPage={handlePageChange}
        first={first}
        rows={4}
        totalRecords={count}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      >
        <Column
          header="Descriere"
          field="descriere"
        />
        <Column
          header="Data"
          field="data"
          sortable
        />

        <Column body={opsColumn} />
      </DataTable>
      <Dialog
        header="Playlist"
        visible={isDialogShown}
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div>
          <InputText className="mb-2"
            placeholder="Descriere"
            onChange={(evt) => setDescriere(evt.target.value)}
            value={descriere}
          />
        </div>
        <div>
          <InputText className="mb-2"
            placeholder="Data"
            onChange={(evt) => setData(evt.target.value)}
            value={data}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default PlaylistList;
