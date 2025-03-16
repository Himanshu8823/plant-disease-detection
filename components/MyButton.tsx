import { StyleSheet, TouchableOpacity, Text } from "react-native";

const MyButton = ({ title, onPress ,style}: { title: string, onPress: () => void,style:any }) => {
    return (
        <TouchableOpacity  

            activeOpacity={0.6}
            style={[styles.button,style]}
            onPress={onPress}
            >
                <Text
                    style={styles.buttonText}>{title}
                </Text>
            </TouchableOpacity>
    );
};

export default MyButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 50, 
        width: '60%',
        height: 60,
        
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});