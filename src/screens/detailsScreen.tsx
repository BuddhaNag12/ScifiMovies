import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useColorScheme} from 'react-native-appearance';
import LottieView from 'lottie-react-native';
import MovieDetails from '../components/MovieDetailsList';
import {datatype, DetailScreenProp, DetailScreenType} from '../types/types';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {getMovieDetails} from '../api';
interface DetailsScreenProps {
  route: DetailScreenProp;
  navigation: DetailScreenType;
}

const DetailsScreen = ({navigation, route}: DetailsScreenProps) => {
  const scheme = useColorScheme();
  const {colors} = useTheme();
  const {id} = route.params;

  
  const [loading, setLoading] = React.useState<boolean>(false);
  const [MovieData, setMoviesFetched] = React.useState<datatype>();

  React.useEffect(() => {
    setLoading(true);
    let isMounted: boolean = true;
    getMovieDetails(id)
      .then((res) => {
        if (isMounted) {
          setLoading(false);
          setMoviesFetched(res);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        isMounted = false;
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LottieView
          source={require('../../assets/loading.json')}
          autoPlay
          loop
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <LinearGradient
        start={{x: 1, y: 1}}
        end={{x: 1, y: 0}}
        colors={
          scheme == 'dark'
            ? ['#53515E', '#10545E', '#872350']
            : ['#53515E', '#F85555', '#BAFCDC']
        }
        style={styles.container}>
        {MovieData && !loading ? (
          <MovieDetails
            navigation={navigation}
            colors={colors}
            data={MovieData}
            theme={scheme == 'dark' ? 'dark' : 'light'}
          />
        ) : (
          <></>
        )}
      </LinearGradient>
    </ScrollView>
  );
};

DetailsScreen.sharedElements = (route: any) => {
  const {id} = route.params;
  return [`item.${id}.title`];
};
export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
