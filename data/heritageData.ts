
export interface HeritageSite {
  name: string;
  description: string;
  image: string;
}

export interface TouristAttraction {
  name: string;
  type: 'Nature' | 'City' | 'Adventure' | 'Cultural';
  description: string;
  image: string;
}

export interface Festival {
  name: string;
  description: string;
  image: string;
}

export interface StateData {
  id: string;
  name: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  image: string;
  description: string;
  heritageSites: HeritageSite[];
  touristAttractions: TouristAttraction[];
  festivals: Festival[];
  highlights: string[];
  gallery: string[];
  mapCoords: { x: number; y: number };
}

export const INDIAN_STATES: StateData[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    region: 'West',
    image: 'https://picsum.photos/seed/mehrangarh/1200/800',
    description: 'The Land of Kings, known for its majestic forts, vibrant culture, and the vast Thar Desert.',
    heritageSites: [
      { name: 'Amer Fort', description: 'A stunning fort in Jaipur blending Hindu and Mughal architecture.', image: 'https://picsum.photos/seed/jaipur-fort/800/600' },
      { name: 'Hawa Mahal', description: 'The Palace of Winds, a unique five-story structure with 953 small windows.', image: 'https://picsum.photos/seed/hawa-mahal/800/600' },
      { name: 'Jaisalmer Fort', description: 'One of the very few "living forts" in the world, built with yellow sandstone.', image: 'https://picsum.photos/seed/jaisalmer-fort/800/600' }
    ],
    touristAttractions: [
      { name: 'Udaipur', type: 'City', description: 'The City of Lakes, famous for its romantic setting and palaces.', image: 'https://picsum.photos/seed/udaipur-lake/800/600' },
      { name: 'Pushkar', type: 'Cultural', description: 'A holy town known for its Brahma Temple and the annual Camel Fair.', image: 'https://picsum.photos/seed/pushkar-camel/800/600' },
      { name: 'Ranthambore', type: 'Nature', description: 'One of the largest national parks in Northern India, famous for tigers.', image: 'https://picsum.photos/seed/tiger-safari/800/600' }
    ],
    festivals: [
      { name: 'Pushkar Camel Fair', description: 'A massive multi-day livestock fair and cultural festival.', image: 'https://picsum.photos/seed/camel-fair/800/600' },
      { name: 'Desert Festival', description: 'Celebrated in Jaisalmer, showcasing folk music, dance, and camel races.', image: 'https://picsum.photos/seed/thar-desert/800/600' }
    ],
    highlights: ['Majestic Forts', 'Desert Safaris', 'Royal Palaces', 'Vibrant Textiles'],
    gallery: [
      'https://picsum.photos/seed/mehrangarh-fort/1200/800',
      'https://picsum.photos/seed/jaipur-city/1200/800',
      'https://picsum.photos/seed/hawa-mahal-view/1200/800',
      'https://picsum.photos/seed/thar-desert-sunset/1200/800'
    ],
    mapCoords: { x: 100, y: 150 }
  },
  {
    id: 'kerala',
    name: 'Kerala',
    region: 'South',
    image: 'https://picsum.photos/seed/kerala-backwaters/1200/800',
    description: 'God\'s Own Country, famous for its serene backwaters, lush greenery, and Ayurvedic traditions.',
    heritageSites: [
      { name: 'Mattancherry Palace', description: 'A Portuguese palace featuring murals depicting Hindu temple art.', image: 'https://picsum.photos/seed/kochi-palace/800/600' },
      { name: 'Bekal Fort', description: 'The largest fort in Kerala, offering stunning views of the Arabian Sea.', image: 'https://picsum.photos/seed/bekal-fort/800/600' }
    ],
    touristAttractions: [
      { name: 'Alleppey Backwaters', type: 'Nature', description: 'Famous for houseboat cruises through a network of canals and lagoons.', image: 'https://picsum.photos/seed/alleppey-houseboat/800/600' },
      { name: 'Munnar', type: 'Nature', description: 'A picturesque hill station known for its sprawling tea plantations.', image: 'https://picsum.photos/seed/munnar-tea/800/600' },
      { name: 'Athirappilly Falls', type: 'Nature', description: 'The largest waterfall in Kerala, often called the Niagara of India.', image: 'https://picsum.photos/seed/athirappilly/800/600' }
    ],
    festivals: [
      { name: 'Onam', description: 'The harvest festival of Kerala, known for boat races and floral carpets.', image: 'https://picsum.photos/seed/onam-festival/800/600' },
      { name: 'Vishu', description: 'The Malayali New Year, celebrated with fireworks and traditional feasts.', image: 'https://picsum.photos/seed/vishu-celebration/800/600' }
    ],
    highlights: ['Backwaters', 'Ayurveda', 'Tea Gardens', 'Kathakali Dance'],
    gallery: [
      'https://picsum.photos/seed/kerala-houseboat/1200/800',
      'https://picsum.photos/seed/munnar-hills/1200/800',
      'https://picsum.photos/seed/tea-gardens/1200/800',
      'https://picsum.photos/seed/athirappilly-falls/1200/800'
    ],
    mapCoords: { x: 150, y: 400 }
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    region: 'North',
    image: 'https://picsum.photos/seed/taj-mahal-main/1200/800',
    description: 'The heartland of India, home to the iconic Taj Mahal and ancient spiritual centers.',
    heritageSites: [
      { name: 'Taj Mahal', description: 'A UNESCO World Heritage site and one of the Seven Wonders of the World.', image: 'https://picsum.photos/seed/taj-mahal/800/600' },
      { name: 'Agra Fort', description: 'A historical fort that served as the main residence of the Mughal emperors.', image: 'https://picsum.photos/seed/agra-fort/800/600' },
      { name: 'Fatehpur Sikri', description: 'A short-lived capital of the Mughal Empire, known for its grand gateways.', image: 'https://picsum.photos/seed/fatehpur-sikri/800/600' }
    ],
    touristAttractions: [
      { name: 'Varanasi Ghats', type: 'Cultural', description: 'One of the oldest living cities in the world, famous for its spiritual ghats on the Ganges.', image: 'https://picsum.photos/seed/varanasi-ghats/800/600' },
      { name: 'Lucknow', type: 'City', description: 'The City of Nawabs, known for its refined culture and Awadhi cuisine.', image: 'https://picsum.photos/seed/lucknow-city/800/600' },
      { name: 'Dudhwa National Park', type: 'Nature', description: 'A wildlife reserve home to swamp deer and tigers.', image: 'https://picsum.photos/seed/dudhwa-tiger/800/600' }
    ],
    festivals: [
      { name: 'Kumbh Mela', description: 'The largest religious gathering in the world, held every 12 years.', image: 'https://picsum.photos/seed/kumbh-mela/800/600' },
      { name: 'Lathmar Holi', description: 'A unique celebration of Holi in Barsana and Nandgaon.', image: 'https://picsum.photos/seed/holi-festival/800/600' }
    ],
    highlights: ['Taj Mahal', 'Spiritual Ghats', 'Mughal Architecture', 'Awadhi Cuisine'],
    gallery: [
      'https://picsum.photos/seed/taj-mahal-view/1200/800',
      'https://picsum.photos/seed/varanasi-river/1200/800',
      'https://picsum.photos/seed/agra-fort-view/1200/800',
      'https://picsum.photos/seed/ghats-at-night/1200/800'
    ],
    mapCoords: { x: 200, y: 120 }
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    region: 'South',
    image: 'https://picsum.photos/seed/meenakshi-temple/1200/800',
    description: 'A land of magnificent temples, classical arts, and a rich Dravidian heritage.',
    heritageSites: [
      { name: 'Meenakshi Amman Temple', description: 'A historic Hindu temple in Madurai known for its towering gopurams.', image: 'https://picsum.photos/seed/madurai-temple/800/600' },
      { name: 'Mahabalipuram', description: 'Famous for its rock-cut temples and shore temple, a UNESCO site.', image: 'https://picsum.photos/seed/shore-temple/800/600' },
      { name: 'Brihadisvara Temple', description: 'A grand Chola temple in Thanjavur, an architectural marvel.', image: 'https://picsum.photos/seed/thanjavur-temple/800/600' }
    ],
    touristAttractions: [
      { name: 'Ooty', type: 'Nature', description: 'The "Queen of Hill Stations" in the Nilgiri Hills.', image: 'https://picsum.photos/seed/ooty-hills/800/600' },
      { name: 'Kanyakumari', type: 'Nature', description: 'The southernmost tip of mainland India, where three seas meet.', image: 'https://picsum.photos/seed/kanyakumari-sea/800/600' },
      { name: 'Chennai', type: 'City', description: 'The cultural capital of South India, known for its beaches and temples.', image: 'https://picsum.photos/seed/chennai-beach/800/600' }
    ],
    festivals: [
      { name: 'Pongal', description: 'A four-day harvest festival celebrated with traditional rituals.', image: 'https://picsum.photos/seed/pongal-festival/800/600' },
      { name: 'Natyanjali', description: 'A dance festival held at major temples to honor Lord Shiva.', image: 'https://picsum.photos/seed/bharatanatyam/800/600' }
    ],
    highlights: ['Dravidian Temples', 'Classical Music', 'Silk Sarees', 'Filter Coffee'],
    gallery: [
      'https://picsum.photos/seed/meenakshi-view/1200/800',
      'https://picsum.photos/seed/mahabalipuram-rocks/1200/800',
      'https://picsum.photos/seed/brihadisvara-gopuram/1200/800',
      'https://picsum.photos/seed/tamil-nadu-culture/1200/800'
    ],
    mapCoords: { x: 200, y: 420 }
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    region: 'East',
    image: 'https://picsum.photos/seed/victoria-memorial/1200/800',
    description: 'A cultural hub known for its literature, arts, and the majestic Sundarbans.',
    heritageSites: [
      { name: 'Victoria Memorial', description: 'A large marble building in Kolkata dedicated to Queen Victoria.', image: 'https://picsum.photos/seed/victoria-memorial-site/800/600' },
      { name: 'Howrah Bridge', description: 'An iconic cantilever bridge over the Hooghly River in Kolkata.', image: 'https://picsum.photos/seed/howrah-bridge/800/600' },
      { name: 'Shantiniketan', description: 'The home of Rabindranath Tagore and a center for arts and culture.', image: 'https://picsum.photos/seed/shantiniketan/800/600' }
    ],
    touristAttractions: [
      { name: 'Sundarbans', type: 'Nature', description: 'The world\'s largest mangrove forest and home to the Royal Bengal Tiger.', image: 'https://picsum.photos/seed/sundarbans-tiger/800/600' },
      { name: 'Darjeeling', type: 'Nature', description: 'Famous for its tea gardens and views of Mount Kanchenjunga.', image: 'https://picsum.photos/seed/darjeeling-tea/800/600' },
      { name: 'Digha', type: 'Nature', description: 'A popular seaside resort town on the Bay of Bengal.', image: 'https://picsum.photos/seed/digha-beach/800/600' }
    ],
    festivals: [
      { name: 'Durga Puja', description: 'The biggest festival in West Bengal, celebrating the victory of Goddess Durga.', image: 'https://picsum.photos/seed/durga-puja/800/600' },
      { name: 'Poush Mela', description: 'A fair celebrating the harvest and the foundation of Shantiniketan.', image: 'https://picsum.photos/seed/poush-mela/800/600' }
    ],
    highlights: ['Durga Puja', 'Literature', 'Sundarbans', 'Sweets'],
    gallery: [
      'https://picsum.photos/seed/victoria-memorial-view/1200/800',
      'https://picsum.photos/seed/howrah-bridge-night/1200/800',
      'https://picsum.photos/seed/darjeeling-hills/1200/800',
      'https://picsum.photos/seed/sundarbans-mangroves/1200/800'
    ],
    mapCoords: { x: 300, y: 200 }
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    region: 'West',
    image: 'https://picsum.photos/seed/gateway-of-india/1200/800',
    description: 'A land of diverse landscapes, from the bustling Mumbai to the ancient caves of Ajanta and Ellora.',
    heritageSites: [
      { name: 'Ajanta & Ellora Caves', description: 'Ancient rock-cut caves featuring Buddhist, Hindu, and Jain art.', image: 'https://picsum.photos/seed/ajanta-caves/800/600' },
      { name: 'Gateway of India', description: 'An iconic monument overlooking the Arabian Sea in Mumbai.', image: 'https://picsum.photos/seed/gateway-mumbai/800/600' },
      { name: 'Shaniwar Wada', description: 'A historical fortification in the city of Pune.', image: 'https://picsum.photos/seed/shaniwar-wada/800/600' }
    ],
    touristAttractions: [
      { name: 'Mumbai', type: 'City', description: 'The financial capital of India, known for its nightlife and history.', image: 'https://picsum.photos/seed/mumbai-skyline/800/600' },
      { name: 'Mahabaleshwar', type: 'Nature', description: 'A hill station in the Western Ghats famous for strawberries.', image: 'https://picsum.photos/seed/mahabaleshwar/800/600' },
      { name: 'Lonavala', type: 'Nature', description: 'A popular weekend getaway known for its lush green valleys.', image: 'https://picsum.photos/seed/lonavala-hills/800/600' }
    ],
    festivals: [
      { name: 'Ganesh Chaturthi', description: 'The most popular festival in Maharashtra, celebrating Lord Ganesha.', image: 'https://picsum.photos/seed/ganesh-festival/800/600' },
      { name: 'Gudi Padwa', description: 'The Marathi New Year, celebrated with traditional rituals.', image: 'https://picsum.photos/seed/gudi-padwa/800/600' }
    ],
    highlights: ['Mumbai Skyline', 'Ancient Caves', 'Western Ghats', 'Street Food'],
    gallery: [
      'https://picsum.photos/seed/gateway-view/1200/800',
      'https://picsum.photos/seed/ajanta-ellora/1200/800',
      'https://picsum.photos/seed/shaniwar-wada-pune/1200/800',
      'https://picsum.photos/seed/mumbai-marine-drive/1200/800'
    ],
    mapCoords: { x: 120, y: 250 }
  },
  {
    id: 'assam',
    name: 'Assam',
    region: 'Northeast',
    image: 'https://picsum.photos/seed/kaziranga-rhino/1200/800',
    description: 'The gateway to Northeast India, known for its tea gardens and the one-horned rhinoceros.',
    heritageSites: [
      { name: 'Kamakhya Temple', description: 'A historic Hindu temple dedicated to the mother goddess Kamakhya.', image: 'https://picsum.photos/seed/kamakhya-temple/800/600' },
      { name: 'Rang Ghar', description: 'A two-storied building which served as the royal sports pavilion.', image: 'https://picsum.photos/seed/rang-ghar/800/600' }
    ],
    touristAttractions: [
      { name: 'Kaziranga National Park', type: 'Nature', description: 'A UNESCO site home to two-thirds of the world\'s great one-horned rhinoceroses.', image: 'https://picsum.photos/seed/kaziranga-park/800/600' },
      { name: 'Tea Estates', type: 'Nature', description: 'Lush green tea gardens that produce the world-famous Assam tea.', image: 'https://picsum.photos/seed/assam-tea-garden/800/600' },
      { name: 'Brahmaputra River', type: 'Nature', description: 'One of the major rivers of Asia, offering scenic boat cruises.', image: 'https://picsum.photos/seed/brahmaputra/800/600' }
    ],
    festivals: [
      { name: 'Bihu', description: 'The most important festival of Assam, celebrated three times a year.', image: 'https://picsum.photos/seed/bihu-dance/800/600' },
      { name: 'Ambubachi Mela', description: 'An annual Hindu mela held at Kamakhya Temple.', image: 'https://picsum.photos/seed/ambubachi/800/600' }
    ],
    highlights: ['Tea Gardens', 'One-horned Rhino', 'Brahmaputra River', 'Silk'],
    gallery: [
      'https://picsum.photos/seed/kaziranga-view/1200/800',
      'https://picsum.photos/seed/tea-estate-assam/1200/800',
      'https://picsum.photos/seed/kamakhya-view/1200/800',
      'https://picsum.photos/seed/brahmaputra-sunset/1200/800'
    ],
    mapCoords: { x: 350, y: 150 }
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    region: 'Central',
    image: 'https://picsum.photos/seed/khajuraho-temple/1200/800',
    description: 'The Heart of Incredible India, home to ancient temples, wildlife reserves, and historical monuments.',
    heritageSites: [
      { name: 'Khajuraho Temples', description: 'A group of Hindu and Jain temples famous for their erotic sculptures.', image: 'https://picsum.photos/seed/khajuraho-sculpture/800/600' },
      { name: 'Sanchi Stupa', description: 'One of the oldest stone structures in India, a major Buddhist monument.', image: 'https://picsum.photos/seed/sanchi-stupa/800/600' },
      { name: 'Gwalior Fort', description: 'A majestic hill fort known for its stunning architecture and history.', image: 'https://picsum.photos/seed/gwalior-fort/800/600' }
    ],
    touristAttractions: [
      { name: 'Kanha National Park', type: 'Nature', description: 'A large tiger reserve that inspired Rudyard Kipling\'s "The Jungle Book".', image: 'https://picsum.photos/seed/kanha-tiger/800/600' },
      { name: 'Pachmarhi', type: 'Nature', description: 'The only hill station in Madhya Pradesh, known as "Satpura ki Rani".', image: 'https://picsum.photos/seed/pachmarhi-hills/800/600' },
      { name: 'Bhopal', type: 'City', description: 'The City of Lakes, blending modern and historical elements.', image: 'https://picsum.photos/seed/bhopal-lake/800/600' }
    ],
    festivals: [
      { name: 'Khajuraho Dance Festival', description: 'A week-long festival of classical dances held against the backdrop of the temples.', image: 'https://picsum.photos/seed/khajuraho-dance/800/600' },
      { name: 'Tansen Music Festival', description: 'A celebration of Indian classical music held in Gwalior.', image: 'https://picsum.photos/seed/tansen-music/800/600' }
    ],
    highlights: ['Ancient Temples', 'Tiger Reserves', 'Tribal Art', 'Historical Forts'],
    gallery: [
      'https://picsum.photos/seed/khajuraho-view/1200/800',
      'https://picsum.photos/seed/gwalior-fort-view/1200/800',
      'https://picsum.photos/seed/sanchi-stupa-view/1200/800',
      'https://picsum.photos/seed/mp-wildlife/1200/800'
    ],
    mapCoords: { x: 200, y: 200 }
  },
  {
    id: 'punjab',
    name: 'Punjab',
    region: 'North',
    image: 'https://picsum.photos/seed/golden-temple/1200/800',
    description: 'The Land of Five Rivers, known for its golden temple, fertile fields, and hearty hospitality.',
    heritageSites: [
      { name: 'Golden Temple', description: 'The holiest Gurdwara of Sikhism, located in the city of Amritsar.', image: 'https://picsum.photos/seed/amritsar-golden/800/600' },
      { name: 'Jallianwala Bagh', description: 'A historic garden and memorial of national importance.', image: 'https://picsum.photos/seed/jallianwala-bagh/800/600' },
      { name: 'Qila Mubarak', description: 'A historical monument in the heart of Bathinda city.', image: 'https://picsum.photos/seed/qila-mubarak/800/600' }
    ],
    touristAttractions: [
      { name: 'Wagah Border', type: 'Cultural', description: 'The only road border crossing between India and Pakistan.', image: 'https://picsum.photos/seed/wagah-border/800/600' },
      { name: 'Rock Garden', type: 'City', description: 'A sculpture garden in Chandigarh, also known as Nek Chand\'s Rock Garden.', image: 'https://picsum.photos/seed/rock-garden/800/600' }
    ],
    festivals: [
      { name: 'Baisakhi', description: 'The harvest festival of Punjab, also marking the Sikh New Year.', image: 'https://picsum.photos/seed/baisakhi/800/600' },
      { name: 'Lohri', description: 'A popular winter folk festival celebrated with bonfires and traditional songs.', image: 'https://picsum.photos/seed/lohri/800/600' }
    ],
    highlights: ['Golden Temple', 'Bhangra Dance', 'Lush Fields', 'Punjabi Cuisine'],
    gallery: [
      'https://picsum.photos/seed/golden-temple-view/1200/800',
      'https://picsum.photos/seed/wagah-border-ceremony/1200/800',
      'https://picsum.photos/seed/jallianwala-view/1200/800',
      'https://picsum.photos/seed/punjab-fields/1200/800'
    ],
    mapCoords: { x: 150, y: 80 }
  },
  {
    id: 'bihar',
    name: 'Bihar',
    region: 'East',
    image: 'https://picsum.photos/seed/mahabodhi-temple/1200/800',
    description: 'A land of enlightenment, where the Buddha attained nirvana and ancient universities flourished.',
    heritageSites: [
      { name: 'Mahabodhi Temple', description: 'A UNESCO World Heritage site where Buddha is said to have attained enlightenment.', image: 'https://picsum.photos/seed/bodh-gaya/800/600' },
      { name: 'Nalanda University Ruins', description: 'The ruins of one of the world\'s oldest residential universities.', image: 'https://picsum.photos/seed/nalanda-ruins/800/600' },
      { name: 'Vishnupad Temple', description: 'An ancient temple in Gaya dedicated to Lord Vishnu.', image: 'https://picsum.photos/seed/vishnupad/800/600' }
    ],
    touristAttractions: [
      { name: 'Rajgir', type: 'Nature', description: 'A holy city surrounded by seven hills, known for its hot springs.', image: 'https://picsum.photos/seed/rajgir-hills/800/600' },
      { name: 'Patna Sahib', type: 'Cultural', description: 'One of the five Takhts of Sikhism, birthplace of Guru Gobind Singh.', image: 'https://picsum.photos/seed/patna-sahib/800/600' }
    ],
    festivals: [
      { name: 'Chhath Puja', description: 'An ancient Hindu festival dedicated to the Sun God.', image: 'https://picsum.photos/seed/chhath-puja/800/600' },
      { name: 'Sonepur Mela', description: 'One of Asia\'s largest cattle fairs, held on the banks of the Ganges.', image: 'https://picsum.photos/seed/sonepur-mela/800/600' }
    ],
    highlights: ['Bodh Gaya', 'Ancient Nalanda', 'Chhath Puja', 'Madhubani Art'],
    gallery: [
      'https://picsum.photos/seed/mahabodhi-view/1200/800',
      'https://picsum.photos/seed/nalanda-university/1200/800',
      'https://picsum.photos/seed/vishnupad-temple/1200/800',
      'https://picsum.photos/seed/bihar-heritage/1200/800'
    ],
    mapCoords: { x: 260, y: 150 }
  },
  {
    id: 'goa',
    name: 'Goa',
    region: 'West',
    image: 'https://picsum.photos/seed/goa-beach-main/1200/800',
    description: 'India\'s pocket-sized paradise, famous for its beaches, churches, and vibrant nightlife.',
    heritageSites: [
      { name: 'Basilica of Bom Jesus', description: 'A UNESCO site holding the mortal remains of St. Francis Xavier.', image: 'https://picsum.photos/seed/bom-jesus/800/600' },
      { name: 'Aguada Fort', description: 'A well-preserved 17th-century Portuguese fort and lighthouse.', image: 'https://picsum.photos/seed/aguada-fort/800/600' }
    ],
    touristAttractions: [
      { name: 'Dudhsagar Falls', type: 'Nature', description: 'A four-tiered waterfall located on the Mandovi River.', image: 'https://picsum.photos/seed/dudhsagar-falls/800/600' },
      { name: 'Panaji Streets', type: 'City', description: 'Colorful Portuguese-style houses in the Fontainhas quarter.', image: 'https://picsum.photos/seed/panaji-streets/800/600' }
    ],
    festivals: [
      { name: 'Goa Carnival', description: 'A colorful and lively festival introduced by the Portuguese.', image: 'https://picsum.photos/seed/goa-carnival/800/600' },
      { name: 'Shigmo', description: 'The Goan version of Holi, celebrated with street dances and floats.', image: 'https://picsum.photos/seed/shigmo-festival/800/600' }
    ],
    highlights: ['Pristine Beaches', 'Portuguese Architecture', 'Seafood', 'Carnival'],
    gallery: [
      'https://picsum.photos/seed/goa-beaches/1200/800',
      'https://picsum.photos/seed/bom-jesus-basilica/1200/800',
      'https://picsum.photos/seed/dudhsagar-view/1200/800',
      'https://picsum.photos/seed/panaji-fontainhas/1200/800'
    ],
    mapCoords: { x: 100, y: 320 }
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    region: 'West',
    image: 'https://picsum.photos/seed/statue-of-unity/1200/800',
    description: 'A land of legends, home to the world\'s tallest statue and the only home of the Asiatic lion.',
    heritageSites: [
      { name: 'Statue of Unity', description: 'The world\'s tallest statue, dedicated to Sardar Vallabhbhai Patel.', image: 'https://picsum.photos/seed/statue-unity-main/800/600' },
      { name: 'Rani ki Vav', description: 'An intricately constructed stepwell in Patan, a UNESCO site.', image: 'https://picsum.photos/seed/rani-ki-vav/800/600' },
      { name: 'Lothal', description: 'One of the most prominent cities of the ancient Indus Valley Civilization.', image: 'https://picsum.photos/seed/lothal-ruins/800/600' }
    ],
    touristAttractions: [
      { name: 'Rann of Kutch', type: 'Nature', description: 'A massive salt marsh famous for the Rann Utsav festival.', image: 'https://picsum.photos/seed/rann-kutch-white/800/600' },
      { name: 'Gir National Park', type: 'Nature', description: 'The only place in the world where Asiatic lions can be seen in the wild.', image: 'https://picsum.photos/seed/gir-lion/800/600' },
      { name: 'Somnath Temple', type: 'Cultural', description: 'A sacred pilgrimage site, one of the twelve Jyotirlinga shrines.', image: 'https://picsum.photos/seed/somnath-temple/800/600' }
    ],
    festivals: [
      { name: 'Navratri', description: 'A nine-night festival celebrated with Garba and Dandiya Raas.', image: 'https://picsum.photos/seed/navratri-garba/800/600' },
      { name: 'Rann Utsav', description: 'A cultural extravaganza held in the white desert of Kutch.', image: 'https://picsum.photos/seed/rann-utsav/800/600' }
    ],
    highlights: ['White Desert', 'Asiatic Lions', 'Garba Dance', 'Textiles'],
    gallery: [
      'https://picsum.photos/seed/statue-unity-view/1200/800',
      'https://picsum.photos/seed/rann-kutch-view/1200/800',
      'https://picsum.photos/seed/somnath-view/1200/800',
      'https://picsum.photos/seed/gir-forest/1200/800'
    ],
    mapCoords: { x: 80, y: 200 }
  },
  {
    id: 'odisha',
    name: 'Odisha',
    region: 'East',
    image: 'https://picsum.photos/seed/konark-sun-temple/1200/800',
    description: 'The Soul of Incredible India, known for its ancient temples and pristine beaches.',
    heritageSites: [
      { name: 'Konark Sun Temple', description: 'A 13th-century temple built in the shape of a giant chariot, a UNESCO site.', image: 'https://picsum.photos/seed/konark-wheel/800/600' },
      { name: 'Jagannath Temple', description: 'A famous Hindu temple in Puri, known for the annual Rath Yatra.', image: 'https://picsum.photos/seed/puri-temple/800/600' },
      { name: 'Udayagiri & Khandagiri Caves', description: 'Ancient rock-cut caves with historical inscriptions.', image: 'https://picsum.photos/seed/udayagiri-caves/800/600' }
    ],
    touristAttractions: [
      { name: 'Chilika Lake', type: 'Nature', description: 'Asia\'s largest brackish water lagoon, famous for Irrawaddy dolphins.', image: 'https://picsum.photos/seed/chilika-lake/800/600' },
      { name: 'Puri Beach', type: 'Nature', description: 'A popular beach destination and a sacred pilgrimage site.', image: 'https://picsum.photos/seed/puri-beach/800/600' },
      { name: 'Bhubaneswar', type: 'City', description: 'The "Temple City of India", home to hundreds of ancient temples.', image: 'https://picsum.photos/seed/bhubaneswar-temple/800/600' }
    ],
    festivals: [
      { name: 'Rath Yatra', description: 'The grand chariot festival of Lord Jagannath in Puri.', image: 'https://picsum.photos/seed/ratha-yatra/800/600' },
      { name: 'Konark Dance Festival', description: 'A classical dance festival held against the backdrop of the Sun Temple.', image: 'https://picsum.photos/seed/odissi-dance/800/600' }
    ],
    highlights: ['Sun Temple', 'Pristine Beaches', 'Odissi Dance', 'Silver Filigree'],
    gallery: [
      'https://picsum.photos/seed/konark-view/1200/800',
      'https://picsum.photos/seed/puri-temple-view/1200/800',
      'https://picsum.photos/seed/chilika-birds/1200/800',
      'https://picsum.photos/seed/odisha-heritage/1200/800'
    ],
    mapCoords: { x: 280, y: 250 }
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    region: 'North',
    image: 'https://picsum.photos/seed/rohtang-pass/1200/800',
    description: 'The Land of Snow, offering breathtaking mountain views and adventure sports.',
    heritageSites: [
      { name: 'Kalka-Shimla Railway', description: 'A UNESCO World Heritage site, offering a scenic mountain train ride.', image: 'https://picsum.photos/seed/shimla-toy-train/800/600' },
      { name: 'Kangra Fort', description: 'One of the oldest and largest forts in the Himalayas.', image: 'https://picsum.photos/seed/kangra-fort/800/600' }
    ],
    touristAttractions: [
      { name: 'Manali', type: 'Adventure', description: 'A popular resort town known for trekking, skiing, and rafting.', image: 'https://picsum.photos/seed/manali-snow/800/600' },
      { name: 'Shimla', type: 'City', description: 'The former summer capital of British India, known for its colonial architecture.', image: 'https://picsum.photos/seed/shimla-mall/800/600' },
      { name: 'Spiti Valley', type: 'Nature', description: 'A cold desert mountain valley known for its monasteries and landscapes.', image: 'https://picsum.photos/seed/spiti-valley/800/600' }
    ],
    festivals: [
      { name: 'Kullu Dussehra', description: 'A week-long celebration of Dussehra in the Kullu Valley.', image: 'https://picsum.photos/seed/kullu-dussehra/800/600' },
      { name: 'Losar', description: 'The Tibetan New Year, celebrated with traditional dances and rituals.', image: 'https://picsum.photos/seed/losar-festival/800/600' }
    ],
    highlights: ['Snowy Peaks', 'Adventure Sports', 'Monasteries', 'Apple Orchards'],
    gallery: [
      'https://picsum.photos/seed/rohtang-view/1200/800',
      'https://picsum.photos/seed/manali-hills/1200/800',
      'https://picsum.photos/seed/shimla-ridge/1200/800',
      'https://picsum.photos/seed/spiti-monastery/1200/800'
    ],
    mapCoords: { x: 180, y: 50 }
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    region: 'South',
    image: 'https://picsum.photos/seed/hampi-chariot/1200/800',
    description: 'A state of diverse attractions, from the ruins of Hampi to the tech hub of Bengaluru.',
    heritageSites: [
      { name: 'Hampi', description: 'The ruins of the Vijayanagara Empire, a UNESCO World Heritage site.', image: 'https://picsum.photos/seed/hampi-ruins-view/800/600' },
      { name: 'Mysore Palace', description: 'A magnificent palace known for its Indo-Saracenic architecture.', image: 'https://picsum.photos/seed/mysore-palace-main/800/600' },
      { name: 'Pattadakal', description: 'A UNESCO site featuring a unique blend of North and South Indian temple styles.', image: 'https://picsum.photos/seed/pattadakal-temples/800/600' }
    ],
    touristAttractions: [
      { name: 'Coorg', type: 'Nature', description: 'The "Scotland of India", famous for coffee plantations and misty hills.', image: 'https://picsum.photos/seed/coorg-hills/800/600' },
      { name: 'Bengaluru', type: 'City', description: 'The "Silicon Valley of India", known for its gardens and vibrant culture.', image: 'https://picsum.photos/seed/bengaluru-city/800/600' },
      { name: 'Gokarna', type: 'Nature', description: 'A pilgrimage town and a popular beach destination.', image: 'https://picsum.photos/seed/gokarna-beach/800/600' }
    ],
    festivals: [
      { name: 'Mysuru Dasara', description: 'A 10-day festival celebrated with grand processions and palace lighting.', image: 'https://picsum.photos/seed/mysore-dasara/800/600' },
      { name: 'Kambala', description: 'A traditional buffalo race held in coastal Karnataka.', image: 'https://picsum.photos/seed/kambala/800/600' }
    ],
    highlights: ['Hampi Ruins', 'Coffee Plantations', 'Royal Palaces', 'IT Hub'],
    gallery: [
      'https://picsum.photos/seed/mysore-palace-night/1200/800',
      'https://picsum.photos/seed/hampi-view/1200/800',
      'https://picsum.photos/seed/coorg-coffee/1200/800',
      'https://picsum.photos/seed/jog-falls-view/1200/800'
    ],
    mapCoords: { x: 140, y: 350 }
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    region: 'Northeast',
    image: 'https://picsum.photos/seed/kanchenjunga-view/1200/800',
    description: 'A serene Himalayan state known for its monasteries, lakes, and organic farming.',
    heritageSites: [
      { name: 'Rumtek Monastery', description: 'One of the most significant monasteries in Sikkim, a center for Tibetan Buddhism.', image: 'https://picsum.photos/seed/rumtek-monastery/800/600' },
      { name: 'Pemayangtse Monastery', description: 'A premier monastery belonging to the Nyingma order.', image: 'https://picsum.photos/seed/pemayangtse/800/600' }
    ],
    touristAttractions: [
      { name: 'Tsomgo Lake', type: 'Nature', description: 'A high-altitude glacial lake known for its changing colors.', image: 'https://picsum.photos/seed/tsomgo-lake/800/600' },
      { name: 'Gangtok', type: 'City', description: 'The capital city, offering stunning views of Mount Kanchenjunga.', image: 'https://picsum.photos/seed/gangtok-city/800/600' },
      { name: 'Nathula Pass', type: 'Adventure', description: 'A mountain pass on the Indo-China border.', image: 'https://picsum.photos/seed/nathula-pass/800/600' }
    ],
    festivals: [
      { name: 'Saga Dawa', description: 'The most sacred festival for Sikkimese Buddhists, celebrating Lord Buddha.', image: 'https://picsum.photos/seed/saga-dawa/800/600' },
      { name: 'Losoong', description: 'The Sikkimese New Year, celebrated with traditional mask dances.', image: 'https://picsum.photos/seed/losoong/800/600' }
    ],
    highlights: ['Kanchenjunga', 'Organic State', 'Monasteries', 'Glacial Lakes'],
    gallery: [
      'https://picsum.photos/seed/gurudongmar-lake/1200/800',
      'https://picsum.photos/seed/rumtek-view/1200/800',
      'https://picsum.photos/seed/nathula-view/1200/800',
      'https://picsum.photos/seed/sikkim-mountains/1200/800'
    ],
    mapCoords: { x: 320, y: 120 }
  }
];
