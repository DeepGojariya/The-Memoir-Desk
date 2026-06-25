import { PolaroidItem, WishNote, WeddingEvent } from "./types";

export const initialPolaroidMemories: PolaroidItem[] = [
  {
    id: "twirling_love",
    title: "The Golden Dance",
    caption: "Dancing in the afternoon sun ✨",
    description: "Our happy pre-wedding dance. Laughing, twirling, and losing count of steps.",
    initialImage: "/assets/DSC09671@21929922.JPG",
    userImage: null,
    date: "October 14, 2024",
    defaultX: 80,
    defaultY: 90,
    rotate: -6,
    category: "Pre-Wedding",
    story: "This was captured in the afternoon. We started practicing a basic steps routine, but both of us kept making mistakes. The sun was warm, the light was golden, and your laughter made everything perfect. In this dress of lavender and peach, you looked like a dream."
  },
  {
    id: "beaming_moments",
    title: "Sun-Kissed & Smiling",
    caption: "Too cool with our shades on 🕶️❤️",
    description: "Leaning against the warm clay wall, sharing secrets and shades.",
    initialImage: "/assets/DSC09814@20060745.JPG",
    userImage: null,
    date: "October 14, 2024",
    defaultX: 380,
    defaultY: 40,
    rotate: 5,
    category: "Pre-Wedding",
    story: "We decided to put on our shades to block the strong glare of the sun, and the photographer shouted 'Hold on! Don't move!'. We ended up burst into authentic, happy laughter. That beige sandstone wall felt so warm against our backs."
  },
  {
    id: "warm_embrace",
    title: "In Your Arms",
    caption: "Always your safe place.. 💞",
    description: "Holding each other close, feeling the heartbeat of forever.",
    initialImage: "/assets/e7a3d597-745e-431f-9ae7-02bd76778831_2.JPG",
    userImage: null,
    date: "October 14, 2024",
    defaultX: 700,
    defaultY: 100,
    rotate: -4,
    category: "Pre-Wedding",
    story: "A quiet moment amidst all the photoshoot hectic running. I whispered a silly joke in your ear, and you leaned into my shoulder, holding me tight. It felt as if time stood absolutely still, leaving just you and me."
  },
  {
    id: "sacred_fire",
    title: "Vows by the Sacred Flame",
    caption: "Bound by 7 lifetimes and a holy fire 🔥",
    description: "Offering prayers to Agni Dev, weaving our futures together.",
    initialImage: "/assets/63dd85b8-4e90-4e5f-89a0-fc0cf13a75c9.JPG",
    userImage: null,
    date: "January 24, 2025",
    defaultX: 130,
    defaultY: 370,
    rotate: 4,
    category: "Rituals",
    story: "The Vedic mantras filled the air. With detailed henna on your palms and the traditional red bangles chiming, we held hands over the holy Agni fire to perform our offerings. Every promise we spoke aloud echoed deep in our hearts."
  },
  {
    id: "pool_splash",
    title: "The Joyous Splash!",
    caption: "Water, laughter, and pure chaos! 💦",
    description: "Getting hit by the spray and loving every single second.",
    initialImage: "/assets/65517470-6778-4e23-b5c8-27f7549d89ab.JPG",
    userImage: null,
    date: "January 23, 2025",
    defaultX: 430,
    defaultY: 410,
    rotate: -5,
    category: "Fun",
    story: "This was during our Haldi after-party by the pool! Someone managed to get a hold of the water pipe and aimed directly at us. We ducked and held on to each other, totally drenched but screaming from laughter. One of our most candid, wild wedding moments."
  },
  {
    id: "fireworks_entry",
    title: "A Midnight Sparks Spectacle",
    caption: "Our happily ever after begins 🎆",
    description: "Walking hand-in-hand under a painted smoke sky filled with sparks.",
    initialImage: "/assets/IMG_4142.JPG",
    userImage: null,
    date: "January 24, 2025",
    defaultX: 730,
    defaultY: 360,
    rotate: 7,
    category: "Celebration",
    story: "Our grand reception walk was phenomenal. As we lifted our hands in absolute joy, the cold pyros sparked up on the sides, and vibrant clouds of red, orange, and teal smoke erupted in the sky. Standing there hearing everybody cheer, holding you tight, it felt like the grand, magical finale to our beautiful wedding journey."
  }
];

