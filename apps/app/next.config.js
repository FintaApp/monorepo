const { withAxiom } = require('next-axiom');

module.exports = withAxiom({
  async redirects() {
    return [
      {
        source: '/',
        destination: '/destinations',
        permanent: true,
      },
    ]
  }
});