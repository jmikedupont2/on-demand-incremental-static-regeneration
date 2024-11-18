/** @type {import('next').NextConfig} */
module.exports = {
    //    output:"export", FIXME: for the future generateStaticParams
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
