import React, { useState } from "react";
import { FadeIn } from "../FadeIn";
import SocialLinksFields from "./SocialLinksFields";
import SocialLinksButton from "./SocialLinksButton";

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: "",
    goal: "1",
    deadline: "30",
    isUpload: true,
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    github: "",
    showSocialLinks: false // New state for showing social links
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "media" && formData.isUpload) {
      setFormData({ ...formData, [name]: e.target.files[0] }); // Handle file upload
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleToggle = () => {
    setFormData({
      ...formData,
      isUpload: !formData.isUpload,
      media: "", // Reset media field when toggling
    });
  }

  const handleToggleSocialLinks = () => {
    setFormData({
      ...formData,
      showSocialLinks: !formData.showSocialLinks
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (e.g., send data to the backend)
    console.log(formData); // For testing, you can log the form data
  };

  return (
    <FadeIn>
      <div className="grid grid-cols-1 max-w-md mx-auto gap-6 p-6 rounded-lg bg-gray-800 my-4">
        <h2 className="text-3xl text-white text-center font-semibold">Create a New Campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-white flex items-center">
              <input
                type="checkbox"
                checked={formData.isUpload}
                onChange={handleToggle}
                className="mr-2"
              />
              Upload File
            </label>

            {formData.isUpload ? (
              <input
                type="file"
                name="media"
                onChange={handleChange}
                accept="image/*, video/*"
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
              />
            ) : (
              <input
                type="url"
                name="media"
                value={formData.media}
                onChange={handleChange}
                placeholder="Enter URL"
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
              />
            )}
          </div>

          <div>
            <label className="text-white">Amount (ETH)</label>
            <input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-white">Deadline (Days)</label>
            <input
              type="number"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
            />
          </div>
            
          <SocialLinksButton onClick={handleToggleSocialLinks} />
          <SocialLinksFields data={formData}onChange={handleChange}/>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-400"
          >
            Create Campaign
          </button>
        </form>
      </div>
    </FadeIn>
  );
};

export default CreateCampaign;