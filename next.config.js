/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["encrypted-tbn0.gstatic.com", `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`, "via.placeholder.com", "ajtuatrmeflcilccvujc.supabase.co"],
  },
};

module.exports = nextConfig;
