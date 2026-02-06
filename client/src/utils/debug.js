console.log('🔍 Environment Check:', {
  'VITE_API_URL': import.meta.env.VITE_API_URL,
  'hostname': window.location.hostname,
  'isProduction': import.meta.env.VITE_API_URL?.includes('fly.dev') || 
                 window.location.hostname === 'social-downloader-delta.vercel.app' ||
                 (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
});

export const logEndpointCall = (endpoint, isProduction) => {
  console.log(`🚀 API Call:`, {
    endpoint,
    isProduction,
    actualEndpoint: isProduction ? `${endpoint}-nocookies` : endpoint
  });
};