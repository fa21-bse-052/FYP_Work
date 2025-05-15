import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";

const reviews = [
  {
    text: "They designed great UX/UI and were easy to work with. Phenomenon Studio has demonstrated great work. The visual look and feel of the new site architecture conveys a mature and professional aesthetic. Their agile communication has allowed for continuous feedback, which has led to a successful collaboration.",
    name: "Oliver Ahad",
    position: "CRO Airportr Technologies",
  },
  {
    text: "I am blown away by the quality of work done by Phenomenon Studio. Phenomenon Studio successfully delivered a consumer-level iOS app. The team had a smooth workflow and communicated via Slack. The client was impressed by the quality output and the quick turnaround time set by the team.",
    name: "Mike Abbott",
    position: "Co-Founder Polyform Studio",
  },
  {
    text: "I was impressed at their knowledge and skillset in bringing to life every idea we had. Since the successful launch of the website by the Phenomenon Studio team, the company has experienced faster load times, allowing their customers to navigate the platform easier and book their services quicker.",
    name: "Jason Timpson",
    position: "Head of Marketing at Copper Rock",
  },
  {
    text: "The quality of the designs is fantastic. The company has been measuring other results, but the overall quality has positive feedback. Phenomenon Studio works at speed and is extremely punctual with timelines. They deliver top-notch outcomes with exceptional designs.",
    name: "George Fry",
    position: "Founder Neap",
  },
  {
    text: "All communication was clear and open, and all team members worked very efficiently towards our goals. Phenomenon Studio impressed the company's internal stakeholders with their designs. The collaboration was made successful by the vendor's communicative, efficient, and meticulous approach.",
    name: "Alex Shepherd",
    position: "CTO Metraverse",
  },
  {
    text: "Their execution is splendid and their excellent communication keeps everybody aligned. Phenomenon Studio continues to impress with their splendid execution of the project and their superb customer support skills. They make sure to stay accessible at all times to establish an efficient process.",
    name: "Eliza Nimmich",
    position: "Co-Founder/COO Learnt",
  },
];

function ReviewsPage() {
  const [userReview, setUserReview] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying the access token
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("access_token");
    if (!token) {
      setErrorMessage("You must be logged in to leave a review.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://mominah-auth.hf.space/reviews",
        { review: userReview },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Review submitted successfully!");
        setUserReview("");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.detail || "Failed to submit review.");
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="bg-gray-100 min-h-screen py-20 flex flex-col items-center px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-gray-900">Reviews</h2>
        <p className="text-2xl text-gray-700 mt-2">What do people say about us?</p>
      </div>

      {/* Reviews Section */}
      <div className="overflow-hidden w-full">
        <motion.div
          className="flex"
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="min-w-[80%] md:min-w-[30%] bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-black text-lg mb-4">{review.text}</p>
              <div className="mt-auto">
                <h5 className="font-bold text-gray-900">{review.name}</h5>
                <p className="text-gray-600 text-sm">{review.position}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Add Review Section */}
      {isLoggedIn ? (
        <form onSubmit={handleReviewSubmit} className="w-full max-w-md mt-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h3>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Write your review here..."
            rows="5"
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            required
          />
          <motion.button
            type="submit"
            className="mt-4 bg-yellow-400 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </motion.button>
        </form>
      ) : (
        <p className="text-gray-600 mt-10">
          Please{" "}
          <a
            href="/login"
            className="bg-yellow-400 text-white py-2 px-4 rounded inline-block hover:bg-yellow-500 transition duration-300"
          >
            log in
          </a>{" "}
          to leave a review.
        </p>
      )}
    </motion.section>
  );
}

export default ReviewsPage;
