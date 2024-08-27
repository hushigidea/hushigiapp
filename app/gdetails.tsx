import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { View, StyleSheet, Text } from 'react-native';
import {  Chip, useTheme, PaperProvider, Appbar, Card, Title, Paragraph, Searchbar, List, Divider, ActivityIndicator } from 'react-native-paper';
import { find } from 'lodash';
import { data as bunnpou } from 'hushigi-grammar';

import { ThemedView } from '@/components/ThemedView';

export default function Details() {
  const { gid } = useLocalSearchParams();
  const grammar = find(bunnpou.grammar, { gid })
  return (
    <PaperProvider>
      <ThemedView style={{height: '100%'}}>
        <Card style={{margin:'10px'}}>
          <Card.Content>
            <Title>{grammar.name}</Title>
            <Paragraph>
              {grammar.tags && grammar.tags.map((item, index) => (
                <Chip key={index} icon='information' style={{marginRight:'10px'}}>{item}</Chip> 
              ))}
            </Paragraph>
            <Paragraph>
              <Text>{grammar.notes}</Text>
            </Paragraph>
            <Paragraph>
              {grammar.example && grammar.example.map((item, index) => (
                <View key={index}><Text>{item}</Text></View>
              ))}
            </Paragraph>
          </Card.Content>
        </Card>
      </ThemedView>
    </PaperProvider>
  );
}