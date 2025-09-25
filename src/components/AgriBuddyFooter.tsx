import { Card } from "@/components/ui/card";

const AgriBuddyFooter = () => {
  return (
    <footer className="relative bg-gradient-to-b from-primary/5 to-primary/10 py-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
        <div className="absolute top-20 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-pulse animation-delay-300" />
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse animation-delay-600" />
        <div className="absolute bottom-10 right-1/3 w-5 h-5 bg-purple-400 rounded-full animate-pulse animation-delay-900" />
        
        {/* Growing plants animation */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-100/50 to-transparent dark:from-green-950/20" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">AgriBuddy</h3>
            <p className="text-sm text-muted-foreground">
              Empowering farmers with AI-driven insights for sustainable agriculture.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Research</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>
          
          {/* Languages */}
          <div className="space-y-4">
            <h4 className="font-semibold">Languages</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button className="text-left text-muted-foreground hover:text-primary transition-colors">English</button>
              <button className="text-left text-muted-foreground hover:text-primary transition-colors">हिंदी</button>
              <button className="text-left text-muted-foreground hover:text-primary transition-colors">தமிழ்</button>
              <button className="text-left text-muted-foreground hover:text-primary transition-colors">বাংলা</button>
              <button className="text-left text-muted-foreground hover:text-primary transition-colors">मराठी</button>
              <button className="text-left text-muted-foreground hover:text-primary transition-colors">ગુજરાતી</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AgriBuddy. All rights reserved. | Powered by AI for Sustainable Agriculture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AgriBuddyFooter;