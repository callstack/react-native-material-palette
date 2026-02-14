import * as ImagePicker from 'expo-image-picker';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  PlatformColor,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
  type ImageSourcePropType,
} from 'react-native';
import Demo from './Demo';
import { CUSTOM_HERO_ITEM, DISCOVER_ITEM, STORY_ITEM } from '../data';
import { PADDING, SPACING, GAP, ROUNDNESS, COLORS } from '../constants';
import PaletteExampleItem from '../components/PaletteExampleItem';

export default function CustomImage() {
  const [imageSource, setImageSource] = useState<ImageSourcePropType | null>(
    null
  );
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [demoOffsetY, setDemoOffsetY] = useState<number | null>(null);
  const scrollViewRef = useRef<ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    if (!imageSource || demoOffsetY === null) return;

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(demoOffsetY, 0),
        animated: true,
      });
    });
  }, [demoOffsetY, imageSource]);

  const loadImageFromUri = useCallback((uri: string, errorMessage: string) => {
    setIsLoadingImage(true);
    Image.getSize(
      uri,
      () => {
        setImageSource({ uri });
        setIsLoadingImage(false);
      },
      () => {
        setIsLoadingImage(false);
        Alert.alert('Image error', errorMessage);
      }
    );
  }, []);

  const pickFromGallery = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        loadImageFromUri(
          result.assets[0].uri,
          'Selected file could not be loaded as an image.'
        );
      }
    } catch {
      Alert.alert('Image error', 'Could not open image picker.');
    }
  }, [loadImageFromUri]);

  const loadFromUrl = useCallback(() => {
    Keyboard.dismiss();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        Alert.alert(
          'Invalid URL',
          'Please provide an HTTP or HTTPS image URL.'
        );
        return;
      }
      loadImageFromUri(
        parsed.toString(),
        'Could not load image from this URL.'
      );
    } catch {
      Alert.alert('Invalid URL', 'Please provide a valid image URL.');
    }
  }, [loadImageFromUri, urlInput]);

  const handleDemoLayout = useCallback((event: LayoutChangeEvent) => {
    setDemoOffsetY(event.nativeEvent.layout.y);
  }, []);

  const loadFromUrlDisabled = !urlInput.trim() || isLoadingImage;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.header}>Custom image</Text>
        <Text style={styles.subtitle}>
          Load from URL or gallery. Demo preview appears after image is loaded.
        </Text>
        <View style={styles.controlsCard}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            defaultValue={urlInput}
            onChangeText={setUrlInput}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={COLORS.subtitle}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={loadFromUrl}
          />
          <Pressable
            style={[
              styles.button,
              loadFromUrlDisabled && styles.buttonDisabled,
            ]}
            onPress={loadFromUrl}
            disabled={loadFromUrlDisabled}
          >
            <Text style={styles.buttonLabel}>Load from URL</Text>
          </Pressable>

          <Pressable
            style={[styles.button, isLoadingImage && styles.buttonDisabled]}
            onPress={pickFromGallery}
            disabled={isLoadingImage}
          >
            <Text style={styles.buttonLabel}>Pick from gallery</Text>
          </Pressable>
        </View>
        {imageSource ? (
          <CustomDemo imageSource={imageSource} onLayout={handleDemoLayout} />
        ) : null}
      </ScrollView>
    </View>
  );
}

function CustomDemo({
  imageSource,
  onLayout,
}: {
  imageSource: ImageSourcePropType;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const demoContent = {
    hero: { ...CUSTOM_HERO_ITEM, source: imageSource },
    discover: { ...DISCOVER_ITEM, source: imageSource },
    stories: { ...STORY_ITEM, source: imageSource },
  };

  return (
    <View onLayout={onLayout}>
      <Demo sourceOverride={imageSource} content={demoContent} />
      <Text style={styles.header}>Palette</Text>
      <View style={styles.paletteContainer}>
        <PaletteExampleItem image={imageSource} />
      </View>
    </View>
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
  paletteContainer: {
    padding: SPACING * 4,
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
  controlsCard: {
    marginHorizontal: PADDING,
    borderRadius: ROUNDNESS,
    padding: GAP,
    gap: SPACING,
    backgroundColor: COLORS.background,
    zIndex: 2,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING / 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: ROUNDNESS,
    paddingHorizontal: GAP,
    paddingVertical: SPACING * 2,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING * 2,
    backgroundColor: COLORS.background,
  },
  button: {
    marginVertical: SPACING / 2,
    backgroundColor: PlatformColor('@android:color/system_accent1_50'),
    paddingVertical: SPACING * 2,
    paddingHorizontal: GAP,
    borderRadius: ROUNDNESS + SPACING,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    textAlign: 'center',
    color: PlatformColor('@android:color/system_accent1_700'),
    fontSize: 14,
    fontWeight: '600',
  },
});
