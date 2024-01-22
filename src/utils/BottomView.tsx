import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const BottomView = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <View style={styles.container}>
      {/* Content Above the Bottom Sheet */}
      <View style={styles.contentAbove}>
        <Text>Content Above</Text>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={() => (
          <TouchableOpacity
            style={styles.draggableHandle}
            onPress={() => bottomSheetRef.current?.snapTo(1)}
          >
            <Text>Drag me up</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default BottomView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentAbove: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  draggableHandle: {
    backgroundColor: 'lightgray',
    width: 40,
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
});
