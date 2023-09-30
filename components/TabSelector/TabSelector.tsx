import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import colors from '../../styles/colors';

type TabSelectorProps = {
    tabs: string[],
    onTabChange: (values: any) => void
}

const TabSelector = ({tabs, onTabChange}: TabSelectorProps) => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const tabSelected = (index: number) => {
        setSelectedIndex(index);
        onTabChange(index);
    }

    return (
        <View style={styles.container}>
            {
                tabs.map((tab: string, index: number) => {

                    var textColor: string = colors.grayText;
                    var divColor: string = colors.grayText;
                    if (index === selectedIndex) {
                        textColor = colors.yellow;
                        divColor = colors.yellow;
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.5}
                            style={[styles.button,{ borderBottomColor: divColor, borderBottomWidth: 2}]}
                            onPress={() => tabSelected(index)}>
                                <Text style={[styles.buttonLabel,{color: textColor}]}>{tab}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 40,
        marginHorizontal: 0,
        marginTop: 10,
        overflow: "hidden",
        
    },
    button: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center"
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center"
    }

});

export default TabSelector;