
const News = () => {
    return <div className="flex w-full flex-col items-start gap-x-8 gap-y-8 bg-[#131315] px-12 py-10 rounded-3xl max-mdd:max-w-none max-md:p-8 my-2">
        <h3 className="max-md:text-[32px] max-md:leading-10 max-md:tracking-[-0.01em]">
            Latest news.{" "}
            <span className="text-[#8a8a93]">
                {" "}
                Join the newsletter.
            </span>
        </h3>
    </div>
}

export default News;