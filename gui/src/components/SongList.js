import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getSongs,
  addSong
} from "../actions";

const songSelector = (state) => state.song.songList;

function SongList() {
  const [isDialogShown, setIsDialogShown] = useState(false);
  const [title, setTitlu] = useState("");
  const [url, setLink] = useState("");
  const [stil, setStil] = useState("");
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [selectedSongs, setSelectedSongs] = useState(null);
  const navigate = useNavigate();
  const songs = useSelector(songSelector);

  const dispatch = useDispatch();
  const { playlistId } = useParams();

  useEffect(() => {
    dispatch(getSongs(playlistId));
  }, [playlistId]);

  const handleAddClick = (evt) => {
    setIsDialogShown(true);
    setIsNewRecord(true);
    setTitlu("");
    setLink("");
    setStil("");
  };

  const hideDialog = () => {
    setIsDialogShown(false);
  };

  const handleSaveClick = () => {
    if (isNewRecord) {
      if (title.length >= 5 && stil != null && url!=null) {
        dispatch(addSong(playlistId, { title,url, stil }));
        toast.success("Melodie adaugata!");
        setIsDialogShown(false);
        setSelectedSongs(null);
        setTitlu("");
        setLink("");
        setStil("");
      } else {
        if (title.length < 5) {
          toast.error("Titlul trebuie sa aiba cel putin 5 caractere!");
        } else if (stil == null) {
          toast.error("Selectati un stil!!");
        }else if (url == null) {
          toast.error("Adaugati url un rol!!");
        }
      }
    } 
  };


  const redirect = () => {
    navigate(`/`);
  };

  const tableFooter = (
    <div className="flex justify-content-around">
      <Button 
        label="Adauga o melodie"
        icon="pi pi-plus"
        onClick={handleAddClick}
      />
      <Button 
        label="Inapoi la lista de playlist-uri"
        icon="pi pi-sign-out"
        onClick={redirect}
      />
    </div>
  );

  const dialogFooter = (
    <div>
      <Button 
        label="Salveaza melodia"
        icon="pi pi-save"
        onClick={handleSaveClick}
      />
    </div>
  );


  const options = [
    { value: "POP", label: "POP" },
    { value: "ALTERNATIVE", label: "ALTERNATIVE" },
  ];

  return (
    <div>
      <ToastContainer />
      <div>
          <h3>Lista melodiilor:</h3>
      </div>
      <DataTable value={songs} footer={tableFooter} lazy>
        <Column header="Titlu" field="title" />
        <Column header="Link" field="url" />
        <Column header="Stil" field="stil" />
      </DataTable>
      <Dialog
        header="Melodie"
        visible={isDialogShown}
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div>
          <InputText className="mb-2"
            placeholder="Titlu"
            onChange={(evt) => setTitlu(evt.target.value)}
            value={title}
          />
        </div>
        <div>
          <InputText className="mb-2"
            placeholder="Link"
            onChange={(evt) => setLink(evt.target.value)}
            value={url}
          />
        </div>
        <div>
          <SelectButton
            options={options}
            value={stil}
            onChange={(evt) => setStil(evt.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default SongList;
