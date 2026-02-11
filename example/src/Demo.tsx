import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { Palette } from 'react-native-material-palette';

const DISCOVER_CARD_WIDTH_RATIO = 0.38;

const COLORS = {
  background: '#FAFAFA',
  text: '#1A1A1A',
  fallbackDark: '#2A2A2A',
  fallbackDarkTitle: '#FFFFFF',
  fallbackDarkBody: '#CCCCCC',
  fallbackLight: '#F0F0F0',
  fallbackLightTitle: '#1A1A1A',
  fallbackLightBody: '#555555',
};

const SPACING = 4;
const PADDING = SPACING * 5;
const GAP = SPACING * 3;
const ROUNDNESS = SPACING * 4;
const HERO_IMAGE_HEIGHT = SPACING * 55;
const STORY_IMAGE_WIDTH = SPACING * 28;
const STORY_IMAGE_HEIGHT = SPACING * 33;
const DOT_SIZE = SPACING * 1.5;

const FALLBACK_DARK = {
  color: COLORS.fallbackDark,
  titleTextColor: COLORS.fallbackDarkTitle,
  bodyTextColor: COLORS.fallbackDarkBody,
};

const FALLBACK_LIGHT = {
  color: COLORS.fallbackLight,
  titleTextColor: COLORS.fallbackLightTitle,
  bodyTextColor: COLORS.fallbackLightBody,
};

const HERO_IMAGE = require('../assets/images/ishan-seefromthesky.jpg');

const DISCOVER_ITEMS = [
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

const STORY_ITEMS = [
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

export default function Demo() {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Explore</Text>

        <HeroCard />

        <Text style={styles.sectionTitle}>Discover</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.discoverScroll}
        >
          {DISCOVER_ITEMS.map((item, i) => (
            <DiscoverCard key={i} {...item} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Stories</Text>
        {STORY_ITEMS.map((item, i) => (
          <StoryCard key={i} {...item} />
        ))}
      </ScrollView>
    </View>
  );
}

function HeroCard() {
  return (
    <Palette.View
      source={HERO_IMAGE}
      type="darkMuted"
      fallback={FALLBACK_DARK}
      style={styles.heroCard}
    >
      <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="cover" />
      <View style={styles.heroContent}>
        <Palette.View
          source={HERO_IMAGE}
          type="vibrant"
          fallback={FALLBACK_DARK}
          style={styles.badge}
        >
          <Palette.Text variant="titleTextColor" style={styles.badgeText}>
            Featured
          </Palette.Text>
        </Palette.View>
        <Palette.Text variant="titleTextColor" style={styles.heroTitle}>
          Crystal Waters
        </Palette.Text>
        <Palette.Text variant="bodyTextColor" style={styles.heroSubtitle}>
          Discover hidden paradise islands with pristine beaches and vibrant
          turquoise waters
        </Palette.Text>
      </View>
    </Palette.View>
  );
}

function DiscoverCard({
  source,
  title,
  location,
}: {
  source: ImageSourcePropType;
  title: string;
  location: string;
}) {
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

function StoryCard({
  source,
  title,
  excerpt,
  meta,
}: {
  source: ImageSourcePropType;
  title: string;
  excerpt: string;
  meta: string;
}) {
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
    paddingTop: (StatusBar.currentHeight ?? 0) + PADDING,
    paddingBottom: PADDING * 2,
  },
  header: {
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
