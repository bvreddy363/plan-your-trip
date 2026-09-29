const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const Destination = require("./models/Destination");
const TouristSpot = require("./models/TouristSpot");
const Hotel = require("./models/Hotel");
const Restaurant = require("./models/Restaurant");

const samplePhotos = {
  spots: [
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
  ],
  hotels: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80",
  ],
  restaurants: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  ],
};

const destinations = [
  {
    name: "Hyderabad",
    slug: "hyderabad",
    country: "India",
    description: "A historic city known for grand monuments, lively markets, and celebrated Deccan cuisine.",
    bestTimeToVisit: { from: "October", to: "February" },
    image: "https://upload.wikimedia.org/wikipedia/commons/4/43/CHARMINAR%2C_Hyderabad_01.jpg",
    imageCredit: "Nagalakshmikavuri (original), UnpetitproleX (derivative)",
    imageLicense: "CC BY-SA 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:CHARMINAR,_Hyderabad_01.jpg",
    spots: [
      { name: "Charminar", description: "An iconic four-minaret monument at the heart of the old city.", rating: 4.6, duration: "1-2 hours", bestTimeToVisit: "Morning or evening", entryFee: 50, image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg", imageCredit: "DidierTais", imageLicense: "CC BY-SA 3.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Charminar_Hyderabad_1.jpg" },
      { name: "Golconda Fort", description: "A hilltop fort complex with impressive ramparts and city views.", rating: 4.7, duration: "2-3 hours", bestTimeToVisit: "Late afternoon", entryFee: 25 },
      { name: "Salar Jung Museum", description: "A wide-ranging art and antiques collection assembled by the Salar Jung family.", rating: 4.5, duration: "2-3 hours", bestTimeToVisit: "Morning", entryFee: 50, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80" },
      { name: "Chowmahalla Palace", description: "A group of palaces known for ornate halls, courtyards, and royal collections.", rating: 4.5, duration: "1-2 hours", bestTimeToVisit: "Morning", entryFee: 100, image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=80" },
      { name: "Qutb Shahi Tombs", description: "A historic garden complex of domed tombs built for the Qutb Shahi rulers.", rating: 4.5, duration: "1-2 hours", bestTimeToVisit: "Late afternoon", entryFee: 20, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80" },
      { name: "Hussain Sagar Lake", description: "A large city lake with a central Buddha statue and waterfront paths.", rating: 4.2, duration: "1-2 hours", bestTimeToVisit: "Evening", entryFee: 0, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80" },
      { name: "Mecca Masjid", description: "One of the city's oldest mosques, set close to Charminar in the old quarter.", rating: 4.5, duration: "45 minutes", bestTimeToVisit: "Morning", entryFee: 0, image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80" },
    ],
    hotels: [
      { name: "The Deccan House", rating: 4.5, min: 3500, max: 6500, location: "Banjara Hills" },
      { name: "Old City Courtyard", rating: 4.1, min: 1800, max: 3200, location: "Abids" },
      { name: "Taj Krishna", rating: 4.6, min: 9000, max: 18000, location: "Banjara Hills", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" },
      { name: "ITC Kakatiya", rating: 4.5, min: 8500, max: 17000, location: "Begumpet", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80" },
      { name: "Park Hyatt Hyderabad", rating: 4.6, min: 10000, max: 22000, location: "Banjara Hills", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80" },
      { name: "Trident Hyderabad", rating: 4.6, min: 9500, max: 19000, location: "HITEC City", image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80" },
      { name: "Novotel Hyderabad Convention Centre", rating: 4.3, min: 6500, max: 13000, location: "HITEC City", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80" },
    ],
    restaurants: [
      { name: "Saffron Table", rating: 4.6, cuisine: "Hyderabadi", min: 350, max: 900, location: "Banjara Hills" },
      { name: "Chai & Charminar", rating: 4.3, cuisine: "Indian", min: 150, max: 450, location: "Old City" },
      { name: "Paradise Biryani", rating: 4.3, cuisine: "Hyderabadi", min: 300, max: 800, location: "Secunderabad", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" },
      { name: "Shah Ghouse", rating: 4.2, cuisine: "Hyderabadi", min: 250, max: 650, location: "Tolichowki", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80" },
      { name: "Bawarchi", rating: 4.2, cuisine: "Hyderabadi", min: 250, max: 700, location: "RTC X Roads", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80" },
      { name: "Chutneys", rating: 4.4, cuisine: "South Indian", min: 250, max: 600, location: "Banjara Hills", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80" },
      { name: "Pista House", rating: 4.1, cuisine: "Indian", min: 200, max: 550, location: "Charminar", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    name: "Goa",
    slug: "goa",
    country: "India",
    description: "A coastal escape of palm-lined beaches, Portuguese-era heritage, and relaxed local life.",
    bestTimeToVisit: { from: "November", to: "February" },
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=85",
    spots: [
      { name: "Fort Aguada", description: "A 17th-century Portuguese fort overlooking the Arabian Sea.", rating: 4.4, duration: "1-2 hours", bestTimeToVisit: "Late afternoon", entryFee: 0, image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Aguada_Fort_Top_View%2C_North_Goa.jpg", imageCredit: "Rupeshsarkar", imageLicense: "CC BY-SA 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Aguada_Fort_Top_View,_North_Goa.jpg" },
      { name: "Basilica of Bom Jesus", description: "A UNESCO-listed church known for its baroque architecture.", rating: 4.6, duration: "1 hour", bestTimeToVisit: "Morning", entryFee: 0 },
      { name: "Baga Beach", description: "A popular North Goa beach with a long shore and watersports nearby.", rating: 4.2, duration: "2-3 hours", bestTimeToVisit: "Morning or sunset", entryFee: 0, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80" },
      { name: "Dudhsagar Falls", description: "A tall waterfall on the Goa-Karnataka border, best seen in the monsoon season.", rating: 4.6, duration: "Half day", bestTimeToVisit: "Monsoon season", entryFee: 50, image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=900&q=80" },
      { name: "Chapora Fort", description: "A laterite hilltop fort with wide views over the Chapora River and coast.", rating: 4.3, duration: "1 hour", bestTimeToVisit: "Sunset", entryFee: 0, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80" },
      { name: "Se Cathedral", description: "A historic cathedral in Old Goa known for its Portuguese-era architecture.", rating: 4.4, duration: "1 hour", bestTimeToVisit: "Morning", entryFee: 0, image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=900&q=80" },
      { name: "Palolem Beach", description: "A crescent-shaped South Goa beach with a relaxed waterfront promenade.", rating: 4.5, duration: "2-3 hours", bestTimeToVisit: "Morning or sunset", entryFee: 0, image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80" },
    ],
    hotels: [
      { name: "Coconut Grove Stay", rating: 4.7, min: 5200, max: 9800, location: "Candolim" },
      { name: "The Old Quarter Inn", rating: 4.2, min: 2400, max: 4200, location: "Panjim" },
      { name: "Taj Exotica Resort & Spa", rating: 4.7, min: 18000, max: 42000, location: "Benaulim", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80" },
      { name: "W Goa", rating: 4.5, min: 22000, max: 55000, location: "Vagator", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80" },
      { name: "The Leela Goa", rating: 4.6, min: 16000, max: 38000, location: "Cavelossim", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80" },
      { name: "Grand Hyatt Goa", rating: 4.5, min: 14000, max: 32000, location: "Bambolim", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80" },
      { name: "Alila Diwa Goa", rating: 4.5, min: 12000, max: 29000, location: "Majorda", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80" },
    ],
    restaurants: [
      { name: "Saltwater Kitchen", rating: 4.5, cuisine: "Seafood", min: 500, max: 1400, location: "Candolim" },
      { name: "Casa Portuguesa", rating: 4.4, cuisine: "Goan", min: 350, max: 850, location: "Panjim" },
      { name: "Vinayak Family Restaurant", rating: 4.5, cuisine: "Goan", min: 250, max: 650, location: "Assagao", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80" },
      { name: "Fisherman's Wharf", rating: 4.3, cuisine: "Seafood", min: 500, max: 1500, location: "Cavelossim", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80" },
      { name: "Gunpowder", rating: 4.4, cuisine: "South Indian", min: 500, max: 1200, location: "Assagao", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80" },
      { name: "Ritz Classic", rating: 4.3, cuisine: "Seafood", min: 400, max: 1000, location: "Panjim", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80" },
      { name: "Thalassa", rating: 4.2, cuisine: "Greek", min: 800, max: 2000, location: "Siolim", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    name: "Bangalore",
    slug: "bangalore",
    country: "India",
    description: "India's garden city blends leafy parks, creative neighborhoods, and a thriving food scene.",
    bestTimeToVisit: { from: "October", to: "February" },
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Vidhana_Soudha%2C_front_%2801%29.jpg",
    imageCredit: "Moheen Reeyad",
    imageLicense: "CC BY-SA 4.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Vidhana_Soudha,_front_(01).jpg",
    spots: [
      { name: "Lalbagh Botanical Garden", description: "A historic botanical garden with glasshouse and walking trails.", rating: 4.5, duration: "2 hours", bestTimeToVisit: "Early morning", entryFee: 50, image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Lalbagh_Botanical_Garden_in_Bangalore_2024.jpg", imageCredit: "Aren Noronha", imageLicense: "CC BY-SA 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Lalbagh_Botanical_Garden_in_Bangalore_2024.jpg" },
      { name: "Bangalore Palace", description: "A Tudor-style palace with richly decorated interiors.", rating: 4.3, duration: "1-2 hours", bestTimeToVisit: "Late morning", entryFee: 230 },
      { name: "Cubbon Park", description: "A large green space in central Bengaluru with tree-lined walking paths.", rating: 4.5, duration: "1-2 hours", bestTimeToVisit: "Early morning", entryFee: 0, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80" },
      { name: "ISKCON Temple Bengaluru", description: "A prominent temple complex dedicated to Sri Krishna in Rajajinagar.", rating: 4.6, duration: "1-2 hours", bestTimeToVisit: "Morning or evening", entryFee: 0, image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Iskcon_Temple_from_Bengaluru_City%2C_May_2026.jpg", imageCredit: "Bkmahesh12", imageLicense: "CC BY-SA 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Iskcon_Temple_from_Bengaluru_City,_May_2026.jpg" },
      { name: "Visvesvaraya Industrial & Technological Museum", description: "An interactive science museum with exhibits for visitors of all ages.", rating: 4.4, duration: "2 hours", bestTimeToVisit: "Late morning", entryFee: 85, image: "https://images.unsplash.com/photo-1565060169194-19fabf63012b?auto=format&fit=crop&w=900&q=80" },
      { name: "Tipu Sultan's Summer Palace", description: "A compact teakwood palace with painted arches and historic exhibits.", rating: 4.2, duration: "1 hour", bestTimeToVisit: "Morning", entryFee: 25, image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80" },
      { name: "Bannerghatta Biological Park", description: "A nature and wildlife park on the southern edge of Bengaluru.", rating: 4.1, duration: "Half day", bestTimeToVisit: "Morning", entryFee: 100, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
    ],
    hotels: [
      { name: "Garden City Hotel", rating: 4.4, min: 4000, max: 7200, location: "Indiranagar" },
      { name: "MG Road Rooms", min: 2200, max: 3900, location: "Central Bangalore" },
      { name: "The Leela Palace Bengaluru", rating: 4.6, min: 16000, max: 36000, location: "Old Airport Road", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80" },
      { name: "Taj West End", rating: 4.6, min: 15000, max: 34000, location: "Race Course Road", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80" },
      { name: "ITC Gardenia", rating: 4.5, min: 12000, max: 28000, location: "Residency Road", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" },
      { name: "Shangri-La Bengaluru", rating: 4.5, min: 11000, max: 26000, location: "Vasanth Nagar", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80" },
      { name: "Conrad Bengaluru", rating: 4.4, min: 10000, max: 24000, location: "Ulsoor", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80" },
    ],
    restaurants: [
      { name: "Mango Leaf", rating: 4.5, cuisine: "South Indian", min: 250, max: 700, location: "Jayanagar" },
      { name: "Bengaluru Social", rating: 4.2, cuisine: "International", min: 500, max: 1300, location: "Indiranagar" },
      { name: "Mavalli Tiffin Rooms", rating: 4.4, cuisine: "South Indian", min: 150, max: 450, location: "Basavanagudi", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80" },
      { name: "Vidyarthi Bhavan", rating: 4.4, cuisine: "South Indian", min: 100, max: 300, location: "Basavanagudi", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80" },
      { name: "CTR (Shri Sagar)", rating: 4.3, cuisine: "South Indian", min: 120, max: 350, location: "Malleshwaram", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80" },
      { name: "Nagarjuna", rating: 4.2, cuisine: "Andhra", min: 300, max: 800, location: "Residency Road", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80" },
      { name: "Toit", rating: 4.4, cuisine: "Pub Food", min: 600, max: 1500, location: "Indiranagar", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    name: "Delhi",
    slug: "delhi",
    country: "India",
    description: "A capital city where centuries of monuments meet energetic bazaars and modern avenues.",
    bestTimeToVisit: { from: "October", to: "March" },
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Delhi_Gate_-_Full_Photo_-_Back.jpg",
    imageCredit: "IshiSenpai",
    imageLicense: "CC BY-SA 4.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Delhi_Gate_-_Full_Photo_-_Back.jpg",
    spots: [
      { name: "Humayun's Tomb", description: "A garden tomb whose design inspired later Mughal architecture.", rating: 4.7, duration: "1-2 hours", bestTimeToVisit: "Morning", entryFee: 40, image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Humayun%27s_Tomb%2C_Delhi_1.jpg", imageCredit: "Naveen R Gowda", imageLicense: "CC BY-SA 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Humayun%27s_Tomb,_Delhi_1.jpg" },
      { name: "Qutub Minar", description: "A soaring medieval minaret set within a historic archaeological complex.", rating: 4.6, duration: "1-2 hours", bestTimeToVisit: "Morning or sunset", entryFee: 40 },
      { name: "Red Fort", description: "A UNESCO-listed Mughal fort complex in the historic centre of Delhi.", rating: 4.5, duration: "2-3 hours", bestTimeToVisit: "Morning", entryFee: 35, image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80" },
      { name: "India Gate", description: "A landmark war memorial set amid broad ceremonial avenues and lawns.", rating: 4.6, duration: "1 hour", bestTimeToVisit: "Evening", entryFee: 0, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80" },
      { name: "Lotus Temple", description: "A Bahai House of Worship with a distinctive flower-inspired design.", rating: 4.5, duration: "1 hour", bestTimeToVisit: "Afternoon", entryFee: 0, image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=900&q=80" },
      { name: "Jama Masjid", description: "A landmark 17th-century mosque overlooking the lanes of Old Delhi.", rating: 4.5, duration: "1 hour", bestTimeToVisit: "Morning", entryFee: 0, image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80" },
      { name: "Akshardham Temple", description: "A large temple complex showcasing Indian art, architecture, and gardens.", rating: 4.6, duration: "2-3 hours", bestTimeToVisit: "Afternoon", entryFee: 0, image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=900&q=80" },
    ],
    hotels: [
      { name: "Lutyens Garden Hotel", rating: 4.6, min: 6500, max: 12000, location: "Central Delhi" },
      { name: "Hauz Khas House", rating: 4.1, min: 2600, max: 4800, location: "Hauz Khas" },
      { name: "The Imperial New Delhi", rating: 4.7, min: 18000, max: 45000, location: "Connaught Place", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80" },
      { name: "The Oberoi New Delhi", rating: 4.7, min: 24000, max: 56000, location: "Dr Zakir Hussain Marg", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80" },
      { name: "Taj Palace", rating: 4.6, min: 14000, max: 36000, location: "Chanakyapuri", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" },
      { name: "ITC Maurya", rating: 4.5, min: 15000, max: 38000, location: "Chanakyapuri", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80" },
      { name: "The Leela Palace New Delhi", rating: 4.6, min: 20000, max: 52000, location: "Chanakyapuri", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80" },
    ],
    restaurants: [
      { name: "Dilli Darbar", rating: 4.5, cuisine: "North Indian", min: 400, max: 1100, location: "Connaught Place" },
      { name: "Spice Route Market", rating: 4.3, cuisine: "Street Food", min: 150, max: 500, location: "Chandni Chowk" },
      { name: "Karim's", rating: 4.2, cuisine: "Mughlai", min: 300, max: 850, location: "Jama Masjid", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80" },
      { name: "Indian Accent", rating: 4.7, cuisine: "Modern Indian", min: 2500, max: 6000, location: "The Lodhi", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80" },
      { name: "Bukhara", rating: 4.5, cuisine: "North Indian", min: 2200, max: 5500, location: "ITC Maurya", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80" },
      { name: "Saravana Bhavan", rating: 4.1, cuisine: "South Indian", min: 200, max: 550, location: "Connaught Place", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80" },
      { name: "United Coffee House", rating: 4.3, cuisine: "Continental", min: 500, max: 1400, location: "Connaught Place", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" },
    ],
  },
  {
    name: "Mumbai",
    slug: "mumbai",
    country: "India",
    description: "A vibrant coastal metropolis of art deco landmarks, waterfront promenades, and street food.",
    bestTimeToVisit: { from: "November", to: "February" },
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1400&q=85",
    spots: [
      { name: "Gateway of India", description: "A landmark waterfront arch overlooking Mumbai Harbour.", rating: 4.6, duration: "1 hour", bestTimeToVisit: "Early morning", entryFee: 0, image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Panoramic_view_of_Taj_Palace_Hotel_and_Taj_Tower_with_the_iconic_Gateway_of_India_in_the_background.jpg", imageCredit: "iMahesh", imageLicense: "CC BY-SA 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Panoramic_view_of_Taj_Palace_Hotel_and_Taj_Tower_with_the_iconic_Gateway_of_India_in_the_background.jpg" },
      { name: "Chhatrapati Shivaji Maharaj Terminus", description: "A UNESCO-listed Victorian Gothic railway station.", rating: 4.5, duration: "1 hour", bestTimeToVisit: "Morning", entryFee: 0 },
      { name: "Marine Drive", description: "A sweeping waterfront boulevard known for its curve of city lights at night.", rating: 4.6, duration: "1-2 hours", bestTimeToVisit: "Sunset or evening", entryFee: 0, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80" },
      { name: "Elephanta Caves", description: "A UNESCO-listed island cave complex with historic rock-cut sculptures.", rating: 4.4, duration: "Half day", bestTimeToVisit: "Morning", entryFee: 40, image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=80" },
      { name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", description: "A major museum of Indian art, archaeology, and natural history.", rating: 4.5, duration: "2-3 hours", bestTimeToVisit: "Late morning", entryFee: 150, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80" },
      { name: "Siddhivinayak Temple", description: "A well-known Hindu temple dedicated to Lord Ganesha in Prabhadevi.", rating: 4.6, duration: "1 hour", bestTimeToVisit: "Early morning", entryFee: 0, image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/View_of_Siddhivinayak_Temple.jpg", imageCredit: "Feroze Ahmad 2", imageLicense: "CC BY-SA 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Siddhivinayak_Temple.jpg" },
      { name: "Juhu Beach", description: "A popular beach promenade known for sunset walks and local snacks.", rating: 4.1, duration: "1-2 hours", bestTimeToVisit: "Sunset", entryFee: 0, image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80" },
    ],
    hotels: [
      { name: "Marine Drive Hotel", rating: 4.5, min: 7200, max: 14500, location: "Marine Drive" },
      { name: "Bandra Guest House", rating: 4.2, min: 3000, max: 5600, location: "Bandra West" },
      { name: "The Taj Mahal Palace", rating: 4.7, min: 22000, max: 55000, location: "Colaba", image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Panoramic_view_of_Taj_Palace_Hotel_and_Taj_Tower_with_the_iconic_Gateway_of_India_in_the_background.jpg", imageCredit: "iMahesh", imageLicense: "CC BY-SA 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Panoramic_view_of_Taj_Palace_Hotel_and_Taj_Tower_with_the_iconic_Gateway_of_India_in_the_background.jpg" },
      { name: "Trident Nariman Point", rating: 4.5, min: 15000, max: 35000, location: "Nariman Point", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80" },
      { name: "The Oberoi Mumbai", rating: 4.7, min: 24000, max: 60000, location: "Nariman Point", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80" },
      { name: "The St. Regis Mumbai", rating: 4.6, min: 18000, max: 48000, location: "Lower Parel", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80" },
      { name: "ITC Maratha", rating: 4.5, min: 11000, max: 28000, location: "Andheri East", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80" },
    ],
    restaurants: [
      { name: "Harbour House", rating: 4.4, cuisine: "Seafood", min: 600, max: 1600, location: "Colaba" },
      { name: "Bombay Kitchen", rating: 4.3, cuisine: "Indian", min: 300, max: 850, location: "Fort" },
      { name: "Leopold Cafe", rating: 4.1, cuisine: "Cafe", min: 500, max: 1300, location: "Colaba", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" },
      { name: "Cafe Madras", rating: 4.4, cuisine: "South Indian", min: 150, max: 400, location: "Matunga", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80" },
      { name: "Britannia & Co.", rating: 4.3, cuisine: "Parsi", min: 350, max: 1000, location: "Ballard Estate", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80" },
      { name: "Trishna", rating: 4.4, cuisine: "Seafood", min: 900, max: 2500, location: "Fort", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80" },
      { name: "Prakash Shakahari Upahar Kendra", rating: 4.2, cuisine: "Maharashtrian", min: 120, max: 350, location: "Dadar", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80" },
    ],
  },
];

async function seed() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set in backend/.env");
  await mongoose.connect(process.env.MONGO_URI);

  let destinationCount = 0;
  let spotCount = 0;
  let hotelCount = 0;
  let restaurantCount = 0;

  for (const item of destinations) {
    const { spots, hotels, restaurants, ...destinationData } = item;
    const destination = await Destination.findOneAndUpdate(
      { slug: destinationData.slug },
      { $set: destinationData },
      { upsert: true, returnDocument: "after", runValidators: true },
    );
    destinationCount += 1;

    for (const [index, spot] of spots.entries()) {
      await TouristSpot.findOneAndUpdate(
        { destinationId: destination._id, name: spot.name },
        { $set: { ...spot, destinationId: destination._id, image: spot.image || samplePhotos.spots[index % samplePhotos.spots.length] } },
        { upsert: true, runValidators: true },
      );
      spotCount += 1;
    }

    for (const [index, hotel] of hotels.entries()) {
      const { min, max, ...details } = hotel;
      await Hotel.findOneAndUpdate(
        { destinationId: destination._id, name: hotel.name },
        { $set: { ...details, destinationId: destination._id, priceRange: { min, max }, image: hotel.image || samplePhotos.hotels[index % samplePhotos.hotels.length] } },
        { upsert: true, runValidators: true },
      );
      hotelCount += 1;
    }

    for (const [index, restaurant] of restaurants.entries()) {
      const { min, max, ...details } = restaurant;
      await Restaurant.findOneAndUpdate(
        { destinationId: destination._id, name: restaurant.name },
        { $set: { ...details, destinationId: destination._id, priceRange: { min, max }, image: restaurant.image || samplePhotos.restaurants[index % samplePhotos.restaurants.length] } },
        { upsert: true, runValidators: true },
      );
      restaurantCount += 1;
    }
  }

  console.log(`Seed complete: ${destinationCount} destinations, ${spotCount} spots, ${hotelCount} hotels, ${restaurantCount} restaurants.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });