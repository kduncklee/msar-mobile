import { Link } from "expo-router"
import { StyleSheet, View, Text } from "react-native";
import colors from "../styles/colors";
import { elements } from "../styles/elements";


const Page = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title]}>Settings</Text>
                <Link style={styles.closeContainer} href='../'>
                    <Text style={[elements.mediumText, { color: colors.yellow }]}>
                        Close
                    </Text>
                </Link>
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.secondaryBg
    },
    header: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        flex: 1,
        fontSize: 30,
        fontWeight: "500",
        color: colors.primaryText,
    },
    closeContainer: {
        marginRight: 0
    }

});

export default Page;