import React from 'react';
import {Text, View} from 'react-native';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'papayatest',
  secretAccessKey: '5pU160RazpyKAbVvaSuovjrSEshXJCQlpCl1d0/T',
});

async function uploadImageToS3(
  imageFile: Buffer,
  bucketName: string,
  key: string,
): Promise<string> {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: imageFile,
    ACL: 'public-read', // 원하는 ACL 설정
  };

  try {
    const data = await s3.upload(params).promise();
    console.log('Upload Success', data.Location);
    return data.Location;
  } catch (err) {
    console.error('Upload Error', err);
    throw err;
  }
}

const imageBuffer = ... // 이미지 파일의 Buffer 데이터
const bucketName = 'YOUR_S3_BUCKET_NAME';
const key = 'example.jpg'; // S3에 저장될 파일 이름

uploadImageToS3(imageBuffer, bucketName, key)
  .then((imageUrl) => {
    console.log("Image URL:", imageUrl);
  })
  .catch((err) => {
    console.error("Error:", err);
  });

function ImageUpload() {
  return (
    <View>
      <Text>이미지 업로드 화면</Text>
    </View>
  );
}

export default ImageUpload;
