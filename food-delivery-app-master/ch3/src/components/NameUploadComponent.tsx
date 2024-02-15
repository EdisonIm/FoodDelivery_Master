import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, Alert} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

const NameUploadComponent = ({userEmail}: {userEmail: string}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(
        `${Config.API_URL_PAPAYATEST}/members/name`,
        {
          email: userEmail,
          name: name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // API 호출이 성공하면 실행될 로직
      Alert.alert('굳샷!', '이름이 등록되었습니다^_^!');

      console.log(response.data);
    } catch (catchError) {
      const e = catchError as AxiosError; // AxiosError 타입을 사용합니다.
      let errorMessage = '업로드에 실패했습니다. 다시 시도해주세요ㅠ_ㅠ';
      if (e.response) {
        // 서버 응답이 있는 경우의 에러 처리
        errorMessage += `\n에러 상태 코드: ${e.response.status}`;
      } else if (e.request) {
        // 요청은 이루어졌지만 응답을 받지 못한 경우
        errorMessage += '\n서버에서 응답을 받지 못했습니다.';
      } else {
        // 요청 설정 중에 문제가 발생한 경우
        errorMessage += `\n${e.message}`;
      }
      setError(errorMessage);
      Alert.alert('에러', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="회원 이름"
        value={name}
        onChangeText={setName}
      />
      <Button
        title="이름 업로드"
        onPress={handleSubmit}
        disabled={isSubmitting || name.trim() === ''}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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
