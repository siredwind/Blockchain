const socialMediaArray = [
    "facebook", 
    "instagram", 
    "tiktok", 
    "youtube", 
    "twitter", 
    "github"
];

const SocialLinksFields = ({ data, onChange }) => {
    return (
        <>
            {data.showSocialLinks && (
                <div className="space-y-4 mt-4">
                    {/* Map through each social media field */}
                    {socialMediaArray.map((socialMedia) => (
                        <div key={socialMedia}>
                            <label className="text-white capitalize">{socialMedia}</label>
                            <input
                                type="url"
                                name={socialMedia}
                                value={data[socialMedia]}
                                onChange={onChange}
                                placeholder={`Enter ${socialMedia} URL`}
                                className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default SocialLinksFields;