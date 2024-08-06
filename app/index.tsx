import React, { useState } from 'react';
import { View, Image, StyleSheet, Platform, Button } from 'react-native';
import { Appbar, Card, Title, Paragraph, Searchbar, Text } from 'react-native-paper';

import { HelloWave } from '@/components/HelloWave';

import x from './data.json';

function getRandomFields(data, fieldType, n) {
  if (typeof data !== 'object' || data === null || Array.isArray(data) || typeof fieldType !== 'string' || typeof n !== 'number') {
    throw new Error('Invalid input parameters');
  }

  if (!Array.isArray(data[fieldType])) {
    throw new Error(`Field type ${fieldType} is not an array or does not exist`);
  }

  const fieldArray = data[fieldType];
  const filteredFields = fieldArray.map(item => item.name).filter(item => item !== undefined);

  if (filteredFields.length < n) {
    throw new Error('Not enough fields available');
  }

  const shuffledFields = filteredFields.sort(() => 0.5 - Math.random());
  return shuffledFields.slice(0, n);
}

export default function HomeScreen() {
  const [showCard, setShowCard] = useState(false);
  const [topic, setTopic] = useState([]);
  const [style, setStyle] = useState([]);
  const [grammars, setGrammars] = useState([]);

  const handlePress = () => {
    setTopic(getRandomFields(x, 'topics', 1));
    setStyle(getRandomFields(x, 'styles', 1));
    setGrammars(getRandomFields(x, 'grammar', 5));
    setShowCard(true);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <HelloWave/>
        <Appbar.Content onPress={handlePress} title="クリックして不思議な会話を始めよう！" style={styles.appbarContent} />
      </Appbar.Header>
      {showCard && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>今日の会話練習</Title>
            <Paragraph>
              <Text variant="labelLarge">{"Topic:\n"}</Text>
              <Text variant="labelMedium">{topic}</Text>
              <Text variant="labelLarge">{"\n\nStyle:\n"}</Text>
              <Text variant="labelMedium">{style}</Text>
              <Text variant="labelLarge">{"\n\nGrammar Points:\n"}</Text>
              {grammars.map((item, index) => (
                <Text key={index} variant="labelMedium">{item}{index < grammars.length - 1 ? '\n' : ''}</Text>
              ))} 
            </Paragraph>
          </Card.Content>
        </Card>
       )}
    </View>
  );

}

const styles = StyleSheet.create({
  appbarContent: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    padding: 10,
    alignItems: 'center',
  },
  card: {
    margin: 10,
  },
});
