import React from 'react';
import {Text} from 'react-native';
import {StyleSheet, View, ViewToken} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

type ListItemProps = {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  item: {
    ClassID: string;
    ClassName: string;
  };
  handleClassPress: (classId: string, className: string) => void;
};

const ListItem: React.FC<ListItemProps> = React.memo(
  ({item, viewableItems, handleClassPress}) => {
    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter(item => item.isViewable)
          .find(viewableItem => viewableItem.item.ClassID === item.ClassID),
      );

      return {
        opacity: withTiming(isVisible ? 1 : 0),
        transform: [
          {
            scale: withTiming(isVisible ? 1 : 0.6),
          },
        ],
      };
    }, []);

    return (
      <Animated.View style={[styles.item, rStyle]}  onTouchEndCapture={() => handleClassPress(item.ClassID, item.ClassName)}>
        
          <Text
            style={{
              color: '#FFFBEB',
              fontSize: responsiveFontSize(2.3),
              fontWeight: 'bold',
            }}>
            {item.ClassName}
          </Text>
       
        <FontAwesome5Icon
          style={styles.icon}
          name="book"
          size={20}
          color="black"
          onPress={() => handleClassPress(item.ClassID, item.ClassName)}
        />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {},
  item: {
    height: responsiveScreenHeight(7),
    backgroundColor: '#78CAD2',
    borderRadius: 15,
    alignSelf: 'center',
    width: '90%',
    padding: responsiveScreenHeight(2),
    margin: responsiveScreenHeight(1),
    elevation: 2,
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export {ListItem};
