import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, Alert} from 'react-native';
import axios, {AxiosError, AxiosResponse} from 'axios';
import Config from 'react-native-config';

interface AddressUploadComponentProps {
  userEmail: string;
}

const AddressUploadComponent: React.FC<AddressUploadComponentProps> = ({
  userEmail,
}) => {
  const [email, setEmail] = useState<string>(userEmail);
  const [zipCode, setZipCode] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [address3, setAddress3] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleZipCodeChange = (text: string) => {
    const sanitizedText = text.replace(/[^\d\s]/g, '');
    if (!sanitizedText) {
      setZipCode('');
    } else if (sanitizedText.startsWith('0') && sanitizedText.length > 1) {
      setZipCode(sanitizedText);
    } else {
      setZipCode(sanitizedText);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `${Config.API_URL_PAPAYATEST}/members/address`,
        {
          email,
          zipCode,
          address1,
          address2,
          address3,
        },
      );
      console.log('Response:', response.data);
      Alert.alert('성공^0^!', '주소가 성공적으로 바뀌었네요!!');
    } catch (axiosError) {
      const errorResponse = axiosError as AxiosError;
      console.error('Error during submission:', errorResponse);
      let errorMessage = 'Failed to submit. Please try again.';
      if (errorResponse.response) {
        errorMessage += `\nError Status Code: ${errorResponse.response.status}`;
      } else if (errorResponse.request) {
        errorMessage += '\nFailed to receive response from server.';
      } else if (errorResponse.message) {
        errorMessage += `\n${errorResponse.message}`;
      }
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log('Submission completed');
    }
  };

  return (
    <View style={styles.container}>
      <Text>User Email: {userEmail}</Text>
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={handleZipCodeChange}
        keyboardType="numeric"
        style={styles.textInput}
      />
      <TextInput
        placeholder="Address 1"
        value={address1}
        onChangeText={setAddress1}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Address 2"
        value={address2}
        onChangeText={setAddress2}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Address 3"
        value={address3}
        onChangeText={setAddress3}
        style={styles.textInput}
      />
      <Button
        onPress={handleSubmit}
        title="주소 입력"
        disabled={
          isSubmitting ||
          !email ||
          !zipCode ||
          !address1 ||
          !address2 ||
          !address3
        }
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 7,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default AddressUploadComponent;
