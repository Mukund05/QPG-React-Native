import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, {Ref, useEffect, useMemo, useRef} from 'react';
import Header from '../../../utils/Header';
import {ScrollView} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {getOrder} from '../../../api/api';
import {fetchtoken} from '../../../utils/fetchItem';
import {useDispatch, useSelector} from 'react-redux';
import {setOrderData} from '../../../store/Features/OrderData';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RefreshControl} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ModalDropdown from 'react-native-modal-dropdown';
import Toast from 'react-native-toast-message';

const OrderHistory: React.FC<{navigation: any}> = ({navigation}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<number | null>(
    null,
  );
  const selector = useSelector((state: any) => state.orderData);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState<any>(
    selector?.orderData ? selector.orderData : null,
  );
  const {loader} = selector;
  const toast = useToast();
  const dropdownRef = useRef<ModalDropdown>(null);

  const fetchOrders = async () => {
    try {
      const token = await fetchtoken();
      const response = await getOrder(token);
      if (response.status === true) {
        setData(response.data);
        dispatch(setOrderData(response.data));
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Something went wrong',
        visibilityTime: 1500,
      })
      console.log('ORDER HISTORY::ERROR', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchOrders();
    }
  }, []);

  const handleClick = (item: any) => {
    navigation.navigate('View History', {data: item});
  };

  function formatDate(inputDate: any) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Data status, 1--> confirm, 0 --> pending, 2 --> cancel
  const onStatusSelect = (index: number) => {
    setSelectedStatus(index); // Immediately apply filtering
    const filteredData = selector.orderData.filter((item: any) =>
      index === 0
        ? true // Show all orders initially
        : item.status === index - 1,
    );
    // console.log('FILTERED DATA', filteredData);
    setData(filteredData);
  };

  return (
    <>
      <Header
        title="Order History"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
        bgColor="blue"
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View style={styles.colorPallet}>
            <View style={styles.color}>
              <Text style={styles.colorText}>Pending</Text>
              <Icon name="circle" size={10} color="#FFC436" />
            </View>
            <View style={styles.color}>
              <Text style={styles.colorText}>Confirmed</Text>
              <Icon name="circle" size={10} color="#65B741" />
            </View>
            <View style={styles.color}>
              <Text style={styles.colorText}>Cancelled</Text>
              <Icon name="circle" size={10} color="red" />
            </View>
          </View>

          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Order..."
              placeholderTextColor={'gray'}
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
            />
            <Icon name="search" size={20} color="grey" style={styles.searchIcon}/>
            {/* Implement filter dropdown bar here*/}
            <ModalDropdown
              options={['All', 'Pending', 'Confirmed', 'Cancelled']}
              defaultIndex={0}
              ref={dropdownRef}
              onSelect={(index: any) => onStatusSelect(index)}
              style={styles.dropdown}
              dropdownStyle={styles.dropdownList}
              textStyle={styles.dropdownText}
              dropdownTextStyle={styles.dropdownItemText}
              renderRow={(option: any, index: string, isSelected: boolean) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor:
                        index === selectedStatus?.toString()
                          ? '#ddd'
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    onStatusSelect(Number(index));
                    dropdownRef.current?.hide();
                  }}>
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              )}>
              <View style={styles.dropdownContent}>
                <Text style={styles.dropdownText}>
                  {selectedStatus !== null
                    ? ['All', 'Pending', 'Confirmed', 'Cancelled'][
                        selectedStatus
                      ]
                    : 'Select..'}
                </Text>
                <Icon
                  name="caret-down"
                  size={20}
                  color="black"
                  style={styles.dropdownIcon}
                />
              </View>
            </ModalDropdown>
          </View>

          {loader ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : (
            <View style={styles.orderDetails}>
              {data
                .filter(
                  (item: any) =>
                    item.id.toString().includes(searchTerm) ||
                    formatDate(item.created_at).includes(searchTerm) ||
                    item.total_amount.toString().includes(searchTerm)
                )
                .map((item: any) => (
                  <View
                    style={[
                      styles.orderCard,
                      {
                        backgroundColor: `${
                          item.status === 0
                            ? '#FFC436'
                            : item.status !== 2
                            ? '#65B741'
                            : 'red'
                        }`,
                      },
                    ]}
                    key={item.id}>
                    <View style={styles.orderItem}>
                      <Text style={styles.detailLabel}>Order No</Text>
                      <Text style={styles.comma}>:</Text>
                      <Text style={styles.details}>{item.id}</Text>
                    </View>
                    <View style={styles.orderItem}>
                      <Text style={styles.detailLabel}>Order Date:</Text>
                      <Text style={styles.comma}>:</Text>
                      <Text style={styles.details}>
                        {formatDate(item.created_at)}
                      </Text>
                    </View>
                    <View style={styles.orderItem}>
                      <Text style={styles.detailLabel}>Order Status</Text>
                      <Text style={styles.comma}>:</Text>
                      <Text style={styles.details}>
                        {item.status === 0
                          ? 'Pending'
                          : item.status !== 2
                          ? 'Confirmed'
                          : 'Cancelled'}
                      </Text>
                    </View>
                    <View style={styles.orderItem}>
                      <Text style={styles.detailLabel}>Order Amount</Text>
                      <Text style={styles.comma}>:</Text>
                      <Text style={styles.details}>₹ {item.total_amount}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleClick(item)}>
                      <Text style={styles.buttonText}>SHOW DETAILS</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bottomBut}
          onPress={() => {
            navigation.navigate('Order Page');
          }}>
          <View>
            <Text style={styles.bottomText}>Add Orders</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  colorPallet: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingVertical: 10,
    marginRight: 20,
  },
  color: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  colorText: {
    marginRight: 5,
    color: 'black',
    fontSize: 12,
    fontWeight: '500',
  },
  orderDetails: {
    marginHorizontal: 10,
  },
  orderCard: {
    width: '100%',
    backgroundColor: 'yellow',
    borderRadius: 10,
    elevation: 5,
    marginVertical: 10,
    padding: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    alignSelf: 'flex-start',
    marginStart: 12,
  },
  details: {
    fontSize: 16,
    fontWeight: 'bold',
    marginEnd: 12,
    color: 'white',
    alignSelf: 'flex-end',
  },
  comma: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    position: 'absolute',
    left: '50%',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '70%',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  bottomBut: {
    marginHorizontal: 10,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 25,
    width: '90%',
  },
  bottomText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    // marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: responsiveHeight(4.6),
    borderColor: 'gray',
    borderWidth: 1,
    // paddingHorizontal: 10,
    marginRight: 10,
    color: 'black',
    fontSize: responsiveFontSize(1.9),
    borderRadius: 5,
    paddingLeft: responsiveWidth(9),
  },
  dropdown: {
    width: responsiveWidth(30),
    // marginTop: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  dropdownText: {
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownList: {
    marginTop: -responsiveHeight(3.8),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    // borderRadius: 8,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  searchIcon: {
    position: 'absolute',
    left: responsiveWidth(5),
    top: responsiveHeight(1.2),
  },
});
