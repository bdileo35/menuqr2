const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"]
  },
  // Excluir _unused del build usando webpack
  webpack: (config) => {
    // Ignorar completamente la carpeta _unused
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/.next/**', '**/app/_unused/**']
    };
    return config;
  },
  // Excluir de la compilación de páginas
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./app/_unused/**']
    }
  }
};

module.exports = nextConfig;