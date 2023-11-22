import React, {useState} from "react";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "./FirebaseConfigFiles/FirebaseConfig";
import {FileUploader} from "react-drag-drop-files";

const UploaderComponent = () => {
    // State to store uploaded file
    const [files, setFiles] = useState([]);
    const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

    const [percent, setPercent] = useState(0);

    const handleChange = (newFiles) => {
        const values = Object.keys(newFiles);
        const newFileArray = [];
        values.forEach((fileNumber) => {
            newFileArray.push(newFiles[fileNumber]);
        });
        setFiles(oldFiles => [...oldFiles, ...newFileArray]);
    };

    const handleUpload = () => {
        if (!files) {
            alert("Please upload an image first!");
        }

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.]
        files.forEach((file) => {
            const storageRef = ref(storage, `/files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    // update progress
                    setPercent(percent);
                },
                (err) => console.log(err),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        console.log(url);
                    });
                }
            );
        });

        setFiles([]);
    };

    return (
        <div>
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} label={"Upload your pictures"}
                          multiple={true}/>
            {files.map((file, index) => <div key={index}>{index} - {file.name}</div>)}
            <button onClick={handleUpload}>Submit Files</button>
            <p>{percent} "% done"</p>
        </div>
    );
};

export default UploaderComponent;