import React, {useState} from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import useImageUpload from '../hooks/useImageUpload';

const ImageUploadComponent = ({
  onImageUploaded,
}: {
  onImageUploaded: (url: string) => void;
}) => {
  const {handleUploadImage, imageUrl, isUploading, setImage} = useImageUpload();
  const [email, setEmail] = useState('');

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
        style={styles.textInput}
        placeholder="이메일 주소"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleSelectPress}>
        <Text style={styles.buttonText}>사진 선택하기</Text>
      </TouchableOpacity>
      <Button
        onPress={handleUploadPress}
        title="사진 올리기"
        disabled={isUploading || !email}
      />

      {/* isUploading이 true일 때 "업로드 중..." 텍스트 표시 */}
      {isUploading ? <Text>업로드 중...</Text> : null}

      {/* imageUrl이 존재할 때 "업로드 완료: [URL]" 텍스트 표시 */}
      {imageUrl ? <Text>업로드 완료: {imageUrl}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
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
  button: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImageUploadComponent;
