import {useState} from 'react';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {Asset} from 'react-native-image-picker';

function useImageUpload() {
  const [image, setImage] = useState<Asset | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = async (email: string) => {
    if (!image) {
      return;
    }

    const formData = new FormData();
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
      const e = error as AxiosError;

      if (e.response) {
        // 서버 응답이 있는 경우의 에러 처리
        console.error('에러 상태 코드:', e.response.status);
      } else if (e.request) {
        // 요청은 이루어졌지만 응답을 받지 못한 경우
        console.error('응답을 받지 못함:', e.request);
      } else {
        // 요청 설정 중에 문제가 발생한 경우
        console.error('요청 오류:', e.message);
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
