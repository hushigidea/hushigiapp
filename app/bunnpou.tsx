import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, Card, Title, Paragraph, Searchbar, List, Divider } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

import bunnpou from './data.json';

const PAGESIZE = 20;

export default function Index() {
  const [allData, setAllData] = useState(bunnpou.grammar || []);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 新增初始加载状态

  useEffect(() => {
    const totalNum = allData.length;
    const calculatedTotalPage = Math.ceil(totalNum / PAGESIZE);
    setTotalPage(calculatedTotalPage);
    if (calculatedTotalPage > 0) {
      fetchData(0, calculatedTotalPage); // 初次加载页面时获取第一页数据
    }
  }, [allData]);

  useEffect(() => {
    handleSearch(searchQuery); // 当searchQuery变化时，触发搜索处理
  }, [searchQuery]);

  const fetchData = (page, totalPage) => {
    if (loading || page >= totalPage) return;

    setLoading(true);
    setTimeout(() => {
      const start = page * PAGESIZE;
      const end = start + PAGESIZE;
      const newData = allData.slice(start, end);

      setData(prevData => [...prevData, ...newData]);
      if (searchQuery === '') {
        setFilteredData(prevData => [...prevData, ...newData]);
      }
      setLoading(false);
    }, 1500);
  };

  const loadMoreData = () => {
    if (!loading && !isInitialLoad) { // 确保初始加载时不会触发
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, totalPage);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(data);
    } else {
      const filtered = allData.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredData(filtered);
    }
  };

  const renderFooter = () => (
    loading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    ) : null
  );

  const renderItem = ({ item }) => (
    <>
    <List.Item
      title={item.name}
      description={`This is a description for ${item.name}`}
    />
    <Divider />
  </>
    // <Card style={styles.card}>
    //   <Card.Content>
    //     <Title>{item.name}</Title>
    //     <Paragraph>This is a description for {item.name}</Paragraph>
    //   </Card.Content>
    // </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="文法の一覧" />
      </Appbar.Header>
      <Searchbar
        placeholder="お文法を検索"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlashList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          if (!isInitialLoad) loadMoreData();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        estimatedItemSize={100}
        onLayout={() => setIsInitialLoad(false)} // 初始布局完成后设置为false
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  searchbar: {
    margin: 10,
  },
});