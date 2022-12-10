module.exports = {
  getBaseUrl: () => {
    const url = process.env.ENVIRONMENT_URL || 'https://app-finta.vercel.app/';
    return url.includes('http') ? url : `https://${url}`
  }
}