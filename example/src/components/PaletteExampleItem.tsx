import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { Palette } from 'react-native-material-palette';
import { PALETTE_TYPES, LIGHT_BACKGROUND_TARGET, SPACING } from '../constants';

const ROUNDNESS = 10;

export default function PaleteExampleItem({
  image,
  author,
}: {
  image: ImageSourcePropType;
  author?: string;
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
      {author ? (
        <Palette.Text style={styles.author}>Credits: {author}</Palette.Text>
      ) : null}
    </Palette.View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    padding: SPACING * 2,
    borderRadius: ROUNDNESS + SPACING * 2,
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
    margin: SPACING,
  },
  palettes: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  palette: {
    width: '50%',
    padding: SPACING,
  },
  color: {
    alignItems: 'center',
    padding: SPACING * 2,
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
    margin: SPACING,
    fontStyle: 'italic',
  },
});
