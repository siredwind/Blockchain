
const SocialLinksButton = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-400 flex justify-center items-center"
        >
            Social Links
        </button>
    )
}

export default SocialLinksButton;