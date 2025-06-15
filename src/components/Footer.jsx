import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white overflow-hidden">
      {/* Wave decoration at top */}
      <svg className="absolute top-0 w-full" viewBox="0 0 1440 100">
        <path
          fill="currentColor"
          fillOpacity="0.1"
          d="M0,100 C240,50 480,0 720,20 C960,40 1200,100 1440,60 L1440,0 L0,0 Z"
        />
      </svg>
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content in one row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
            
            {/* Brand section */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold font-poppins mb-3 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Zag's Blog 🌟
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Share stories, explore ideas, connect with the world! ✨
              </p>
              {/* Social links */}
              <div className="flex gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-circle btn-sm btn-ghost hover:btn-primary hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-sm"
                   title="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-circle btn-sm btn-ghost hover:btn-primary hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-sm"
                   title="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-circle btn-sm btn-ghost hover:btn-primary hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-sm"
                   title="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-circle btn-sm btn-ghost hover:btn-primary hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-sm"
                   title="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zm0-2.16c-3.26 0-3.67.01-4.95.07-1.28.06-2.15.26-2.91.56-.79.3-1.46.72-2.13 1.39-.67.67-1.09 1.34-1.39 2.13-.3.76-.5 1.63-.56 2.91-.06 1.28-.07 1.69-.07 4.95s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.39 2.13.67.67 1.34 1.09 2.13 1.39.76.3 1.63.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.39.67-.67 1.09-1.34 1.39-2.13.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.39-2.13-.67-.67-1.34-1.09-2.13-1.39-.76-.3-1.63-.5-2.91-.56-1.28-.06-1.69-.07-4.95-.07zm0 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16 6.16-2.76 6.16-6.16-2.76-6.16-6.16-6.16zm0 10.15c-2.2 0-3.99-1.79-3.99-3.99s1.79-3.99 3.99-3.99 3.99 1.79 3.99 3.99-1.79 3.99-3.99 3.99zm7.85-10.4c0 .8-.65 1.44-1.44 1.44s-1.44-.65-1.44-1.44.65-1.44 1.44-1.44 1.44.65 1.44 1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3 text-pink-200 text-lg">Quick Links 🔗</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">📚 Latest Posts</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">🏷️ Categories</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">👥 Authors</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">✍️ Write a Post</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-3 text-pink-200 text-lg">Support 💬</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">❓ Help Center</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">📧 Contact Us</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">🔒 Privacy Policy</a></li>
                <li><a href="#" className="hover:text-pink-200 transition-colors hover:underline">📋 Terms of Use</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-3 text-pink-200 text-lg">Stay Updated 📧</h4>
              <p className="text-xs opacity-80 mb-3">Get latest posts in your inbox!</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email..."
                  className="input input-sm input-bordered flex-1 bg-white/20 border-white/30 text-white placeholder-white/60 text-xs focus:border-pink-300"
                />
                <button className="btn btn-primary btn-sm hover:btn-secondary transition-colors text-xs">
                  Join 🚀
                </button>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="font-semibold">Zag's Blog © 2025 - All rights reserved 🎯</p>
                <p className="text-sm opacity-80">Built with ❤️ by <span className="text-pink-200 font-medium">Basant Elsaey</span></p>
              </div>
              <div className="text-xs opacity-70 text-center md:text-right">
                <p>Crafted with React & TailwindCSS ⚡</p>
                <p>Made in Egypt 🇪🇬</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/3 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
    </footer>
  );
};

export default Footer;