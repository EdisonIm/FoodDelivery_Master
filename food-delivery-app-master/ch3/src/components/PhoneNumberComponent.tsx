import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Config from 'react-native-config';

interface PhoneNumberComponentProps {
  userEmail: string;
}

const PhoneNumberComponent: React.FC<PhoneNumberComponentProps> = ({
  userEmail,
}) => {
  const [email, setEmail] = useState<string>(userEmail);
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `${Config.API_URL_PAPAYATEST}/members/phone`,
        {
          email,
          phone,
        },
      );
      console.log('응답:', response.data);
      Alert.alert('성공!', '전화번호가 성공적으로 제출되었습니다!');
    } catch (axiosError) {
      const errorResponse = axiosError as AxiosError;
      console.error('제출 중 오류 발생:', errorResponse);
      let errorMessage = '제출에 실패했습니다. 다시 시도해주세요.';
      if (errorResponse.response) {
        errorMessage += `\n에러 상태 코드: ${errorResponse.response.status}`;
      } else if (errorResponse.request) {
        errorMessage += '\n서버에서 응답을 받지 못했습니다.';
      } else if (errorResponse.message) {
        errorMessage += `\n${errorResponse.message}`;
      }
      setError(errorMessage);
      Alert.alert('오류', errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log('제출 완료');
    }
  };

  return (
    <View style={styles.container}>
      <Text>사용자 이메일: {userEmail}</Text>
      <TextInput
        placeholder="이메일 주소"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="전화번호"
        value={phone}
        onChangeText={setPhone}
        style={styles.textInput}
        keyboardType="phone-pad"
      />
      <Button
        onPress={handleSubmit}
        title="전화번호 제출"
        disabled={isSubmitting || !email || !phone}
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

export default PhoneNumberComponent;
