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

interface ImageUploadComponentProps {
  onImageUploaded: (url: string) => void;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  onImageUploaded,
}) => {
  const {handleUploadImage, imageUrl, isUploading, setImage, uploadError} =
    useImageUpload(onImageUploaded);

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
    await handleUploadImage(email);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="이메일 주소"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
      />
      <TouchableOpacity onPress={handleSelectPress} style={styles.button}>
        <Text style={styles.buttonText}>사진 선택하기</Text>
      </TouchableOpacity>
      <Button
        onPress={handleUploadPress}
        title="사진 올리기"
        disabled={isUploading || !email}
      />
      {isUploading ? <Text>업로드 중...</Text> : null}
      {imageUrl ? <Text>업로드 완료: {imageUrl}</Text> : null}
      {uploadError ? <Text style={styles.errorText}>{uploadError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 7,
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ImageUploadComponent;
