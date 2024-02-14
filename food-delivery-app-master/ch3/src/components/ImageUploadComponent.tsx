import React from 'react';
import {Button, View, Text, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import useImageUpload from '../hooks/useImageUpload';
import {StyleSheet} from 'react-native';

const ImageUploadComponent = ({onImageUploaded}) => {
  const {handleUploadImage, imageUrl, isUploading, setImage} = useImageUpload();

  const handleSelectPress = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        // 수정: 파일 자체를 상태에 설정
        if (response.assets && response.assets.length > 0) {
          setImage(response.assets[0]);
        }
      }
    });
  };

  const handleUploadPress = async () => {
    await handleUploadImage('user@example.com'); // 예시 이메일 주소
    if (imageUrl) {
      onImageUploaded(imageUrl);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity onPress={handleSelectPress}>
        <Text style={styles.label}>사진 선택하기</Text>
      </TouchableOpacity>
      <Button
        onPress={handleUploadPress}
        title="사진 올리기"
        disabled={isUploading}
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
  textInput: {
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 60,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 20,
    color: 'red',
  },
  buttonZone: {
    alignItems: 'center',
  },
});

export default ImageUploadComponent;
