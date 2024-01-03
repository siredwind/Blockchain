const Campaign = () => {
    return (
        <div className="flex w-full max-w-[746px] flex-col items-start gap-x-8 gap-y-8 bg-[#131315] px-12 py-10 rounded-3xl max-mdd:max-w-none max-md:p-8">
            <img
                src="campaign-thumbnail.jpg" // Replace with your campaign image URL
                alt="Campaign Thumbnail"
                className="w-full rounded-xl"
            />
            <h2 className="text-center text-white text-xl font-bold">Campaign 1</h2>
            <div className="flex items-center justify-center text-white gap-4">
                {/* Icon representing likes */}
                <div className="flex items-center">
                    <img src="like-icon.png" alt="Like" className="w-6 h-6" />
                    <span className="text-sm">123</span>
                </div>
                {/* Icon representing comments */}
                <div className="flex items-center">
                    <img src="comment-icon.png" alt="Comment" className="w-6 h-6" />
                    <span className="text-sm">45</span>
                </div>
                {/* Icon representing funds raised */}
                <div className="flex items-center">
                    <img src="fund-icon.png" alt="Funds Raised" className="w-6 h-6" />
                    <span className="text-sm">$1000</span>
                </div>
            </div>
        </div>
    )
}

export default Campaign;