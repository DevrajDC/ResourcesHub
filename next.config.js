const withContentlayer = require("next-contentlayer").withContentlayer

/** @type {import('next').NextConfig} */
module.exports = withContentlayer({
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "res.cloudinary.com"]
  }
})


