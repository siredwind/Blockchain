import axios from 'axios';
import { MetadataTemplate } from "./constants";

export const pinFileToIPFS = async (file, fileName) => {
    const formData = new FormData();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({ name: fileName });

    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`
            }
        });

        return res.data.IpfsHash;
    }
    catch (error) {
        console.log(error);
        return;
    }
};

export const generateIdFromHash = (hash) => {
    return hash.substring(0, 32).toLowerCase();
};

export const generateMetadata = (data, hash) => {
    const { attributes } = { ...MetadataTemplate };
    return {
        id: generateIdFromHash(hash),
        name: data.title,
        description: data.description,
        video: hash,
        edition: 1,
        date: Date.now(),
        attributes: attributes
    }
}