import type { DiscoverItem, HeroContent, StoryItem } from './types';

// App
export const IMAGES = [
  {
    source: require('../assets/images/ishan-seefromthesky.jpg'),
    author: 'Ishan @seefromthesky',
  },
  {
    source: require('../assets/images/mohamed-sameeh.jpg'),
    author: 'Mohamed Sameeh',
  },
  {
    source: require('../assets/images/andrew-pons.jpg'),
    author: 'Andrew Pons',
  },
  {
    source: require('../assets/images/luke-mummert.jpg'),
    author: 'Luke Mummert',
  },
  {
    source: require('../assets/images/paolo-nicolello.jpg'),
    author: 'Paolo Nicolello',
  },
];

// Demo screen
export const HERO_ITEM: HeroContent = {
  source: require('../assets/images/ishan-seefromthesky.jpg'),
  title: 'Crystal Waters',
  subtitle:
    'Discover hidden paradise islands with pristine beaches and vibrant turquoise waters',
  badgeText: 'Featured',
};

export const DISCOVER_ITEMS: DiscoverItem[] = [
  {
    source: require('../assets/images/mohamed-sameeh.jpg'),
    title: 'Festival Lights',
    location: 'Marrakech',
  },
  {
    source: require('../assets/images/andrew-pons.jpg'),
    title: 'Red Canyons',
    location: 'Utah',
  },
  {
    source: require('../assets/images/luke-mummert.jpg'),
    title: 'Golden Gate',
    location: 'San Francisco',
  },
  {
    source: require('../assets/images/paolo-nicolello.jpg'),
    title: 'Hidden Falls',
    location: 'Iceland',
  },
];

export const STORY_ITEMS: StoryItem[] = [
  {
    source: require('../assets/images/luke-mummert.jpg'),
    title: 'Crossing the Golden Gate',
    excerpt:
      'A golden hour walk across the iconic bridge with the city skyline in the distance.',
    meta: '8 min · Sarah Kim',
  },
  {
    source: require('../assets/images/andrew-pons.jpg'),
    title: 'Above the Red Canyons',
    excerpt:
      'Aerial views reveal sculpted sandstone labyrinths hidden beneath the clouds.',
    meta: '5 min · James Chen',
  },
  {
    source: require('../assets/images/paolo-nicolello.jpg'),
    title: 'Chasing Waterfalls in Iceland',
    excerpt:
      'Moss-covered gorges, turquoise pools, and cascades carved into ancient rock.',
    meta: '6 min · Elena Rossi',
  },
];

// Custom image screen
export const CUSTOM_HERO_ITEM = {
  title: 'Lorem ipsum dolor sit amet',
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  badgeText: 'Lorem',
};

export const STORY_ITEM = {
  title: 'Lorem ipsum dolor',
  excerpt:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  meta: 'Lorem · Ipsum',
};

export const DISCOVER_ITEM = {
  title: 'Lorem ipsum',
  location: 'Dolor sit amet',
};
