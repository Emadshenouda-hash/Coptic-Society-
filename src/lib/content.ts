import {
  Baby,
  BookOpen,
  HeartHandshake,
  Landmark,
  PersonStanding,
  Stethoscope,
  Users,
} from 'lucide-react';
import type { NewsArticle, Program } from './definitions';

export const programs: Program[] = [
  {
    id: 'social-assistance',
    title: 'Social Assistance',
    icon: HeartHandshake,
    description:
      'We provide a comprehensive support system for individuals and families facing hardship. Our services include financial aid, food and clothing distribution, emergency relief, and support for marriage, housing, and funerals. We also offer microloans to empower individuals to start small businesses and achieve financial independence.',
    gallery: ['program-social-1', 'program-social-2'],
  },
  {
    id: 'healthcare',
    title: 'Healthcare Services',
    icon: Stethoscope,
    description:
      'Access to affordable healthcare is a cornerstone of our mission. We operate social clinics, medical centers, and mobile medical convoys to reach underserved communities. We also provide essential medications and support for patients with chronic illnesses.',
    gallery: ['program-health-1', 'program-health-2'],
  },
  {
    id: 'education-training',
    title: 'Education & Training',
    icon: BookOpen,
    description:
      'Education is the key to a brighter future. We establish nurseries and schools, offer scholarships, and provide vocational training for women and youth. Our programs are designed to equip individuals with the skills and knowledge they need to succeed.',
    gallery: ['program-edu-1', 'program-edu-2'],
  },
  {
    id: 'cultural-religious',
    title: 'Cultural & Religious Activities',
    icon: Landmark,
    description:
      'We aim to enrich the community by promoting cultural, scientific, and religious awareness. We organize lectures, seminars, cultural festivals, and run libraries. Our activities are designed to preserve heritage and foster a sense of community.',
    gallery: ['program-culture-1'],
  },
  {
    id: 'community-development',
    title: 'Community Development',
    icon: Users,
    description:
      'Building strong communities is essential for social progress. We initiate environmental clean-up campaigns, participate in public-benefit projects, and collaborate with governmental and non-governmental organizations to combat poverty and illiteracy.',
    gallery: ['program-community-1'],
  },
  {
    id: 'elderly-care',
    title: 'Elderly Care',
    icon: PersonStanding,
    description:
      'We honor our elders by providing them with the care and respect they deserve. Our services include operating senior homes that offer a safe and comfortable environment, as well as providing in-home support and social activities to ensure their well-being.',
    gallery: ['program-elderly-1'],
  },
  {
    id: 'child-protection',
    title: 'Child Protection',
    icon: Baby,
    description:
      'We are committed to protecting and nurturing the next generation. We run kindergartens, after-school clubs, and summer camps. We also have sponsorship programs for orphans and initiatives to support street children, providing them with a safe path to a better life.',
    gallery: ['program-child-1'],
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    slug: 'annual-charity-gala-success',
    title: 'Annual Charity Gala Raises Record Amount for Community Programs',
    date: '2023-10-28',
    image: 'news-1',
    excerpt:
      'Our annual charity gala was a tremendous success, bringing together supporters from all walks of life. We are thrilled to announce that we raised a record amount this year, which will go directly to funding our vital social assistance and education programs.',
    content:
      '<p>The grand ballroom was filled with an atmosphere of generosity and hope at our annual charity gala. Thanks to our sponsors, donors, and dedicated volunteers, we surpassed our fundraising goals. These funds are crucial for expanding our reach and helping more families in need throughout the coming year. The evening featured inspiring stories from beneficiaries, a silent auction, and a performance by a local youth choir. We extend our heartfelt gratitude to everyone who contributed to making this night a landmark event for our community.</p>',
  },
  {
    id: '2',
    slug: 'new-vocational-center-opens',
    title: 'New Vocational Training Center Opens in Cairo',
    date: '2023-09-15',
    image: 'news-2',
    excerpt:
      'We are proud to announce the grand opening of our new vocational training center in the heart of Cairo. The center will offer courses in tailoring, computer skills, and carpentry to empower local youth and women.',
    content:
      '<p>The new vocational center is equipped with modern tools and taught by experienced instructors. Our goal is to provide practical skills that lead to meaningful employment and financial stability. The opening ceremony was attended by community leaders and the first cohort of students, who expressed their excitement and gratitude for the new opportunity. This project was made possible by a generous grant from the Future Foundation and donations from our community.</p>',
  },
  {
    id: '3',
    slug: 'winter-clothing-drive',
    title: 'Successful Winter Clothing Drive Provides Warmth to Over 500 Families',
    date: '2023-08-05',
    image: 'news-3',
    excerpt:
      'Our recent winter clothing drive was a heartwarming success. Thanks to the overwhelming generosity of our community, we were able to provide warm clothing, blankets, and heaters to over 500 families ahead of the cold season.',
    content:
      '<p>Volunteers worked tirelessly sorting and distributing the donations. The response from the community was incredible, with individuals and businesses dropping off high-quality items. "Seeing the relief and smiles on the faces of the families makes it all worthwhile," said a long-time volunteer. We are deeply grateful to everyone who participated and helped share the warmth this winter.</p>',
  },
];
