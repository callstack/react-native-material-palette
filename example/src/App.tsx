import { useEffect, useState } from 'react';
import {
  BackHandler,
  PlatformColor,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import CustomImage from './screens/CustomImage';
import Demo from './screens/Demo';
import { COLORS, SPACING } from './constants';
import { IMAGES } from './data';
import PaletteExampleItem from './components/PaletteExampleItem';

const ROUNDNESS = 10;

export default function App() {
  const [screen, setScreen] = useState<'home' | 'demo' | 'custom'>('home');

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (screen === 'demo' || screen === 'custom') {
          setScreen('home');
          return true;
        }

        return false;
      }
    );

    return () => subscription.remove();
  }, [screen]);

  if (screen === 'demo') {
    return <Demo />;
  }

  if (screen === 'custom') {
    return <CustomImage />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {IMAGES.map((img, index) => (
        <PaletteExampleItem
          key={index}
          image={img.source}
          author={img.author}
        />
      ))}
      <Pressable style={styles.button} onPress={() => setScreen('demo')}>
        <Text style={styles.buttonLabel}>Go to Demo</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => setScreen('custom')}>
        <Text style={styles.buttonLabel}>Build Demo from URL / gallery</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING * 4,
    paddingTop: SPACING * 4 + (StatusBar.currentHeight ?? 0),
    paddingBottom: SPACING * 4 + 10,
    gap: SPACING * 4,
  },
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
  button: {
    backgroundColor: PlatformColor('@android:color/system_accent1_50'),
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING * 4,
    borderRadius: ROUNDNESS + SPACING * 2,
  },
  buttonLabel: {
    textAlign: 'center',
    color: PlatformColor('@android:color/system_accent1_700'),
  },
});
