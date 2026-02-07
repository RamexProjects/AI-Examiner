import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Difficulty, QuestionType, RootStackParamList } from '../types';

// Wrap standard components to accept Tailwind classes
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledButton = styled(TouchableOpacity);

// Define the navigation type
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [qType, setQType] = useState<QuestionType>('Multiple Choice');

  const difficulties: Difficulty[] = ['Easy', 'Intermediate', 'Hard'];
  const types: QuestionType[] = ['True/False', 'Multiple Choice', 'Short Answer'];

  const handleStart = () => {
    if (!topic.trim()) {
      Alert.alert('Missing Topic', 'Please enter a topic!');
      return;
    }
    
    // NOTE: We will build the 'Quiz' screen in the next step. 
    // For now, this just logs to console.
    console.log('Navigating to Quiz with:', { topic, difficulty, qType });
    
    // navigation.navigate('Quiz', { topic, difficulty, questionType: qType });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        
        {/* Header */}
        <StyledView className="mt-10 mb-12">
          <StyledText className="text-4xl font-extrabold text-blue-500 text-center">
            AI Examiner
          </StyledText>
          <StyledText className="text-slate-400 text-center mt-2 text-lg">
            Test your knowledge on anything.
          </StyledText>
        </StyledView>

        {/* Topic Input */}
        <StyledView className="mb-8">
          <StyledText className="text-white mb-3 font-bold text-lg">I want to be tested on:</StyledText>
          <StyledInput 
            className="bg-slate-800 text-white p-5 rounded-xl border border-slate-700 text-lg"
            placeholder="e.g. History, Coding, Biology"
            placeholderTextColor="#64748b"
            value={topic}
            onChangeText={setTopic}
          />
        </StyledView>

        {/* Difficulty Selector */}
        <StyledView className="mb-8">
          <StyledText className="text-white mb-3 font-bold text-lg">Difficulty Level</StyledText>
          <StyledView className="flex-row gap-2">
            {difficulties.map((level) => (
              <StyledButton 
                key={level}
                onPress={() => setDifficulty(level)}
                className={`flex-1 p-4 rounded-xl items-center justify-center border ${
                  difficulty === level ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <StyledText className={`font-bold ${difficulty === level ? 'text-white' : 'text-slate-400'}`}>
                  {level}
                </StyledText>
              </StyledButton>
            ))}
          </StyledView>
        </StyledView>

        {/* Format Selector */}
        <StyledView className="mb-10">
          <StyledText className="text-white mb-3 font-bold text-lg">Format</StyledText>
          <StyledView className="gap-3">
            {types.map((type) => (
              <StyledButton 
                key={type}
                onPress={() => setQType(type)}
                className={`p-4 rounded-xl border flex-row items-center ${
                  qType === type ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'
                }`}
              >
                <StyledView className={`w-4 h-4 rounded-full mr-3 ${qType === type ? 'bg-blue-400' : 'bg-slate-600'}`} />
                <StyledText className={`font-bold text-lg ${qType === type ? 'text-blue-400' : 'text-slate-400'}`}>
                  {type}
                </StyledText>
              </StyledButton>
            ))}
          </StyledView>
        </StyledView>

        {/* Start Button */}
        <StyledButton 
          onPress={handleStart}
          className="bg-blue-500 p-5 rounded-xl shadow-lg shadow-blue-500/30"
        >
          <StyledText className="text-white text-center font-bold text-xl uppercase tracking-wider">
            Generate Quiz
          </StyledText>
        </StyledButton>

      </ScrollView>
    </SafeAreaView>
  );
}