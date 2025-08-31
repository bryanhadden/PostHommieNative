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
  StatusBar,
  SafeAreaView,
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

const { width, height } = Dimensions.get('window');

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
        title: 'Check out this amazing content!',
        message: 'Shared via PostHommie',
        url: selectedMedia[0].uri,
        social: Share.Social.INSTAGRAM,
      };

      const result = await Share.shareSingle(shareOptions);
      console.log('Instagram share result:', result);
      
      // Show success message if sharing completed
      if (result.success !== false) {
        Alert.alert('Success!', 'Content shared to Instagram successfully!');
      }
    } catch (error: any) {
      console.error('Instagram share error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('User did not share')) {
        // User cancelled sharing - don't show error
        return;
      } else if (error.message?.includes('not installed')) {
        Alert.alert('Instagram Not Found', 'Please install Instagram to share content.');
      } else {
        // Try opening general share sheet as fallback
        try {
          await Share.open({
            title: 'Share via PostHommie',
            message: 'Check out this amazing content!',
            url: selectedMedia[0].uri,
          });
        } catch (fallbackError) {
          Alert.alert('Share Error', 'Unable to share content. Please try again.');
        }
      }
    }
  };

  const postToTikTok = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('No Media Selected', 'Please select photos or videos first.');
      return;
    }

    try {
      const shareOptions: ShareOptions = {
        title: 'Share via PostHommie',
        message: 'Check out this amazing content created with PostHommie!',
        url: selectedMedia[0].uri,
        // TikTok doesn't have a direct share option in react-native-share
        // We use the generic share which will show TikTok in the share sheet
      };

      const result = await Share.open(shareOptions);
      console.log('Share result:', result);
      
      // Show success message
      Alert.alert('Share Sheet Opened', 'Choose TikTok from the share options to post your content!');
    } catch (error: any) {
      console.error('Share error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('User did not share') || error.message?.includes('cancelled')) {
        // User cancelled sharing - don't show error
        return;
      } else {
        Alert.alert(
          'Share Unavailable', 
          'Unable to open share options. Please make sure you have apps installed that can share media content.'
        );
      }
    }
  };

  const clearSelection = () => {
    setSelectedMedia([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header Section - Airbnb Style */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Welcome back</Text>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>P</Text>
          </View>
        </View>
        <Text style={styles.mainTitle}>Ready to share your story?</Text>
        <Text style={styles.subtitle}>Capture moments and share them with the world</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Action Card */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Share Your Moments</Text>
            <Text style={styles.cardSubtitle}>Select photos or videos to get started</Text>
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={selectMedia}>
            <View style={styles.buttonIcon}>
              <Text style={styles.iconText}>📸</Text>
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Choose Media</Text>
              <Text style={styles.buttonSubtitle}>Photos & Videos</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Media Preview */}
        {selectedMedia.length > 0 && (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Selected ({selectedMedia.length})</Text>
              <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.mediaScroll}
              contentContainerStyle={styles.mediaScrollContent}
            >
              {selectedMedia.map((media, index) => (
                <View key={index} style={styles.mediaCard}>
                  <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                  <View style={styles.mediaTypeIndicator}>
                    <Text style={styles.mediaTypeIcon}>
                      {media.type?.startsWith('video') ? '🎥' : '📷'}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Share Options */}
        {selectedMedia.length > 0 && (
          <View style={styles.shareCard}>
            <Text style={styles.shareCardTitle}>Share to platforms</Text>
            
            <TouchableOpacity style={styles.platformButton} onPress={postToInstagram}>
              <View style={styles.platformIcon}>
                <Text style={styles.platformEmoji}>📸</Text>
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>Instagram</Text>
                <Text style={styles.platformDesc}>Share to your story or feed</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.platformButton} onPress={postToTikTok}>
              <View style={styles.platformIcon}>
                <Text style={styles.platformEmoji}>🎵</Text>
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>TikTok</Text>
                <Text style={styles.platformDesc}>Create engaging short videos</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Features Section */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>How PostHommie works</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureNumber}>
                <Text style={styles.featureNumberText}>1</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Select your media</Text>
                <Text style={styles.featureDescription}>Choose photos or videos from your gallery</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureNumber}>
                <Text style={styles.featureNumberText}>2</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Preview your content</Text>
                <Text style={styles.featureDescription}>Review your selection before sharing</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureNumber}>
                <Text style={styles.featureNumberText}>3</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Share to platforms</Text>
                <Text style={styles.featureDescription}>Post directly to Instagram or TikTok</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  
  // Header Styles
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },

  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Card Styles
  mainCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },

  // Primary Button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrow: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Preview Card
  previewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  clearText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mediaScroll: {
    marginHorizontal: -4,
  },
  mediaScrollContent: {
    paddingHorizontal: 4,
  },
  mediaCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginHorizontal: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  mediaTypeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mediaTypeIcon: {
    fontSize: 12,
  },

  // Share Card
  shareCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  shareCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 16,
  },

  // Platform Buttons
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  platformEmoji: {
    fontSize: 18,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 2,
  },
  platformDesc: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Features Card
  featuresCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  featureContent: {
    flex: 1,
    paddingTop: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
