import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // Baris swcMinify: true SUDAH DIHAPUS di sini agar tidak error
  disable: false, 
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Biarkan kosong atau isi jika ada settingan lain
};

export default withPWA(nextConfig);