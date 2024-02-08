import React, { useState } from "react";

// Components
import { FadeIn } from "../FadeIn";
import SocialLinksFields from "./SocialLinksFields";
import ToggleButton from "../common/Button/ToggleButton";
import SubmitButton from "../common/Button/SubmitButton";

// Utils
import {
  InitCampaignData,
  InitSocialLinks
} from "../../utils/constants";
import useCampaignCreate from "../../utils/hooks/useCampaignCreate";

const CreateCampaign = () => {
  const [formData, setFormData] = useState({ ...InitCampaignData });
  const [socialLinks, setSocialLinks] = useState({ ...InitSocialLinks });
  const [showSocialLinks, setShowSocialLinks] = useState(false);

  const {
    createCampaignCall,
    isLoading,
    successMessage,
    errorMessage
  } = useCampaignCreate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const naming = (name === "media" && formData.isUpload)
      ? e.target.files[0]
      : value

    setFormData({ ...formData, [name]: naming });
  };

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
  }

  const handleToggle = () => {
    setFormData({
      ...formData,
      isUpload: !formData.isUpload,
      media: "", // Reset media field when toggling
    });
  }

  const handleToggleSocialLinks = () => setShowSocialLinks(prevState => !prevState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createCampaignCall({
      formData,
      socialLinks
    });
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
              />Upload File</label>

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
            <label className="text-white">Amount (DAPP)</label>
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

          <ToggleButton
            name={"Social Links"}
            onClick={handleToggleSocialLinks}
          />

          <SocialLinksFields
            data={socialLinks}
            showSocialLinks={showSocialLinks}
            onChange={handleSocialLinksChange}
          />

          <SubmitButton
            name={"Create Campaign"}
            disabled={isLoading}
          />
        </form>

        {successMessage && (
          <div className="text-center my-4 p-4 bg-green-200 text-green-800 rounded-md">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="text-center my-4 p-4 bg-red-200 text-red-800 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default CreateCampaign;