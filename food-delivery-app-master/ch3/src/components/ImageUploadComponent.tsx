import React, {useState} from 'react';
import {Button, View, Text, TouchableOpacity, TextInput} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import useImageUpload from '../hooks/useImageUpload';
import {StyleSheet} from 'react-native';

const ImageUploadComponent = ({
  onImageUploaded,
}: {
  onImageUploaded: (url: string) => void;
}) => {
  const {handleUploadImage, imageUrl, isUploading, setImage} = useImageUpload();
  const [email, setEmail] = useState(''); // 추가된 상태

  const handleSelectPress = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setImage(asset);
      }
    });
  };

  const handleUploadPress = async () => {
    await handleUploadImage(email); // 수정된 부분: 이메일 상태를 사용
    if (imageUrl) {
      onImageUploaded(imageUrl);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="이메일 주소 입력"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address" // 이메일 입력을 위한 키보드 타입 설정
        autoCapitalize="none" // 자동 대문자 변환 비활성화
      />
      <TouchableOpacity onPress={handleSelectPress}>
        <Text style={styles.label}>사진 선택하기(누르셈^_^)</Text>
      </TouchableOpacity>
      <Button
        onPress={handleUploadPress}
        title="사진 올리기"
        disabled={isUploading || !email} // 이메일이 없을 때 업로드 버튼 비활성화
      />
      {isUploading ? (
        <Text>업로드 중...^_^;;</Text>
      ) : imageUrl ? (
        <Text>업로드 완료!! : {imageUrl}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // 조정된 스타일
  },
  textInput: {
    height: 40, // 높이 설정
    marginVertical: 10, // 위아래 마진 추가
    width: '80%', // 넓이 설정
    borderColor: 'gray', // 테두리 색상
    borderWidth: 1, // 테두리 두께
    paddingHorizontal: 10, // 내부 좌우 패딩
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20, // 글씨 크기 조정
    color: 'red', // 글씨 색상 변경
    marginVertical: 10, // 위아래 마진 추가
  },
  buttonZone: {
    alignItems: 'center',
    marginTop: 20, // 버튼 위의 마진 추가
  },
});

export default ImageUploadComponent;
