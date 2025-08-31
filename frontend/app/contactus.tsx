import MyButton from '@/components/MyButton';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ContactUs = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!name || !email || !message) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        // Handle form submission logic (e.g., send data to an API or email)
        Alert.alert('Success', 'Your message has been sent!');

        // Reset form fields
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Contact Us</Text>

                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#555" />
                    <TextInput
                        style={styles.input}
                        placeholder="Your Name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="envelope" size={20} color="#555" />
                    <TextInput
                        style={styles.input}
                        placeholder="Your Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="comments" size={20} color="#555" />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Your Message"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <MyButton title="Submit" onPress={handleSubmit}   style={styles.submit}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "8%",
        marginTop:"2%",
        backgroundColor: '#f9f9f9',
    },
    scrollView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: "20%",
        color: 'green',
        textAlign: 'center',
    },
    submit:{
        alignSelf:"center"
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        width: '100%',
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
    },
    textArea: {
        height: 100,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
});

export default ContactUs;
