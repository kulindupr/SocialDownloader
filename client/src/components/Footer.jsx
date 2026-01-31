import { motion } from 'framer-motion';
import { Download, Shield, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-auto"
    >
      {/* Separator Line */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      </div>

      {/* Footer Section */}
      <div className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Brand Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              </div>
              <span className="text-xl font-bold text-gradient">SocialDownloader</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
              The fastest and easiest way to download videos from your favorite social media platforms.
            </p>
          </div>

          {/* Features Row */}
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm">Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Multi-Platform</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Download className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Free Forever</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-800 mb-6" />

          {/* Legal Disclaimer */}
          <div className="ios-card rounded-xl p-4 mb-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              <strong className="text-amber-600 dark:text-amber-400">Disclaimer:</strong> This tool is intended for personal use only. 
              Users are responsible for ensuring their downloads comply with applicable laws and the terms of service of the respective platforms. 
              We do not host, store, or distribute any copyrighted content. All trademarks belong to their respective owners.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {currentYear} SocialDownloader. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
