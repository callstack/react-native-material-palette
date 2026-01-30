import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import {
  Palette,
  type PaletteResult,
  type PaletteTarget,
} from 'react-native-material-palette';

const PALETTE_TYPES: (keyof PaletteResult)[] = [
  'vibrant',
  'lightVibrant',
  'darkVibrant',
  'muted',
  'lightMuted',
  'darkMuted',
];

const IMAGES = [
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

const LIGHT_BACKGROUND_TARGET: PaletteTarget = {
  targetLightness: 0.75,
  minimumLightness: 0.65,
  maximumLightness: 1.0,
  targetSaturation: 0.1,
  minimumSaturation: 0.0,
  maximumSaturation: 0.6,
  lightnessWeight: 0.5,
  saturationWeight: 0.1,
  populationWeight: 0.5,
  exclusive: false,
};

const ROUNDNESS = 10;
const SPACING = 8;

export default function App() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {IMAGES.map((img, index) => (
        <ExampleItem key={index} image={img.source} author={img.author} />
      ))}
    </ScrollView>
  );
}

function ExampleItem({
  image,
  author,
}: {
  image: ImageSourcePropType;
  author: string;
}) {
  return (
    <Palette.View
      source={image}
      type={LIGHT_BACKGROUND_TARGET}
      style={styles.item}
    >
      <View style={styles.underlay} />
      <View style={styles.row}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <View style={styles.palettes}>
          {PALETTE_TYPES.map((type) => (
            <View key={type} style={styles.palette}>
              <Palette.View
                key={type}
                source={image}
                type={type}
                fallback={{
                  color: '#ffffff',
                  titleTextColor: '#000000',
                  bodyTextColor: '#000000',
                }}
                style={styles.color}
              >
                <Palette.Text variant="titleTextColor" style={styles.title}>
                  {type}
                </Palette.Text>
                <Palette.Text variant="bodyTextColor" style={styles.subtitle}>
                  subtitle
                </Palette.Text>
              </Palette.View>
            </View>
          ))}
        </View>
      </View>
      <Palette.Text style={styles.author}>Credits: {author}</Palette.Text>
    </Palette.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  content: {
    padding: SPACING * 2,
    paddingTop: SPACING * 2 + (StatusBar.currentHeight ?? 0),
    paddingBottom: SPACING * 2 + 10,
    gap: SPACING * 2,
  },
  item: {
    width: '100%',
    padding: SPACING,
    borderRadius: ROUNDNESS + SPACING,
    overflow: 'hidden',
  },
  underlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#e0e0e0',
    mixBlendMode: 'luminosity',
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    flexGrow: 1,
    height: null,
    width: null,
    borderRadius: ROUNDNESS,
    margin: SPACING / 2,
  },
  palettes: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  palette: {
    width: '50%',
    padding: SPACING / 2,
  },
  color: {
    alignItems: 'center',
    padding: SPACING,
    borderRadius: ROUNDNESS,
    overflow: 'hidden',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  author: {
    margin: SPACING / 2,
    fontStyle: 'italic',
  },
});
