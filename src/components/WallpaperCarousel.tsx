
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const WallpaperCarousel = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const wallpapers = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
      title: "Cybersecurity Network",
      description: "Secure your digital infrastructure"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      title: "Digital Security",
      description: "Advanced threat protection"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
      title: "Data Protection",
      description: "Safeguard your valuable data"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wallpapers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wallpapers.length) % wallpapers.length);
  };

  React.useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative w-full h-64 overflow-hidden rounded-xl shadow-lg mb-8">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {wallpapers.map((wallpaper) => (
          <div key={wallpaper.id} className="w-full h-full flex-shrink-0 relative">
            <img 
              src={wallpaper.url} 
              alt={wallpaper.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{wallpaper.title}</h3>
              <p className="text-sm opacity-90">{wallpaper.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        {wallpapers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

export default WallpaperCarousel;
