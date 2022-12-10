module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/destinations',
        permanent: true,
      },
    ]
  }
};