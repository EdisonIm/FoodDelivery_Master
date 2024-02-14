import React from 'react';
import {Button, View, Text} from 'react-native';
import useImageUpload from '../hooks/useImageUpload';

const ImageUploadComponent = ({onImageUploaded}) => {
  const {handleSelectImage, handleUploadImage, imageUrl, isUploading} = useImageUpload();

  const handleUploadPress = async () => {
    await handleUploadImage();
    if (imageUrl) {
      onImageUploaded(imageUrl);
    }
  };

  return (
    <View>
      <Button
        onPress={handleUploadPress}
        title="사진 올리기"
        disabled={isUploading}
      />
      {isUploading && <Text>업로드 중...</Text>}
      {imageUrl && <Text>업로드 완료: {imageUrl}</Text>}
    </View>
  );
};

export default ImageUploadComponent;
