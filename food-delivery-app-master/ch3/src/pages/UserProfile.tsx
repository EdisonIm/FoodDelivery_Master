import React, {useState} from 'react';
import {View, Text} from 'react-native';
import ImageUploadComponent from '../components/ImageUploadComponent';
import NameUploadComponent from '../components/NameUploadComponent';

const UserProfile = () => {
  const userEmail = 'user@example.com';
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const handleImageUpload = (url: string) => {
    setUploadedImageUrl(url);
    // 필요한 경우 서버에 이미지 URL 저장 로직 추가
  };

  let uploadedImageText = null;
  if (uploadedImageUrl) {
    uploadedImageText = <Text>업로드된 이미지 URL: {uploadedImageUrl}</Text>;
  }

  return (
    <View>
      <Text>사용자 프로필 페이지</Text>
      <ImageUploadComponent onImageUploaded={handleImageUpload} />
      <NameUploadComponent userEmail={userEmail} />
      {uploadedImageText}
    </View>
  );
};

export default UserProfile;
