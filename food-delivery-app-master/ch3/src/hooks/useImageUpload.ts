import {useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';

function useImageUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = async email => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    // 'uri', 'type', 'name'은 이미지 파일의 상세 정보를 포함해야 함
    // 'uri'는 로컬 파일 시스템의 이미지 경로, 'type'은 MIME 타입, 'name'은 파일 이름
    formData.append('multipartFile', {
      uri: image.uri,
      type: image.type || 'image/jpeg', // MIME 타입을 설정
      name: image.fileName || 'upload.jpg', // 파일 이름 설정
    });
    formData.append('email', email);

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
      if (
        response.data &&
        response.data.image &&
        response.data.image.location
      ) {
        // 'image.location'에서 이미지의 URL을 추출하여 상태에 저장합니다.
        setImageUrl(response.data.image.location);
      }
    } catch (error) {
      setIsUploading(false);
      // 에러 처리 로직은 이전과 동일

      if (error.response) {
        // 서버 응답이 있는 경우의 에러 처리
        console.error('에러 상태 코드:', error.response.status);
      } else if (error.request) {
        // 요청은 이루어졌지만 응답을 받지 못한 경우
        console.error('응답을 받지 못함:', error.request);
      } else {
        // 요청 설정 중에 문제가 발생한 경우
        console.error('요청 오류:', error.message);
      }
    }
  };

  return {
    handleUploadImage,
    imageUrl,
    isUploading,
    setImage,
  };
}

export default useImageUpload;
