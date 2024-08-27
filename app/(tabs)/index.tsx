import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { 
  PaperProvider, Appbar, Card, Title, Paragraph,
  Text, SegmentedButtons, Button, Banner,
} from 'react-native-paper';
import axios from 'axios';
import { data } from 'hushigi-grammar';

import { ThemedView } from '@/components/ThemedView';
import { getJSTDate, getServerLastModified  } from '@/utils/index'
import { Urls } from '@/constants/Urls';

const { kaiwaLatestJSON, kaiwaGidLatestJSON } = Urls;

function getRandomFields(data, fieldType, props, n) {
  // 检查输入参数的类型
  if (
    typeof data !== 'object' ||
    typeof fieldType !== 'string' ||
    typeof n !== 'number' ||
    !Array.isArray(props)
  ) {
    throw new Error('输入参数无效');
  }

  // 检查 fieldType 是否存在于 data 中，并且是否为数组
  if (!(fieldType in data) || !Array.isArray(data[fieldType])) {
    throw new Error(`字段类型 ${fieldType} 不是列表或不存在`);
  }

  const fieldArray = data[fieldType];

  // 过滤出需要的字段属性
  const filteredFields = fieldArray.map(item =>
    Object.fromEntries(props.map(prop => [prop, item[prop]]).filter(([_, value]) => value !== undefined))
  );

  // 检查是否有足够的字段可以选择
  if (filteredFields.length < n) {
    throw new Error('可用的字段不够');
  }

  // 随机打乱字段数组
  const shuffledFields = filteredFields.sort(() => Math.random() - 0.5);
  const selectedFields = shuffledFields.slice(0, n);

  // 返回一个对象，每个属性对应一个数组，数组中包含选中的字段
  const result = {};
  props.forEach(prop => {
    result[prop] = selectedFields.map(item => item[prop]);
  });

  return result;
}



const fetchData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache', // 禁用缓存
      },
    });
    const data = response.data;
    const lastModified = response.headers['last-modified'];
    return { data, lastModified };
  } catch (error) {
    throw error;
  }
};

