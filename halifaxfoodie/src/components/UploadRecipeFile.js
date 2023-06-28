import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import React, { useState } from 'react';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const UploadRecipeFile = (props) => {
  const [recipeFile, setRecipeFile] = useState(null);
  const [recipePrice, setRecipePrice] = useState(null);
  const [recipeName, setRecipeName] = useState(null);

  const handleRecipeName = (e) => {
    setRecipeName(e.target.value);
  };

  const handleRecipePrice = (e) => {
    setRecipePrice(e.target.value)
  }

  const handleRecipeFile = (e) => {
    setRecipeFile(e.target.files[0]);
  };

  //Reference: https://blog.devgenius.io/upload-files-to-amazon-s3-from-a-react-frontend-fbd8f0b26f5
  const uploadRecipeFile = async () => {
    console.log(process.env.REACT_APP_ACCESS);
    const awsBucket = new AWS.S3({
      params: { Bucket: process.env.REACT_APP_RECIPE_BUCKET_NAME },
      region: process.env.REACT_APP_REGION,
    });
    if (recipeFile != null && recipeName != null) {
      const params = {
        ACL: 'public-read',
        Body: recipeFile,
        Bucket: process.env.REACT_APP_RECIPE_BUCKET_NAME,
        Key: recipeFile.name,
      };

      awsBucket
        .putObject(params)
        .on('httpUploadProgress', (e) => {
          console.log('file uploading');
        })
        .send((err) => {
          if (err) console.log(err);
        });
//Reference: https://betterprogramming.pub/how-to-use-aws-dynamodb-in-react-70b55ffff93e
      const dynamodb = new AWS.DynamoDB.DocumentClient();

      const dbParams = {
        TableName: 'Recipe',
        Item: {
          id: uuidv4(),
          name: recipeName,
          price: recipePrice,
          fileName: recipeFile.name,
        },
      };

      try {
        const data = dynamodb.put(dbParams).promise();
        alert('File Uploaded Successfully');
        props.fileUploaded();
      } catch (e) {
        console.log(e);
      }
    } else {
      alert('Enter recipe name and select recipe file to upload it');
    }
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <input type="text" placeholder="Enter Recipe Name" onChange={handleRecipeName}></input> 
          <input type="number" placeholder="Enter Recipe Price" onChange={handleRecipePrice}></input> 
          <input type="file" accept="text/plain" onChange={handleRecipeFile}></input>{' '}
          <Button variant="primary" onClick={uploadRecipeFile}>
            Upload Recipe
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UploadRecipeFile;
