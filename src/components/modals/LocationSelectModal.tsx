import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';
import type { location } from '@/types/location';

interface LocationSelectionModalProps {
  locations: location[];
  onSelect: (selection: location) => void;
  onClose: () => void;
};

function LocationSelectionModal({ locations, onSelect, onClose }: LocationSelectionModalProps) {
  const selectedResult = (index: number) => {
    onSelect(locations[index]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={[elements.tray, { margin: 20, padding: 20, height: 400 }]}>
        <View style={[styles.headerContainer]}>
          <Text style={[elements.mediumText, { flex: 1 }]}>
            Search Results:
            {locations.length}
          </Text>
          <TouchableOpacity activeOpacity={0.5} onPress={onClose} style={styles.closeButton}>
            <Text style={[elements.fieldTitle, { margin: 0 }]}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={[elements.standardDiv, { marginBottom: 0 }]} />
        <ScrollView style={styles.scrollView}>
          {
            locations.map((location: location, index: number) => {
              return (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.5}
                    style={styles.resultContainer}
                    onPress={() => selectedResult(index)}
                  >
                    <View style={styles.addressContainer}>
                      <Text style={elements.smallText}>
                        {location.address?.street}
                      </Text>
                      <Text style={elements.smallText}>
                        {location.address?.city}
                        {', '}
                        {location.address?.state}
                        {' '}
                        {location.address?.zip}
                      </Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Image source={require('@assets/icons/forward_narrow.png')} style={styles.arrowImage} />
                    </View>
                  </TouchableOpacity>
                  <View style={elements.standardDiv} />
                </React.Fragment>
              );
            })
          }
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000d5',
    alignContent: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    top: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 10,
  },
  resultContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addressContainer: {
    flex: 1,
  },
  arrowContainer: {
    justifyContent: 'center',
  },
  arrowImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});

export default LocationSelectionModal;
