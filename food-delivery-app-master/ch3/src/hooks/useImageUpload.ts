import {useState} from 'react';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {Asset} from 'react-native-image-picker';

function useImageUpload(onImageUploaded: (url: string) => void) {
  const [image, setImage] = useState<Asset | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUploadImage = async (email: string) => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append('multipartFile', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || 'upload.jpg',
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

      if (response.data) {
        if (response.data.image) {
          const {location} = response.data.image;
          if (location) {
            setImageUrl(location);
            onImageUploaded(location);
          }
        }
      }
    } catch (error) {
      const e = error as AxiosError;
      let errorMessage = '업로드 실패: ';
      if (e.response) {
        errorMessage += `에러 상태 코드: ${e.response.status}`;
      } else if (e.request) {
        errorMessage += '서버 응답 없음';
      } else {
        errorMessage += e.message;
      }
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleUploadImage,
    imageUrl,
    isUploading,
    setImage,
    uploadError,
  };
}

export default useImageUpload;
