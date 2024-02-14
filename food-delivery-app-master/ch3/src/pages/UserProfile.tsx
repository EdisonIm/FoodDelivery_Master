import React, {useState} from 'react';
import {View, Text} from 'react-native';
import ImageUploadComponent from '../components/ImageUploadComponent';

const UserProfile = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const handleImageUploaded = url => {
    setUploadedImageUrl(url);
    // 여기에서 추가적인 로직을 수행할 수 있습니다 (예: 서버에 이미지 URL 저장)
  };

  return (
    <View>
      <Text>사용자 프로필 페이지</Text>
      <ImageUploadComponent onImageUploaded={handleImageUploaded} />
      {uploadedImageUrl && <Text>업로드된 이미지 URL: {uploadedImageUrl}</Text>}
    </View>
  );
};

export default UserProfile;