const LanguageCard = ({ title, content }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Title>{title}</Title>
      <Paragraph>{content}</Paragraph>
    </Card.Content>
  </Card>
);

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [showUpdateTip, setShowUpdateTip] = useState(false);
  const [topic, setTopic] = useState([]);
  const [style, setStyle] = useState([]);
  const [gname, setGname] = useState([]);
  const [gid, setGid] = useState([]);
  const [value, setValue] = useState('wemode');
  const [languageValue, setLanguageValue] = useState('japanese');
  const [kaiwaInfo, setKaiwaInfo] = useState(null);
  const [grammarPointsInfo, setGrammarPointsInfo] = useState(null);

  async function loadAllData(cb) {
    try {
      const [{ data: kaiwaData, lastModified }, { data: grammarData, }] = await Promise.all([
        fetchData(kaiwaLatestJSON),
        fetchData(kaiwaGidLatestJSON),
      ]);
      setLastModified(getJSTDate(new Date(lastModified)));
      setKaiwaInfo(kaiwaData);
      setGrammarPointsInfo(grammarData);
      cb && cb();
    } catch (error) {
      console.error(error);
      cb && cb(error);
    }
  }
  useEffect(() => {
    loadAllData();
  }, []);

  const checkForUpdates = async () => {    
    const currentLastModified = await getServerLastModified(kaiwaLatestJSON);
    const currentLastModifiedString = getJSTDate(new Date(currentLastModified));
    if (currentLastModifiedString && currentLastModifiedString !== lastModified) {
      setShowUpdateTip(true); // 显示更新提示
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkForUpdates(); // 定期检查资源的最近修改时间
    }, 60000); // 每分钟检查一次

    return () => clearInterval(intervalId); // 组件卸载时清除定时器
  }, [lastModified]);

  useEffect(() => {
    changeRandomTopic();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData(() => {
      setRefreshing(false);
      setShowUpdateTip(false);
    });
  };

  const changeRandomTopic = () => {
    const t = getRandomFields(data, 'topics', ['name'], 1);
    const s = getRandomFields(data, 'styles', ['name'], 1);
    const { name : n, gid : g } = getRandomFields(data, 'grammar', ['name', 'gid'], 5);
    setTopic(t.name);
    setStyle(s.name);
    setGname(n);
    setGid(g);
  };

  const renderContent = (kaiwaInfo, languageValue) => (
    <>
      <Text variant="labelLarge">{"話題:\n"}</Text>
      <Text variant="labelMedium">{kaiwaInfo?.[languageValue]?.topic}</Text>
      <Text variant="labelLarge">{"\n\n会話スタイル:\n"}</Text>
      <Text variant="labelMedium">{kaiwaInfo?.style}</Text>
      <Text variant="labelLarge">{"\n\n文法:\n"}</Text>
      {grammarPointsInfo && grammarPointsInfo.name.map((item, index) => (
        <Link
          key={index}
          href={{
            pathname: '/gdetails',
            params: {
              gid: grammarPointsInfo && grammarPointsInfo['gid'][index]
            }
          }}
        >
          <Text variant="labelMedium">
            {item}{'\n'}
          </Text>
        </Link>
      ))}
      <Text variant="labelLarge">{"\n\n例文:\n"}</Text>
      <Text variant="labelMedium">{kaiwaInfo?.[languageValue]?.example}</Text>
    </>
  );

  return (
    <PaperProvider>
      <ThemedView style={{ height: '100%' }}>
        <Appbar.Header>
          <Appbar.Content title="会話練習" />
        </Appbar.Header>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        <Banner
          visible={showUpdateTip}
          actions={[
            {
              label: '閉じる',
              onPress: () => setShowUpdateTip(false),
            },
            {
              label: '更新',
              onPress: () => {
                loadAllData(()=>{
                  setShowUpdateTip(false);
                });          
              },
            },
          ]}
        >
          データが更新されました！
        </Banner>
          <ThemedView style={styles.segmentedBts}>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                { value: 'wemode', label: '今日の練習' },
                { value: 'randommode', label: 'ランダムパターン' },
              ]}
            />
          </ThemedView>

          {value === 'wemode' && (
            <ThemedView style={styles.segmentedBts}>
              <SegmentedButtons
                density="high"
                value={languageValue}
                onValueChange={setLanguageValue}
                buttons={[
                  { value: 'japanese', label: '日本語' },
                  { value: 'chinese', label: '中文' },
                  { value: 'english', label: 'English' },
                ]}
              />
              {languageValue === 'japanese' && (
                <LanguageCard
                  title="今日の会話練習"
                  content={renderContent(kaiwaInfo, languageValue)}
                />
              )}
              {languageValue === 'chinese' && (
                <LanguageCard
                  title="今天的会话练习"
                  content={renderContent(kaiwaInfo, languageValue)}
                />
              )}
              {languageValue === 'english' && (
                <LanguageCard
                  title="Today's conversation practice"
                  content={renderContent(kaiwaInfo, languageValue)}
                />
              )}
            </ThemedView>
          )}

          {value === 'randommode' && (
            <Card style={styles.card}>
              <Card.Content>
                <Title>今日の会話練習</Title>
                <Button mode="text" onPress={changeRandomTopic}>
                  チェンジ
                </Button>
                <Paragraph>
                  <Text variant="labelLarge">{"話題:\n"}</Text>
                  <Text variant="labelMedium">{topic}</Text>
                  <Text variant="labelLarge">{"\n\n会話スタイル:\n"}</Text>
                  <Text variant="labelMedium">{style}</Text>
                  <Text variant="labelLarge">{"\n\n文法:\n"}</Text>
                  {gname.map((item, index) => (
                    <Link
                      key={index}
                      href={{
                        pathname: '/gdetails',
                        params: {
                          gid: gid[index],
                        }
                      }}
                    >
                      <Text key={index} variant="labelMedium">
                        {item}{index < gname.length - 1 ? '\n' : ''}
                      </Text>
                    </Link>
                  ))}
                </Paragraph>
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </ThemedView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  segmentedBts: {
    padding: 10,
  },
  card: {
    margin: 10,
  },
});
