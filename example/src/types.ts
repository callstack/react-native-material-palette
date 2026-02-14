import type { ImageSourcePropType, LayoutChangeEvent } from 'react-native';

export type HeroContent = {
  source: ImageSourcePropType;
  title: string;
  subtitle: string;
  badgeText: string;
};

export type DiscoverItem = {
  source: ImageSourcePropType;
  title: string;
  location: string;
};

export type StoryItem = {
  source: ImageSourcePropType;
  title: string;
  excerpt: string;
  meta: string;
};

export type DemoProps = {
  sourceOverride?: ImageSourcePropType;
  content?: {
    hero: HeroContent;
    discover: DiscoverItem | DiscoverItem[];
    stories: StoryItem | StoryItem[];
  };
};

export type CustomDemoProps = {
  imageSource: ImageSourcePropType;
  onLayout: (event: LayoutChangeEvent) => void;
};
