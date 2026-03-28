/**
 * gallery-data.js
 * ──────────────────────────────────────────────────────────────
 * Configuration for the Gallery section.
 *
 * FIELDS:
 *   title       — Card heading
 *   category    — "web-app" | "design" | "mobile"
 *   description — Short text revealed on hover (~120 chars)
 *   imagePaths  — Array of image paths (shows one at a time, auto-cycles)
 *                 Use a single-item array if you only have one image.
 *
 * HOW TO ADD IMAGES TO A CARD:
 *   Just add more paths to the imagePaths array.
 *   Images cycle automatically every 3 seconds when the card is visible.
 *   Example:
 *     imagePaths: [
 *       "./gallery/my-project-1.jpg",
 *       "./gallery/my-project-2.jpg",
 *       "./gallery/my-project-3.jpg"
 *     ]
 *
 * HOW TO ADD A NEW CARD:
 *   1. Drop image(s) into the /gallery/ folder.
 *   2. Copy one object below, fill in all fields, append to the array.
 * ──────────────────────────────────────────────────────────────
 */

const GALLERY_DATA = [
  {
    title: "Fast Food Website",
    category: "web-app",
    description: "Moderna web stranica za fast food restoran — meni, narudžbe i atraktivan dizajn.",
    imagePaths: [
      "./gallery/fastfood/1ee93a8a-daa8-4efa-b886-54f02cfd20b5.png",
      "./gallery/fastfood/a3f1bafb-7a43-4267-887e-b7d30503bc96.png",
      "./gallery/fastfood/a74de34a-da90-406a-8650-ce8a46543c3b.png",
      "./gallery/fastfood/afd69832-2cfe-4549-b7fe-1a9ba425bdb9.png",
      "./gallery/fastfood/eb584088-615d-4852-a08d-f4d2b600631e.png"
    ]
  },
  {
    title: "Dental Clinic UI",
    category: "web-app",
    description: "Appointment booking interface with real-time availability, patient profiles, and confirmation emails.",
    imagePaths: [
      "./gallery/dental/smile_enhanced_0.png",
      "./gallery/dental/smile_enhanced_1.png",
      "./gallery/dental/smile_enhanced_2.png",
      "./gallery/dental/smile_enhanced_3.png"
    ]
  },
  {
    title: "Restaurant Panorama",
    category: "web-app",
    description: "Full-stack restaurant site with table reservations, menu management, and multilingual support.",
    imagePaths: [
      "./gallery/panorama/enhanced_image.jpg",
      "./gallery/panorama/enhanced_0.jpg",
      "./gallery/panorama/enhanced_1.jpg",
      "./gallery/panorama/enhanced_2.jpg",
      "./gallery/panorama/enhanced_3.jpg",
      "./gallery/panorama/enhanced_4.jpg"
    ]
  },
  {
    title: "Reinigungs Unternehmen",
    category: "web-app",
    description: "Profesionalna web stranica za firmu za čišćenje — usluge, galerija i kontakt forma.",
    imagePaths: [
      "./gallery/reinigung/66427d8de43051c38c6b7ff3_cc-carpetcleanmodel22.png",
      "./gallery/reinigung/7745bf1b-4491-40a3-8aef-ec9081a85ff9.png",
      "./gallery/reinigung/f3560742-b859-4472-a8f1-642027f7a339.png"
    ]
  },
  {
    title: "Yade Pflege",
    category: "web-app",
    description: "Web platform for an ambulatory nursing service — patient management, scheduling, and care documentation.",
    imagePaths: [
      "./gallery/pflege/yade_enhanced_0.jpg",
      "./gallery/pflege/yade_enhanced_1.jpg",
      "./gallery/pflege/yade_enhanced_2.jpg",
      "./gallery/pflege/yade_enhanced_3.jpg",
      "./gallery/pflege/yade_enhanced_4.jpg",
      "./gallery/pflege/yade_enhanced_5.jpg"
    ]
  },
];
