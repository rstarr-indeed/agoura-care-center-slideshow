import {storage} from "../FirebaseConfigFiles/FirebaseConfig";
import {getDownloadURL, ref} from "firebase/storage";
import loadingGif from "../../Images/loadingDial.gif";

const FILE_EXTENSION = "_200x200.";
const getAnimalImageURLFromFilenameAndId = async (filename, animalId, thumbnail = false) => {
    const thumbnailFolder = thumbnail ? "Thumbnails/" : "";
    const updatedFilename = thumbnail ? filename.split(".")[0] + FILE_EXTENSION + filename.split(".")[1] : filename;
    return getDownloadURL(ref(storage, `${animalId}/${thumbnailFolder}${updatedFilename}`));
};

const getAnimalImageURL = (image, thumbnail = false) => {
    if (thumbnail && (image?.fileName === undefined || image?.animalId === undefined)) {
        return Promise.resolve(loadingGif);
    } else if (image?.fileName !== undefined && image?.animalId !== undefined) {
        return getAnimalImageURLFromFilenameAndId(image.fileName, image.animalId, thumbnail);
    } else if (image?.url !== undefined) {
        return Promise.resolve(image.url);
    } else {
        return "";
    }
};

export default getAnimalImageURL;