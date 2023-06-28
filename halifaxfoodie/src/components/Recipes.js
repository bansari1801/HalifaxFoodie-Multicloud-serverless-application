import UploadRecipeFile from './UploadRecipeFile';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

import AWS from 'aws-sdk';
import { useEffect, useState } from 'react';

//Reference: https://betterprogramming.pub/how-to-use-aws-dynamodb-in-react-70b55ffff93e
const fetchRecipes = async () => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const dbParams = {
    TableName: 'Recipe',
  };

  try {
    //Reference: https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
    const data = await dynamodb.scan(dbParams).promise();
    return data.Items;
  } catch (e) {
    console.log(e);
  }
  return [];
};

const extractIngredients = (recipe) => {
  console.log(recipe)
  const requestOptions = {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify(recipe)
};
  //Reference: https://www.copycat.dev/blog/react-fetch/
  fetch('https://5ixap4v6sbtkjgn5xu6h4zhvta0bhuxn.lambda-url.us-east-1.on.aws/',requestOptions)
  .then(response => 
    response.json()
  )
  .then(data => {
    alert(data.message)})
  .catch(err => console.log(err));
}

const Recipes = () => {
  const [recipeList, setRecipeList] = useState([]);
  const [showDialogBox, setDialogBox] = useState(false)
  const [recipeFile, setRecipeFile] = useState(null);

  const [recipeObj, setRecipeObj] = useState();

  useEffect(() => {
    callFetchRecipes();
   
  }, []);

  const callFetchRecipes = () => {
    setRecipeList(list => [])
    fetchRecipes().then((res) => {
      res.forEach((item) => {
        setRecipeList((recipe) => [...recipe, item]);
      });
    });
  }
  const onRecipeFileUpload = () => {
    callFetchRecipes()
  }

  const showDialog = (recipe) => {
    setDialogBox(true)
    setRecipeObj(recipe)
  }

  const handleRecipeFile = (e) => {
    setRecipeFile(e.target.files[0]);
  };

  const closeDialog = () => {
    setDialogBox(false);
    setRecipeFile(null)
  }

  const uploadRecipeFile = () => {
    console.log(recipeObj)
    //Reference: https://blog.devgenius.io/upload-files-to-amazon-s3-from-a-react-frontend-fbd8f0b26f5
    const awsBucket = new AWS.S3({
      params: { Bucket: process.env.REACT_APP_RECIPE_BUCKET_NAME },
      region: process.env.REACT_APP_REGION,
    });

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
          id: recipeObj.id,
          name: recipeObj.name,
          price: recipeObj.price,
          fileName: recipeFile.name,
        },
      };

      try {
        const data = dynamodb.put(dbParams).promise();
        alert('File Uploaded Successfully');
        closeDialog()
        callFetchRecipes()
      } catch (e) {
        console.log(e);
      }
  }

  return (
    <div className="p-6">
      <h3>Recipes</h3>

      <UploadRecipeFile fileUploaded={onRecipeFileUpload}/>
      <br/>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Recipe Name</th>
            <th>Recipe Price</th>
            <th>File Name</th>
            <th>Extract Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {recipeList.map((recipe, index) => {
            return (
              <tr key={index}>
                <td>{recipe?.name}</td>
                <td>{recipe?.price}</td>
                <td>{recipe?.fileName}</td>
                <td>
                  <Button variant="primary" onClick={() => extractIngredients(recipe)}> Extract </Button> &nbsp; &nbsp;
                  <Button variant="primary" onClick={() => showDialog(recipe)}> Upload </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal show={showDialogBox} onHide={closeDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Recipe File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <input type="file" accept="text/plain" onChange={handleRecipeFile}></input>{' '}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="primary" onClick={uploadRecipeFile}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Recipes;
