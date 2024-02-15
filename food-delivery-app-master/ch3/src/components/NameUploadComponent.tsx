import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, Alert} from 'react-native'; // 'Text' 컴포넌트 추가
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

interface NameUploadComponentProps {
  userEmail: string;
}

const NameUploadComponent: React.FC<NameUploadComponentProps> = ({
  userEmail,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    console.log('Submitting:', {email, name});
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${Config.API_URL_PAPAYATEST}/members/name`,
        {
          email: email,
          name: name,
        },
      );
      console.log('Response:', response.data);
      Alert.alert('굳샷!', '이름이 등록되었습니다^_^!');
    } catch (catchError) {
      console.error('Error during submission:', catchError);
      const e = catchError as AxiosError;
      let errorMessage = '업로드에 실패했습니다. 다시 시도해주세요ㅠ_ㅠ';
      if (e.response) {
        errorMessage += `\n에러 상태 코드: ${e.response.status}`;
      } else if (e.request) {
        errorMessage += '\n서버에서 응답을 받지 못했습니다.';
      } else {
        errorMessage += `\n${e.message}`;
      }
      setError(errorMessage);
      Alert.alert('에러', errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log('Submission completed');
    }
  };

  return (
    <View style={styles.container}>
      <Text>User Email: {userEmail}</Text>
      <TextInput
        placeholder="이메일 주소"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="이름"
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />
      <Button
        onPress={handleSubmit}
        title="이름 등록"
        disabled={isSubmitting || !name || !email}
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

export default NameUploadComponent;