export const initialWishes: WishNote[] = [
  {
    id: "wish_1",
    author: "Mom & Dad",
    message: "May your life together be filled with endless laughter, deep patience, and unconditional love. We are so incredibly proud of you both! ❤️",
    color: "#FFF9E6", // warm cream yellow
    x: 100,
    y: 80,
    rotate: -4,
    date: "Jan 24, 2025"
  },
  {
    id: "wish_2",
    author: "Kinjal (Sister)",
    message: "Still can't believe my partner-in-crime is married! To the most beautiful couple—always keep dancing, splashing, and smiling! 🌸✨",
    color: "#FFF0F5", // blush lavender pink
    x: 420,
    y: 110,
    rotate: 5,
    date: "Jan 24, 2025"
  },
  {
    id: "wish_3",
    author: "Rahul, Sameer & Dev",
    message: "Bro, you found your absolute perfect match. Sending you guys unlimited happiness, epic roadtrips, and continuous party vibes! Happy married life, guys! 🍻🚗",
    color: "#E0F7FA", // pastel mint blue
    x: 740,
    y: 90,
    rotate: -6,
    date: "Jan 25, 2025"
  },
  {
    id: "wish_4",
    author: "Uncle Mahesh & Aunt Shaili",
    message: "Blessings to you on this grand voyage. Remember that a happy marriage is constructed on fine conversations and little kindnesses.",
    color: "#F1F8E9", // pastel celery green
    x: 260,
    y: 280,
    rotate: 3,
    date: "Jan 24, 2025"
  },
  {
    id: "wish_5",
    author: "Kavya & Sneha",
    message: "The pool photo is literally the best thing ever! Love you guys so much. Wishing you a lifetime of water fights and beautiful sunset dances. 🌊💑🎉",
    color: "#FFF3E0", // pastel apricot orange
    x: 580,
    y: 290,
    rotate: -3,
    date: "Jan 25, 2025"
  }
];

export const availableStickers = [
  { id: "st_heart", label: "❤️ Sweet Heart" },
  { id: "st_rings", label: "💍 Golden Rings" },
  { id: "st_sparkles", label: "✨ Sparks" },
  { id: "st_flowers", label: "💐 Rose Bouquet" },
  { id: "st_love_letter", label: "💌 Love Letter" },
  { id: "st_glass", label: "🥂 Toast Glass" },
  { id: "st_stars", label: "⭐ Magic Stars" },
  { id: "st_twinkles", label: "🌟 Twinkle" },
  { id: "st_love_label", label: "🏷️ 'Together' Label" },
  { id: "st_forever_label", label: "🏷️ 'Forever' Sticker" }
];

export const weddingEvents: WeddingEvent[] = [
  {
    title: "Lagno & Sacred Pheras (The Wedding)",
    date: "January 24, 2025",
    time: "4:30 PM",
    venue: "The Golden Pavilion & Courtyard",
    description: "The main traditional holy ceremony. With sacred vedic mantras chanted by the pandit, we encircled the holy fire seven times, taking permanent vows under glass arches.",
    iconName: "Flame",
    photos: [
      { url: "/assets/m1.jpg", caption: "Sacred Fire Bond 🔥" },
      { url: "/assets/m2.jpg", caption: "Wedding Rituals ✨" },
      { url: "/assets/m3.jpg", caption: "Vows of Togetherness 💍" },
      { url: "/assets/m4.JPG", caption: "Divine Blessings 🙏" },
      { url: "/assets/m5.jpg", caption: "Happily Ever After ❤️" }
    ]
  },
  {
    title: "Golden Saffron: Haldi & Mandap Muhurat",
    date: "January 23, 2025",
    time: "10:00 AM",
    venue: "The Horizon Poolside Deck & Sacred Canopy",
    description: "A beautiful blend of rituals. Starting with the joyful purification of golden turmeric paste (Haldi) by the pool with live dhol beats & water splash, followed by the auspicious prayers in setting up the wedding Mandap canopy.",
    iconName: "Droplet",
    photos: [
      { url: "/assets/h1.jpg", caption: "The Big Splash 💦" },
      { url: "/assets/h2.jpg", caption: "Turmeric Glee 🌻" },
      { url: "/assets/h3.jpg", caption: "Turmeric Gold 🌟" },
      { url: "/assets/h4.jpg", caption: "Floral Shower Thrill 🌷" },
      { url: "/assets/h5.jpg", caption: "Joy & Grins 😀" }
    ]
  },
  {
    title: "Sangeet & Glimmering Dance Night",
    date: "January 22, 2025",
    time: "7:00 PM",
    venue: "Grand Crystal Ballroom",
    description: "A magical night of glamorous lighting, emotional family dance performances, endless music, and a grand magical couple dance to set off the celebrations.",
    iconName: "Music",
    photos: [
      { url: "/assets/s1.jpg", caption: "Glitz & Beats 🎶" },
      { url: "/assets/s2.jpg", caption: "Creative Moves 💃" },
      { url: "/assets/s3.jpg", caption: "Center Stage ✨" },
      { url: "/assets/s4.jpg", caption: "Dance Circle 🕺" },
      { url: "/assets/s5.jpg", caption: "Sparkling Joy 💖" }
    ]
  },
  {
    title: "The Prelude: Pre-Wedding Chronicles",
    date: "October 14, 2024",
    time: "4:00 PM",
    venue: "Amber Sands & Whispering Lakes",
    description: "Before the grand celebration began, we spent a quiet afternoon capturing raw, candid smiles, soft wind-blown hair, and silent glances that whispered of a beautiful forever.",
    iconName: "Camera",
    photos: [
      { url: "/assets/p1.jpg", caption: "The Golden Twirl 💫" },
      { url: "/assets/p2.jpg", caption: "Sun-Kissed Grins 😎" },
      { url: "/assets/p3.JPG", caption: "Soulmate Warmth 🤗" },
      { url: "/assets/p4.JPG", caption: "Golden Horizon 🌅" },
      { url: "/assets/p5.png", caption: "Palace Walkways 🏰" }
    ]
  }
];
