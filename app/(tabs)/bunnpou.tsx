import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import {  useTheme, PaperProvider, Appbar, Card, Title, Paragraph, Searchbar, List, Divider, ActivityIndicator } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { ThemedView } from "@/components/ThemedView";


import { data as bunnpou } from 'hushigi-grammar';

const PAGESIZE = 20;

export default function Index() {
  const theme = useTheme(); // 获取当前主题
  const [allData, setAllData] = useState(bunnpou.grammar || []);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 新增初始加载状态
  const bgColor = {
    backgroundColor: theme.colors.background,
  }

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
      <View style={[styles.loading]}>
        <ActivityIndicator size='small' />
      </View>
    ) : null
  );

  const renderItem = ({ item }) => (
    <>
      <Link
        href={{
          pathname: '/gdetails',
          params: {
            gid: item.gid,
          },
        }}
      >
        <List.Item
          title={item.name}
          description={item.notes}
        />
        <Divider />
      </Link>
    </>
  );


  return (
    <PaperProvider>
      <ThemedView style={{height: '100%'}}>
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
      </ThemedView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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