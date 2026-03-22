import { Zap, Heart, Globe, Sparkles } from 'lucide-react';

export const VIBES = [
  { 
    id: 'adventure',
    name: 'ADVENTURE', 
    icon: Zap, 
    color: 'bg-orange-500', 
    img: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80',
    places: [
      { name: 'Queenstown', country: 'New Zealand', img: 'https://images.unsplash.com/photo-1589802829985-817e51181b92?auto=format&fit=crop&w=600&q=80', desc: 'The adventure capital of the world, offering bungee jumping, skiing, and jet boating.' },
      { name: 'Interlaken', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80', desc: 'Nestled between lakes, it is a hub for paragliding and alpine trekking.' },
      { name: 'Moab', country: 'USA', img: 'https://images.unsplash.com/photo-1505159947324-47d0f94311fc?auto=format&fit=crop&w=600&q=80', desc: 'Gateway to Arches and Canyonlands, perfect for mountain biking and off-roading.' },
      { name: 'Patagonia', country: 'Chile/Argentina', img: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=600&q=80', desc: 'Dramatic peaks and glaciers, a dream for serious hikers.' },
      { name: 'Reykjavik', country: 'Iceland', img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80', desc: 'Land of fire and ice, offering glacier tours and volcanic hikes.' },
      { name: 'Chamonix', country: 'France', img: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=600&q=80', desc: 'World-class skiing and mountaineering at the foot of Mont Blanc.' },
      { name: 'Banff', country: 'Canada', img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80', desc: 'Stunning turquoise lakes and rugged mountain trails.' },
      { name: 'Zermatt', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80', desc: 'Home to the Matterhorn, famous for year-round skiing.' },
      { name: 'Costa Rica', country: 'Central America', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', desc: 'Zip-lining through rainforests and surfing Pacific swells.' },
      { name: 'Kathmandu', country: 'Nepal', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', desc: 'The starting point for Himalayan expeditions and Everest treks.' },
      { name: 'Cape Town', country: 'South Africa', img: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=600&q=80', desc: 'Shark cage diving and hiking up Table Mountain.' },
      { name: 'Lombok', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=600&q=80', desc: 'Rugged landscapes and the challenging Mount Rinjani trek.' }
    ]
  },
  { 
    id: 'relax',
    name: 'RELAX', 
    icon: Heart, 
    color: 'bg-emerald-500', 
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    places: [
      { name: 'Maldives', country: 'Indian Ocean', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', desc: 'Overwater bungalows and crystal clear lagoons.' },
      { name: 'Bora Bora', country: 'French Polynesia', img: 'https://images.unsplash.com/photo-1500932334442-8761ee4810a7?auto=format&fit=crop&w=600&q=80', desc: 'The ultimate romantic getaway with turquoise waters.' },
      { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80', desc: 'Iconic white-washed buildings and stunning sunset views.' },
      { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', desc: 'Spiritual retreats, yoga, and lush jungle spas.' },
      { name: 'Amalfi Coast', country: 'Italy', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80', desc: 'Picturesque coastal towns and Mediterranean relaxation.' },
      { name: 'Maui', country: 'Hawaii', img: 'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=600&q=80', desc: 'Golden beaches and the scenic Road to Hana.' },
      { name: 'Seychelles', country: 'East Africa', img: 'https://images.unsplash.com/photo-1473679408190-0693dd22fe6a?auto=format&fit=crop&w=600&q=80', desc: 'Pristine beaches and unique granite rock formations.' },
      { name: 'Koh Samui', country: 'Thailand', img: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=600&q=80', desc: 'Luxury resorts and calm, warm waters.' },
      { name: 'Tulum', country: 'Mexico', img: 'https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?auto=format&fit=crop&w=600&q=80', desc: 'Eco-chic retreats and ancient Mayan ruins by the sea.' },
      { name: 'Fiji', country: 'South Pacific', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', desc: 'Friendly locals and secluded island resorts.' },
      { name: 'Lake Como', country: 'Italy', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', desc: 'Elegant villas and serene lake views.' },
      { name: 'Provence', country: 'France', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', desc: 'Lavender fields and slow-paced countryside living.' }
    ]
  },
  { 
    id: 'culture',
    name: 'CULTURE', 
    icon: Globe, 
    color: 'bg-indigo-500', 
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    places: [
      { name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80', desc: 'The Eternal City, filled with ancient history and art.' },
      { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', desc: 'Traditional temples, tea houses, and geisha districts.' },
      { name: 'Cairo', country: 'Egypt', img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80', desc: 'Home to the Pyramids of Giza and the Sphinx.' },
      { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', desc: 'The city of light, art, and world-class museums.' },
      { name: 'Istanbul', country: 'Turkey', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80', desc: 'Where East meets West, rich in Byzantine and Ottoman history.' },
      { name: 'Athens', country: 'Greece', img: 'https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=600&q=80', desc: 'The cradle of Western civilization and the Acropolis.' },
      { name: 'Marrakesh', country: 'Morocco', img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=600&q=80', desc: 'Vibrant souks, palaces, and the famous Jemaa el-Fnaa.' },
      { name: 'Cusco', country: 'Peru', img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80', desc: 'The historic capital of the Inca Empire.' },
      { name: 'Jerusalem', country: 'Israel', img: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80', desc: 'A holy city for three major world religions.' },
      { name: 'Varanasi', country: 'India', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80', desc: 'One of the oldest continuously inhabited cities in the world.' },
      { name: 'Prague', country: 'Czech Republic', img: 'https://images.unsplash.com/photo-1519677100203-ad0382b629e4?auto=format&fit=crop&w=600&q=80', desc: 'The city of a hundred spires and Gothic architecture.' },
      { name: 'Mexico City', country: 'Mexico', img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=600&q=80', desc: 'A blend of Aztec ruins and colonial Spanish history.' }
    ]
  },
  { 
    id: 'nightlife',
    name: 'NIGHTLIFE', 
    icon: Sparkles, 
    color: 'bg-violet-500', 
    img: 'https://images.unsplash.com/photo-1514525253361-bee87187030c?auto=format&fit=crop&w=600&q=80',
    places: [
      { name: 'Ibiza', country: 'Spain', img: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=600&q=80', desc: 'The world capital of electronic dance music and clubbing.' },
      { name: 'Berlin', country: 'Germany', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80', desc: 'Famous for its underground techno scene and 24-hour clubs.' },
      { name: 'Las Vegas', country: 'USA', img: 'https://images.unsplash.com/photo-1581351123004-757df051db8e?auto=format&fit=crop&w=600&q=80', desc: 'The city that never sleeps, with casinos and mega-clubs.' },
      { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', desc: 'Neon-lit streets, karaoke bars, and high-tech nightlife.' },
      { name: 'Bangkok', country: 'Thailand', img: 'https://images.unsplash.com/photo-1504966981333-1ae8899b884d?auto=format&fit=crop&w=600&q=80', desc: 'Rooftop bars, street parties, and vibrant night markets.' },
      { name: 'New York City', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', desc: 'Endless options from jazz clubs to exclusive lounges.' },
      { name: 'London', country: 'UK', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', desc: 'Historic pubs, West End shows, and trendy Shoreditch clubs.' },
      { name: 'Rio de Janeiro', country: 'Brazil', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80', desc: 'Samba clubs and the world-famous Carnival parties.' },
      { name: 'Seoul', country: 'South Korea', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80', desc: 'High-energy districts like Gangnam and Hongdae.' },
      { name: 'Amsterdam', country: 'Netherlands', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80', desc: 'A unique mix of cozy bars and world-class concert venues.' },
      { name: 'Miami', country: 'USA', img: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&w=600&q=80', desc: 'South Beach glamour and high-end pool parties.' },
      { name: 'Barcelona', country: 'Spain', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80', desc: 'Late-night tapas and beachside clubs.' }
    ]
  }
];

export const COLLECTION = [
  { name: 'Amalfi Coast', country: 'Italy', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80', tag: 'Coastal', rating: 4.9, reviews: 1240, price: '₹85,000', desc: 'A stunning stretch of coastline in southern Italy, known for its dramatic cliffs and colorful villages.' },
  { name: 'Kyoto Temples', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', tag: 'Cultural', rating: 4.8, reviews: 980, price: '₹1,20,000', desc: 'Experience the serene beauty of ancient Zen temples and traditional Japanese gardens.' },
  { name: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=800&q=80', tag: 'Adventure', rating: 4.9, reviews: 2100, price: '₹1,50,000', desc: 'Majestic peaks and world-class skiing in the heart of Europe.' },
  { name: 'Great Barrier Reef', country: 'Australia', img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80', tag: 'Nature', rating: 4.7, reviews: 3200, price: '₹1,80,000', desc: 'The world\'s largest coral reef system, teeming with marine life.' },
  { name: 'Machu Picchu', country: 'Peru', img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80', tag: 'Historical', rating: 4.9, reviews: 4500, price: '₹95,000', desc: 'An ancient Incan citadel set high in the Andes Mountains.' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80', tag: 'Romantic', rating: 4.8, reviews: 1800, price: '₹1,10,000', desc: 'Famous for its white-washed buildings and breathtaking caldera views.' },
  { name: 'Bora Bora', country: 'French Polynesia', img: 'https://images.unsplash.com/photo-1500932334442-8761ee4810a7?auto=format&fit=crop&w=800&q=80', tag: 'Luxury', rating: 4.9, reviews: 850, price: '₹2,50,000', desc: 'The ultimate luxury destination with overwater bungalows and turquoise lagoons.' },
  { name: 'Reykjavik', country: 'Iceland', img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80', tag: 'Adventure', rating: 4.7, reviews: 1500, price: '₹1,30,000', desc: 'Explore volcanic landscapes, hot springs, and the Northern Lights.' },
  { name: 'Petra', country: 'Jordan', img: 'https://images.unsplash.com/photo-1579606030136-a8494ba917c6?auto=format&fit=crop&w=800&q=80', tag: 'Historical', rating: 4.9, reviews: 2800, price: '₹75,000', desc: 'The famous archaeological site in Jordan\'s southwestern desert.' }
];
