import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Palette } from 'react-native-material-palette';
import { HERO_ITEM, DISCOVER_ITEMS, STORY_ITEMS } from '../data';
import type { DemoProps, DiscoverItem, HeroContent, StoryItem } from '../types';
import {
  PADDING,
  SPACING,
  GAP,
  ROUNDNESS,
  HERO_IMAGE_HEIGHT,
  STORY_IMAGE_WIDTH,
  STORY_IMAGE_HEIGHT,
  DOT_SIZE,
  DISCOVER_CARD_WIDTH_RATIO,
  COLORS,
  FALLBACK_DARK,
  FALLBACK_LIGHT,
} from '../constants';

const toArray = <T,>(value: T | T[]) =>
  Array.isArray(value) ? value : [value];

export default function Demo({ sourceOverride, content }: DemoProps) {
  const {
    hero = HERO_ITEM,
    discover = DISCOVER_ITEMS,
    stories = STORY_ITEMS,
  } = content ?? {};

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={
          content ? styles.scrollContent : styles.scrollNoContent
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Explore</Text>
        <HeroCard {...hero} />

        <Text style={styles.sectionTitle}>Discover</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.discoverScroll}
        >
          {toArray(discover).map((item, i) => (
            <DiscoverCard
              key={i}
              source={sourceOverride ?? item.source}
              title={item.title}
              location={item.location}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Stories</Text>
        {toArray(stories).map((item, i) => (
          <StoryCard
            key={i}
            source={sourceOverride ?? item.source}
            title={item.title}
            excerpt={item.excerpt}
            meta={item.meta}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function HeroCard({ source, title, subtitle, badgeText }: HeroContent) {
  return (
    <Palette.View
      source={source}
      type="darkMuted"
      fallback={FALLBACK_DARK}
      style={styles.heroCard}
    >
      <Image source={source} style={styles.heroImage} resizeMode="cover" />
      <View style={styles.heroContent}>
        <Palette.View
          source={source}
          type="vibrant"
          fallback={FALLBACK_DARK}
          style={styles.badge}
        >
          <Palette.Text variant="titleTextColor" style={styles.badgeText}>
            {badgeText}
          </Palette.Text>
        </Palette.View>
        <Palette.Text variant="titleTextColor" style={styles.heroTitle}>
          {title}
        </Palette.Text>
        <Palette.Text variant="bodyTextColor" style={styles.heroSubtitle}>
          {subtitle}
        </Palette.Text>
      </View>
    </Palette.View>
  );
}

function DiscoverCard({ source, title, location }: DiscoverItem) {
  const { width } = useWindowDimensions();
  const cardWidth = width * DISCOVER_CARD_WIDTH_RATIO;

  return (
    <Palette.View
      source={source}
      type="darkVibrant"
      fallback={FALLBACK_DARK}
      style={[styles.discoverCard, { width: cardWidth }]}
    >
      <Image
        source={source}
        style={[styles.discoverImage, { height: cardWidth * 1.15 }]}
        resizeMode="cover"
      />
      <View style={styles.discoverContent}>
        <Palette.Text variant="titleTextColor" style={styles.discoverTitle}>
          {title}
        </Palette.Text>
        <Palette.Text variant="bodyTextColor" style={styles.discoverLocation}>
          {location}
        </Palette.Text>
      </View>
    </Palette.View>
  );
}

function StoryCard({ source, title, excerpt, meta }: StoryItem) {
  return (
    <Palette.View
      source={source}
      type="lightMuted"
      fallback={FALLBACK_LIGHT}
      style={styles.storyCard}
    >
      <Image source={source} style={styles.storyImage} resizeMode="cover" />
      <View style={styles.storyContent}>
        <Palette.Text
          variant="titleTextColor"
          style={styles.storyTitle}
          numberOfLines={1}
        >
          {title}
        </Palette.Text>
        <Palette.Text
          variant="bodyTextColor"
          style={styles.storyExcerpt}
          numberOfLines={2}
        >
          {excerpt}
        </Palette.Text>
        <View style={styles.storyMetaRow}>
          <Palette.View
            source={source}
            type="vibrant"
            fallback={FALLBACK_DARK}
            style={styles.storyDot}
          />
          <Palette.Text variant="bodyTextColor" style={styles.storyMeta}>
            {meta}
          </Palette.Text>
        </View>
      </View>
    </Palette.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: PADDING * 2,
    paddingBottom: PADDING,
  },
  scrollNoContent: {
    paddingTop: (StatusBar.currentHeight ?? 0) + PADDING,
    paddingBottom: PADDING * 2,
  },
  header: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text,
    marginHorizontal: PADDING,
    marginBottom: SPACING * 3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
    marginHorizontal: PADDING,
    marginBottom: PADDING,
  },
  contentHeader: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text,
    marginHorizontal: PADDING,
    marginBottom: PADDING,
  },
  heroCard: {
    marginHorizontal: PADDING,
    borderRadius: ROUNDNESS + SPACING,
    overflow: 'hidden',
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: HERO_IMAGE_HEIGHT,
  },
  heroContent: {
    padding: SPACING * 4,
    gap: SPACING * 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: GAP,
    paddingVertical: SPACING + 1,
    borderRadius: ROUNDNESS + SPACING,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: PADDING,
    marginTop: PADDING + GAP,
    marginBottom: SPACING * 4,
  },
  discoverScroll: {
    paddingHorizontal: PADDING,
    gap: GAP,
  },
  discoverCard: {
    borderRadius: ROUNDNESS,
    overflow: 'hidden',
    elevation: 4,
  },
  discoverImage: {
    width: '100%',
  },
  discoverContent: {
    padding: GAP,
  },
  discoverTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  discoverLocation: {
    fontSize: 13,
    marginTop: SPACING / 2,
  },
  storyCard: {
    marginHorizontal: PADDING,
    marginBottom: GAP,
    borderRadius: ROUNDNESS,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
  },
  storyImage: {
    width: STORY_IMAGE_WIDTH,
    height: STORY_IMAGE_HEIGHT,
  },
  storyContent: {
    flex: 1,
    padding: GAP + SPACING / 2,
    justifyContent: 'center',
    gap: SPACING,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  storyExcerpt: {
    fontSize: 13,
    lineHeight: 18,
  },
  storyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DOT_SIZE,
    marginTop: SPACING,
  },
  storyDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  storyMeta: {
    fontSize: 12,
  },
});
