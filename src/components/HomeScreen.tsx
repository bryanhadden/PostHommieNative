import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { launchImageLibrary, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import Share from 'react-native-share';

interface ShareOptions {
  title?: string;
  message?: string;
  url?: string;
  social?: string;
}

interface MediaItem {
  uri: string;
  type: string;
  fileName?: string;
}

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

  const selectMedia = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      quality: 0.8,
      selectionLimit: 0, // 0 means no limit
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets) {
        const newMedia: MediaItem[] = response.assets.map(asset => ({
          uri: asset.uri || '',
          type: asset.type || 'image',
          fileName: asset.fileName,
        }));
        setSelectedMedia(newMedia);
      }
    });
  };

  const postToInstagram = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('No Media Selected', 'Please select photos or videos first.');
      return;
    }

    try {
      const shareOptions: ShareOptions = {
        title: 'Share to Instagram',
        message: 'Check out this amazing content!',
        url: selectedMedia[0].uri,
        social: Share.Social.INSTAGRAM,
      };

      const result = await Share.shareSingle(shareOptions);
      console.log('Instagram share result:', result);
    } catch (error) {
      console.error('Instagram share error:', error);
      Alert.alert('Error', 'Unable to share to Instagram. Make sure Instagram is installed.');
    }
  };

  const postToTikTok = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('No Media Selected', 'Please select photos or videos first.');
      return;
    }

    try {
      const shareOptions: ShareOptions = {
        title: 'Share to TikTok',
        message: 'Check out this amazing content!',
        url: selectedMedia[0].uri,
        // Note: TikTok doesn't have a direct share option in react-native-share
        // We'll use the generic share which will show TikTok in the share sheet
      };

      const result = await Share.open(shareOptions);
      console.log('TikTok share result:', result);
    } catch (error) {
      console.error('TikTok share error:', error);
      Alert.alert('Error', 'Unable to share content.');
    }
  };

  const clearSelection = () => {
    setSelectedMedia([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PostHommie</Text>
        <Text style={styles.subtitle}>Share your moments on Instagram & TikTok</Text>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.selectButton} onPress={selectMedia}>
          <Text style={styles.buttonText}>📷 Select Photos/Videos</Text>
        </TouchableOpacity>

        {selectedMedia.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
            <Text style={styles.clearButtonText}>Clear Selection</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedMedia.length > 0 && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Selected Media ({selectedMedia.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
            {selectedMedia.map((media, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
                <Text style={styles.mediaType}>
                  {media.type?.startsWith('video') ? '🎥' : '📷'}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedMedia.length > 0 && (
        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Share to:</Text>
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.instagramButton} onPress={postToInstagram}>
              <Text style={styles.shareButtonText}>📸 Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tiktokButton} onPress={postToTikTok}>
              <Text style={styles.shareButtonText}>🎵 TikTok</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          1. Tap "Select Photos/Videos" to choose media from your phone
        </Text>
        <Text style={styles.instructionText}>
          2. Preview your selected media
        </Text>
        <Text style={styles.instructionText}>
          3. Choose Instagram or TikTok to share your content
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  previewSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  mediaScroll: {
    marginBottom: 10,
  },
  mediaItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  mediaType: {
    fontSize: 20,
    marginTop: 5,
  },
  shareSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  instagramButton: {
    backgroundColor: '#E4405F',
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  tiktokButton: {
    backgroundColor: '#000',
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
