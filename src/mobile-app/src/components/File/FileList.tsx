import React from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';

interface IProps<T> {
  listFile: T[];
  renderItem: ListRenderItem<T>;
  keyExtractorHandler: (item: T, index: number) => string;
  isHorizontal: boolean;
}

const FileList = <T extends object>({
  listFile,
  keyExtractorHandler,
  renderItem,
  isHorizontal,
}: IProps<T>) => {
  return (
    <FlatList 
      ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      horizontal={isHorizontal}
      keyExtractor={keyExtractorHandler}
      data={listFile}
      renderItem={renderItem}
    />
  );
};

export default FileList;
