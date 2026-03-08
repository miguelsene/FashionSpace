import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import WaveBackground from '@/components/animated/WaveBackground';
import { BlurView } from 'expo-blur';

const MOCK_POSTS = [
  {
    id: '1',
    bazarName: 'Bazar da Moda',
    bazarAvatar: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    caption: 'Nova coleção de verão chegando! 🌞 Peças exclusivas e únicas.',
    likes: 234,
    comments: 12,
    time: '2h atrás',
    commentsList: [
      { id: '1', user: 'Maria Silva', text: 'Adorei! Quando posso visitar?' },
      { id: '2', user: 'João Santos', text: 'Peças lindas! 😍' },
    ],
  },
  {
    id: '2',
    bazarName: 'Fashion Space',
    bazarAvatar: 'https://i.pravatar.cc/150?img=2',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    caption: 'Promoção especial! 30% OFF em toda loja até domingo! 🎉',
    likes: 189,
    comments: 8,
    time: '5h atrás',
    commentsList: [
      { id: '1', user: 'Ana Costa', text: 'Que promoção incrível!' },
    ],
  },
  {
    id: '3',
    bazarName: 'Estilo Único',
    bazarAvatar: 'https://i.pravatar.cc/150?img=3',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    caption: 'Peças artesanais feitas à mão. Cada uma conta uma história! ✨',
    likes: 156,
    comments: 5,
    time: '1d atrás',
    commentsList: [],
  },
];

export default function FeedScreen() {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState(MOCK_POSTS.map(post => ({ ...post, liked: false, showComments: false, commentText: '' })));

  const handleLike = useCallback((postId: string) => {
    setPosts(posts => posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  }, []);

  const handleShare = useCallback(async (post: typeof posts[0]) => {
    try {
      const postUrl = `fashionspace://post/${post.id}`;
      await Share.share({
        message: `${post.bazarName}: ${post.caption}\n\nVeja mais em: ${postUrl}`,
        title: `Post de ${post.bazarName}`,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const toggleComments = useCallback((postId: string) => {
    setPosts(posts => posts.map(post => 
      post.id === postId 
        ? { ...post, showComments: !post.showComments }
        : post
    ));
  }, []);

  const handleComment = useCallback((postId: string) => {
    setPosts(posts => {
      const post = posts.find(p => p.id === postId);
      if (post && post.commentText.trim()) {
        return posts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                comments: p.comments + 1, 
                commentText: '',
                commentsList: [...p.commentsList, { id: Date.now().toString(), user: 'Você', text: p.commentText }]
              }
            : p
        );
      }
      return posts;
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0a1929' : '#f4eddc' }]}>
      <WaveBackground />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#f4eddc' : '#000' }]}>Feed</Text>
          <Ionicons name="notifications-outline" size={24} color={isDark ? '#f4eddc' : '#000'} />
        </BlurView>

        <ScrollView showsVerticalScrollIndicator={false}>
          {posts.map(post => (
            <BlurView key={post.id} intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.bazarInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="storefront" size={24} color="#5f81a5" />
                  </View>
                  <View>
                    <Text style={[styles.bazarName, { color: isDark ? '#f4eddc' : '#000' }]}>{post.bazarName}</Text>
                    <Text style={[styles.postTime, { color: '#5f81a5' }]}>{post.time}</Text>
                  </View>
                </View>
              </View>

              <Image source={{ uri: post.image }} style={styles.postImage} />

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                  <Ionicons 
                    name={post.liked ? "heart" : "heart-outline"} 
                    size={28} 
                    color={post.liked ? "#FF6B9D" : (isDark ? '#f4eddc' : '#000')} 
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => toggleComments(post.id)}>
                  <Ionicons name="chatbubble-outline" size={26} color={isDark ? '#f4eddc' : '#000'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(post)}>
                  <Ionicons name="share-outline" size={26} color={isDark ? '#f4eddc' : '#000'} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.likes, { color: isDark ? '#f4eddc' : '#000' }]}>{post.likes} curtidas</Text>
              <Text style={[styles.caption, { color: isDark ? '#f4eddc' : '#000' }]}>
                <Text style={styles.bazarNameBold}>{post.bazarName}</Text> {post.caption}
              </Text>

              {post.comments > 0 && (
                <TouchableOpacity onPress={() => toggleComments(post.id)}>
                  <Text style={[styles.viewComments, { color: '#5f81a5' }]}>Ver todos os {post.comments} comentários</Text>
                </TouchableOpacity>
              )}

              {post.showComments && (
                <View style={styles.commentSection}>
                  {post.commentsList.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <Text style={[styles.commentUser, { color: isDark ? '#f4eddc' : '#000' }]}>{comment.user}</Text>
                      <Text style={[styles.commentText, { color: '#5f81a5' }]}>{comment.text}</Text>
                    </View>
                  ))}
                  <View style={styles.commentInputContainer}>
                    <TextInput
                      style={[styles.commentInput, { color: isDark ? '#f4eddc' : '#000' }]}
                      placeholder="Adicione um comentário..."
                      placeholderTextColor="#5f81a5"
                      value={post.commentText}
                      onChangeText={(text) => setPosts(posts.map(p => p.id === post.id ? { ...p, commentText: text } : p))}
                      multiline
                    />
                    <TouchableOpacity onPress={() => handleComment(post.id)}>
                      <Ionicons name="send" size={24} color="#5f81a5" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </BlurView>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(95, 129, 165, 0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  postCard: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bazarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(95, 129, 165, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bazarName: {
    fontSize: 14,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  actionButton: {
    padding: 4,
  },
  likes: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  bazarNameBold: {
    fontWeight: '600',
  },
  viewComments: {
    fontSize: 13,
    marginTop: 4,
  },
  commentSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(95, 129, 165, 0.2)',
  },
  commentItem: {
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
});
