import React, { useState } from 'react'
import { auth, database, storage } from '../../firebase'
import './style.css'
import { TextField, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default function Add({ handleClose }) {

    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0);
    const [bookName, setBookName] = useState(null)
    const [fileName, setFileName] = useState(null)

    const handleChange = (e) => {
        if (
            e.target.files[0] &&
            (e.target.files[0].name.toLowerCase().includes(".pdf"))
        ) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name)
            var selectedFile = URL.createObjectURL(e.target.files[0]);
        } else {
            console.log('file not supported')
        }
    };

    const handleUpload = () => {
        if (file && bookName) {
            let fileID = makeid(10);
            let fileName = `${fileID}.pdf`;
            let path = `${auth?.currentUser?.uid}/${fileName}`
            const uploadTask = storage.ref(path).put(file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                    document.getElementById("uploadBtn").disabled = true;
                    document.getElementById(
                        "uploadBtn"
                    ).innerHTML = `Uploading ${progress}`;
                },
                (error) => {
                    console.log(error);
                    setProgress(0);
                    setFile(null);
                    alert(error)
                    handleClose()
                },
                () => {
                    storage
                        .ref(`/${auth?.currentUser?.uid}`)
                        .child(`${fileName}`)
                        .getDownloadURL()
                        .then((fileURL) => {
                            database.ref(`/Users/${auth?.currentUser?.uid}/Books/${fileID}`).set({
                                timestamp: Date.now(),
                                bookURL: fileURL,
                                uid: auth?.currentUser?.uid,
                                id: fileID,
                                bookName: bookName
                            }).then(() => console.log('Added to database')).catch((e) => console.log(e))
                        });
                    setProgress(0);
                    setFile(null);
                    handleClose()
                }
            );
        };
    }

    const handleCancel = () => {
        setProgress(0)
        setBookName('')
        setFile(null)
        setFileName('')
    }

    return (
        <div>
            <div className="createPost">
                <div className="createPost__loggedIn">
                    {!file &&
                        <center>
                            <div className="createPost__imageUpload">
                                <label htmlFor="createPost" style={{ cursor: "pointer" }}>
                                    <AddCircleOutlineIcon color='success' style={{ fontSize: '35px' }} />
                                </label>
                                <input
                                    type="file"
                                    id="createPost"
                                    accept="pdf/*"
                                    onChange={handleChange}
                                ></input>
                            </div>
                        </center>
                    }
                    {fileName && <div className='input_filename'>File name: {fileName}</div>}
                    {file && <TextField fullWidth color='success' label="Enter Book Name" variant="standard" value={bookName} onChange={(e) => setBookName(e.target.value)} />}
                    {file && (
                        <>
                            <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
                                <Button
                                    variant='contained'
                                    size="md"
                                    id="uploadBtn"
                                    onClick={handleUpload}
                                    color={file ? 'success' : 'gray'}
                                    disabled={!bookName ? true : false}
                                >
                                    Upload
                                </Button>
                            </div>
                            <div>
                                <div className="d-grid gap-2" style={{ marginTop: "10px" }}>
                                    <Button
                                        variant='outlined'
                                        size="md"
                                        onClick={handleCancel}
                                        color={file ? 'success' : 'gray'}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
