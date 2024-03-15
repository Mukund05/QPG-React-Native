import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../../utils/Header';
import {fetchtoken} from '../../utils/fetchItem';
import {getReport} from '../../api/api';
import Toast from 'react-native-toast-message';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';

const ReportDetails: React.FC<{navigation: any}> = ({navigation}) => {
  const [list, setList] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchquery, setSearchQuery] = React.useState<string>('');

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const token = await fetchtoken();
      const response = await getReport(token);
      setList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('Error Fetching Report Details', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        visibilityTime: 1500,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (list.length === 0) {
      fetchReportDetails();
    }
  }, []);

  const RenderList = (label: any, value: any) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginVertical: responsiveHeight(1),
        }}>
        <Text style={styles.label}>{label} :</Text>
        <Text style={styles.value} textBreakStrategy={'highQuality'}>
          {value}
        </Text>
      </View>
    );
  };

  const formateDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header
        title="Report Details"
        bgColor="blue"
        leftIcon={'arrow-back'}
        onPressLeftIcon={() => navigation.goBack()}
      />
      <ScrollView
        style={{flex: 1, marginBottom: responsiveHeight(3)}}
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchReportDetails} />
        }>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search Report by School or date..."
            style={styles.input}
            value={searchquery}
            onChangeText={setSearchQuery}
            placeholderTextColor={'black'}
          />
          <Icon
            name="search"
            size={16}
            color="grey"
            style={styles.searchIcon}
          />
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{marginTop: responsiveHeight(40)}}
          />
        )}
        {!loading &&
          list?.length > 0 &&
          list
            .filter(
              (item: any) =>
                formateDate(item.created_at).includes(searchquery) ||
                item?.school_name
                  .toLowerCase()
                  .includes(searchquery.toLowerCase()),
            )
            .map((item: any) => (
              <View style={styles.card} key={item.id}>
                {RenderList('School Name', item.school_name)}
                {RenderList('Contact Person Name', item.person)}
                {RenderList('Contact Person No.', item.contact_no)}
                {RenderList('Strength', item.strength)}
                {RenderList('Remark', item.remark)}
                {RenderList('Date', formateDate(item.created_at))}
              </View>
            ))}
      </ScrollView>
    </>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveHeight(1.2),
    minHeight: responsiveHeight(4),
    marginHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(2),
  },
  input: {
    flex: 1,
    height: responsiveHeight(5),
    borderColor: 'gray',
    borderWidth: 1,
    // paddingHorizontal: 10,
    minHeight: responsiveHeight(5),
    maxHeight: responsiveHeight(5),
    color: 'black',
    fontSize: responsiveFontSize(1.9),
    borderRadius: 5,
    paddingLeft: responsiveWidth(9),
    paddingVertical: 0,
    backgroundColor: 'white',
  },
  searchIcon: {
    position: 'absolute',
    left: responsiveWidth(5),
    top: responsiveHeight(1.5),
  },
  card: {
    marginHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(2),
    backgroundColor: "white",
    borderRadius: 5,
    padding: responsiveHeight(2),
  },
  filed: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: responsiveHeight(1),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: 'grey',
    minWidth: responsiveWidth(40),
    fontWeight: 'bold',
  },
  value: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    maxWidth: responsiveWidth(50),
    lineHeight: 22,
    fontWeight: 'bold',
  },
});
