import { useState, useEffect } from "react";
import { fetchMetadataFromIPFS } from "../ipfsUtils";

const useFetchVideoUrl = (campaign) => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoError, setVideoError] = useState(null);
    const [videoIsLoading, setVideoIsLoading] = useState(false);

    useEffect(() => {
        const fetchMetadata = async () => {
            setVideoIsLoading(true);
            try {
                const videoHash = await fetchMetadataFromIPFS(campaign.url);

                if (videoHash)
                    setVideoUrl(videoHash);
            }
            catch (error) {
                setVideoError('Error fetching metadata:', error);
            }
            finally {
                setVideoIsLoading(false);
            }
        };

        fetchMetadata();
    }, [campaign.url]);

    return { videoUrl: videoUrl, videoIsLoading: videoIsLoading, videoError: videoError };
}

export default useFetchVideoUrl;