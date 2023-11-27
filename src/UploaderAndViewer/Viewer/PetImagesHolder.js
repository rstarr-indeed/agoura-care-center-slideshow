import React, {useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import {database} from "../FirebaseConfigFiles/FirebaseConfig";
import PetImage from "./PetImage";
import "./PetImagesHolder.css";

const PetImagesHolder = ({selectedPet}) => {
    const [images, setImages] = useState(null);

    useEffect(() => {
        setImages(null);

        if (selectedPet) {
            onValue(ref(database, selectedPet.ANIMAL_ID), (snapshot) => {
                const value = snapshot.val();

                if (value != null && Object.keys(value).length > 0) {
                    setImages(Object.keys(value).map((image) => value[image].url));
                }
            });
        }
    }, [selectedPet]);

    if (selectedPet && images) {
        return (
            <div>
                <div>{selectedPet.ANIMAL_NAME}</div>
                <div className={"PetImagesHolder"}>
                    {images.map((imageUrl, index) =>
                        <PetImage url={imageUrl} key={index}/>
                    )
                    }
                </div>
            </div>
        );
    } else if (selectedPet && images == null) {
        return <div>No images currently available.</div>;
    } else {
        return (
            <div>
                Please select a pet.
            </div>
        );
    }
};

export default PetImagesHolder;