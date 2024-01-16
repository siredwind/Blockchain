import React, { useState } from "react";
import { FadeIn } from "../FadeIn";

const popularGenres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Electronic",
  "Country",
  "Jazz",
  "Classical",
  "Reggae",
  "Metal",
  "Blues",
  "Folk",
  "Indie",
  "Alternative",
];

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    goal: "",
    deadline: "",
    genres: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genres") {
      // Handle multiple genre selections
      const selectedGenres = formData.genres.includes(value)
        ? formData.genres.filter((genre) => genre !== value)
        : [...formData.genres, value];

      setFormData({ ...formData, [name]: selectedGenres });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
            <label className="text-white">URL (Image/Video)</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
            />
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