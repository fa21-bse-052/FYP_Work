import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

function ProfileManagement() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const access_token = Cookies.get("access_token");
  const backendBaseUrl = "https://mominah-edulearnai.hf.space";

  useEffect(() => {
    if (!access_token) return;
    axios
      .get(`${backendBaseUrl}/auth/user/data`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        const u = res.data;
        setUser(u);
        setName(u.name || "");
        setEmail(u.email || "");
        let url = u.avatar || null;
        if (url && !url.startsWith("/auth/avatar/")) {
          url = `${backendBaseUrl}/auth/avatar/${url}`;
        } else if (url) {
          url = `${backendBaseUrl}${url}`;
        }
        setAvatarPreview(url);
        Cookies.set("user", JSON.stringify(u), { expires: 7, secure: true });
      })
      .catch(() => setErrorMsg("Error loading profile data."));
  }, [access_token]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (avatar) formData.append("avatar", avatar);

      const res = await axios.put(
        `${backendBaseUrl}/auth/user/update`,
        formData,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      if (res.status === 200) {
        setMessage("Profile updated successfully!");
        // Re-fetch to update static card
        const { data: u2 } = await axios.get(
          `${backendBaseUrl}/auth/user/data`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        setUser(u2);
        setName(u2.name || "");
        setEmail(u2.email || "");
        let newUrl = u2.avatar || null;
        if (newUrl && !newUrl.startsWith("/auth/avatar/")) {
          newUrl = `${backendBaseUrl}/auth/avatar/${newUrl}`;
        } else if (newUrl) {
          newUrl = `${backendBaseUrl}${newUrl}`;
        }
        setAvatarPreview(newUrl);
        Cookies.set("user", JSON.stringify(u2), { expires: 7, secure: true });
      }
    } catch {
      setErrorMsg("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        
        {/* Left: Your Profile Card */}
        <motion.div
          className="md:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-20 flex flex-col items-center min-h-[500px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Your Profile</h3>
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-32 w-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-5xl mb-4">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <h4 className="text-xl font-medium">{name}</h4>
          <p className="text-gray-600">{email}</p>
        </motion.div>

        {/* Right: Update Profile Card */}
        <motion.div
          className="md:w-1/2 bg-white rounded-lg mt-20 shadow-lg p-6 min-h-[500px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Update Profile</h3>

          <AnimatePresence>
            {message && (
              <motion.div
                className="mb-4 text-green-600 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {message}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                className="mb-4 text-red-600 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-yellow-300 focus:border-yellow-300"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-yellow-300 focus:border-yellow-300"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 font-bold rounded shadow-md bg-yellow-400 text-gray-900 hover:bg-yellow-300 disabled:opacity-50"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Updating…" : "Save Changes"}
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}

export default ProfileManagement;
