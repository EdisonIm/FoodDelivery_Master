import {useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';

function useImageUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectImage = event => {
    // 이미지 파일을 선택하는 로직
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUploadImage = async () => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      setIsUploading(true);
      const response = await axios.post(
        `${Config.API_URL_PAPAYATEST}/members/pic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setIsUploading(false);
      setImageUrl(response.data.imageUrl); // 서버로부터 받은 이미지 URL
    } catch (error) {
      setIsUploading(false);
      console.error('업로드 에러:', error);
    }
  };

  return {
    handleSelectImage,
    handleUploadImage,
    imageUrl,
    isUploading,
  };
}

export default useImageUpload;
