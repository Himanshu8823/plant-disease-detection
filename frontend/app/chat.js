import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [quickResponses, setQuickResponses] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(false);

  const flatListRef = useRef(null);
  const socketRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadUserData();
    loadChatHistory();
    loadSuggestions();
    loadQuickResponses();
    setupSocket();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadUserData = async () => {
    try {
      const userString = await AsyncStorage.getItem('userData');
      if (userString) {
        setUserData(JSON.parse(userString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const setupSocket = () => {
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
    });

    socketRef.current.on('chat_response', (data) => {
      addMessage('ai', data.message, data.timestamp);
      setLoading(false);
    });

    socketRef.current.on('chat_error', (data) => {
      Alert.alert('Error', data.error);
      setLoading(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  };

  const loadChatHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(
        'http://localhost:5000/api/chat/history',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const historyMessages = response.data.data.chats.map(chat => [
          { id: `user-${chat.id}`, type: 'user', text: chat.userMessage, timestamp: chat.timestamp },
          { id: `ai-${chat.id}`, type: 'ai', text: chat.aiResponse, timestamp: chat.timestamp }
        ]).flat().reverse();
        
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(
        'http://localhost:5000/api/chat/suggestions',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const loadQuickResponses = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(
        'http://localhost:5000/api/chat/quick-responses',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setQuickResponses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading quick responses:', error);
    }
  };

  const addMessage = (type, text, timestamp = new Date().toISOString()) => {
    const newMessage = {
      id: `${type}-${Date.now()}`,
      type,
      text,
      timestamp,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = text.trim();
    setInputText('');
    addMessage('user', userMessage);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (socketRef.current && socketRef.current.connected) {
        // Use real-time socket
        socketRef.current.emit('chat_message', {
          message: userMessage,
          userId: userData?.uid,
        });
      } else {
        // Fallback to REST API
        const response = await axios.post(
          'http://localhost:5000/api/chat/send',
          {
            message: userMessage,
            context: {
              recentDetections: messages.filter(m => m.type === 'user').slice(-3),
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          addMessage('ai', response.data.data.message, response.data.data.timestamp);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('ai', "I'm sorry, I'm having trouble right now. Please try again in a moment.");
      setLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    sendMessage(suggestion.message);
    setShowSuggestions(false);
  };

  const handleQuickResponsePress = (response) => {
    sendMessage(response.message);
    setShowQuickResponses(false);
  };

  const renderMessage = ({ item }) => (
    <Animated.View
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.aiMessage,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userBubble : styles.aiBubble,
      ]}>
        <Text style={[
          styles.messageText,
          item.type === 'user' ? styles.userText : styles.aiText,
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </Animated.View>
  );

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Ionicons 
        name={item.type === 'disease_followup' ? 'medical' : 'leaf'} 
        size={16} 
        color="#22c55e" 
      />
      <Text style={styles.suggestionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderQuickResponseCategory = ({ item }) => (
    <View style={styles.quickResponseCategory}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      {item.responses.map((response, index) => (
        <TouchableOpacity
          key={index}
          style={styles.quickResponseItem}
          onPress={() => handleQuickResponsePress(response)}
        >
          <Text style={styles.quickResponseText}>{response.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <LottieView
              source={require('../assets/animations/ai-expert.json')}
              autoPlay
              loop
              style={styles.headerAnimation}
            />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>AI Plant Expert</Text>
              <Text style={styles.headerSubtitle}>
                Ask me anything about plants and gardening
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowSuggestions(!showSuggestions)}
            >
              <Ionicons name="bulb" size={20} color="#22c55e" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowQuickResponses(!showQuickResponses)}
            >
              <Ionicons name="flash" size={20} color="#22c55e" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Suggestions */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggested Questions</Text>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item, index) => `suggestion-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsList}
            />
          </View>
        )}

        {/* Quick Responses */}
        {showQuickResponses && (
          <View style={styles.quickResponsesContainer}>
            <Text style={styles.quickResponsesTitle}>Quick Questions</Text>
            <FlatList
              data={quickResponses}
              renderItem={renderQuickResponseCategory}
              keyExtractor={(item, index) => `category-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickResponsesList}
            />
          </View>
        )}

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <LottieView
                source={require('../assets/animations/chat-welcome.json')}
                autoPlay
                loop
                style={styles.emptyAnimation}
              />
              <Text style={styles.emptyTitle}>Welcome to Plant Expert Chat!</Text>
              <Text style={styles.emptySubtitle}>
                I'm here to help you with all your plant care questions. 
                Feel free to ask anything about gardening, disease diagnosis, 
                or plant care tips.
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesList}
            />
          )}

          {loading && (
            <View style={styles.loadingMessage}>
              <LottieView
                source={require('../assets/animations/typing.json')}
                autoPlay
                loop
                style={styles.typingAnimation}
              />
              <Text style={styles.loadingText}>AI Expert is typing...</Text>
            </View>
          )}
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about plants, diseases, or gardening..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || loading}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#ffffff" : "#9ca3af"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAnimation: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  suggestionsList: {
    paddingHorizontal: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
  quickResponsesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  quickResponsesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  quickResponsesList: {
    paddingHorizontal: 20,
  },
  quickResponseCategory: {
    marginRight: 20,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  quickResponseItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
  },
  quickResponseText: {
    fontSize: 12,
    color: '#374151',
  },
  messagesContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  messagesList: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#22c55e',
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  typingAnimation: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#22c55e',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
});

export default Chat;